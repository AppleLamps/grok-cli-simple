const fs = require('fs').promises;
const path = require('path');

class FileScanner {
  constructor(workingDirectory) {
    this.workingDirectory = workingDirectory;
    this.extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.scala', '.html', '.css', '.json', '.md', '.txt'];
    this.lastScanErrors = [];
    this.lastIndexErrors = [];
  }

  async scanProjectFiles(options = {}) {
    const {
      limit = 20,
      includeContent = true,
      includeMetadata = false,
      includeHidden = false
    } = options;

    try {
      const files = await this.getRelevantFiles('.', { limit, includeHidden });
      const projectContext = [];

      for (const file of files) {
        const entry = {
          path: path.relative(this.workingDirectory, file)
        };

        if (includeContent) {
          try {
            entry.content = await fs.readFile(file, 'utf8');
          } catch (error) {
            // Skip files that can't be read
            continue;
          }
        }

        if (includeMetadata) {
          try {
            const stats = await fs.stat(file);
            entry.size = stats.size;
            entry.modified = stats.mtime.toISOString();
          } catch (error) {
            // Ignore metadata errors
          }
        }

        projectContext.push(entry);
      }

      return projectContext;
    } catch (error) {
      console.log('Warning: Could not read project files');
      return [];
    }
  }

  async getRelevantFiles(dir = '.', options = {}) {
    const {
      limit = 1000, // Default to reasonable limit instead of infinity
      includeHidden = false,
      returnErrors = false
    } = options;

    const relevantFiles = [];
    const baseDir = path.isAbsolute(dir) ? dir : path.join(this.workingDirectory, dir);
    const errors = [];

    const scan = async (currentDir, depth = 0) => {
      if (relevantFiles.length >= limit || depth > 10) { // Prevent excessive depth
        return;
      }

      let items;
      try {
        items = await fs.readdir(currentDir, { withFileTypes: true });
      } catch (error) {
        if (error && typeof error === 'object') {
          let code = 'IO_ERROR';
          if (error.code === 'EACCES') code = 'PERMISSION_DENIED';
          else if (error.code === 'ENOENT') code = 'NOT_FOUND';
          errors.push({ path: currentDir, code, message: String(error.message || error) });
        } else {
          errors.push({ path: currentDir, code: 'IO_ERROR', message: 'Unknown error' });
        }
        return;
      }

      // Separate files and directories for parallel processing
      const files = [];
      const directories = [];

      for (const dirent of items) {
        const name = dirent.name;

        if (!includeHidden && name.startsWith('.')) {
          continue;
        }

        if (dirent.isDirectory()) {
          if (name === 'node_modules' || name === '.git') {
            continue;
          }
          directories.push(path.join(currentDir, name));
        } else if (dirent.isFile() && this._shouldIncludeFile(name)) {
          files.push(path.join(currentDir, name));
        }
      }

      // Add files to results (up to limit)
      const remainingSpace = limit - relevantFiles.length;
      if (remainingSpace > 0) {
        relevantFiles.push(...files.slice(0, remainingSpace));
      }

      // Early exit if limit reached
      if (relevantFiles.length >= limit) {
        return;
      }

      // Process directories in parallel with limited concurrency
      const concurrencyLimit = Math.min(5, directories.length); // Limit to 5 concurrent directory scans
      const chunks = [];
      
      for (let i = 0; i < directories.length; i += concurrencyLimit) {
        chunks.push(directories.slice(i, i + concurrencyLimit));
      }

      for (const chunk of chunks) {
        if (relevantFiles.length >= limit) {
          break;
        }
        
        await Promise.all(
          chunk.map(dirPath => scan(dirPath, depth + 1))
        );
      }
    };

    await scan(baseDir);
    this.lastScanErrors = errors;
    if (returnErrors) {
      return {
        files: relevantFiles.slice(0, Math.min(relevantFiles.length, limit)),
        errors,
        scannedSuccessfully: errors.length === 0
      };
    }
    return relevantFiles.slice(0, Math.min(relevantFiles.length, limit));
  }

  async buildDirectoryIndex(options = {}) {
    const {
      startPath = '.',
      maxDepth = 3,
      includeFiles = true,
      includeHidden = false,
      limit = 200,
      returnErrors = false
    } = options;

    const entries = [];
    const baseDir = path.isAbsolute(startPath) ? startPath : path.join(this.workingDirectory, startPath);
    const errors = [];

    const traverse = async (currentDir, depth) => {
      if (entries.length >= limit || depth > maxDepth) {
        return;
      }

      let items;
      try {
        items = await fs.readdir(currentDir, { withFileTypes: true });
      } catch (error) {
        if (error && typeof error === 'object') {
          let code = 'IO_ERROR';
          if (error.code === 'EACCES') code = 'PERMISSION_DENIED';
          else if (error.code === 'ENOENT') code = 'NOT_FOUND';
          errors.push({ path: currentDir, code, message: String(error.message || error) });
        } else {
          errors.push({ path: currentDir, code: 'IO_ERROR', message: 'Unknown error' });
        }
        return;
      }

      // Separate directories and files for batch processing
      const directories = [];
      const currentEntries = [];

      for (const dirent of items) {
        const name = dirent.name;

        if (!includeHidden && name.startsWith('.')) {
          continue;
        }

        const fullPath = path.join(currentDir, name);
        const relativePath = path.relative(this.workingDirectory, fullPath) || '.';

        if (dirent.isDirectory()) {
          if (name === 'node_modules' || name === '.git') {
            continue;
          }

          currentEntries.push({
            type: 'directory',
            path: relativePath
          });
          
          directories.push({ fullPath, depth: depth + 1 });
        } else if (includeFiles && dirent.isFile() && this._shouldIncludeFile(name)) {
          currentEntries.push({
            type: 'file',
            path: relativePath
          });
        }
      }

      // Add current entries (up to limit)
      const remainingSpace = limit - entries.length;
      if (remainingSpace > 0) {
        entries.push(...currentEntries.slice(0, remainingSpace));
      }

      // Early exit if limit reached
      if (entries.length >= limit) {
        return;
      }

      // Process directories in parallel with controlled concurrency
      const concurrencyLimit = Math.min(3, directories.length); // Conservative limit for directory indexing
      const chunks = [];
      
      for (let i = 0; i < directories.length; i += concurrencyLimit) {
        chunks.push(directories.slice(i, i + concurrencyLimit));
      }

      for (const chunk of chunks) {
        if (entries.length >= limit) {
          break;
        }
        
        await Promise.all(
          chunk.map(({ fullPath, depth }) => traverse(fullPath, depth))
        );
      }
    };

    await traverse(baseDir, 0);
    this.lastIndexErrors = errors;
    if (returnErrors) {
      return {
        entries,
        errors,
        scannedSuccessfully: errors.length === 0
      };
    }
    return entries;
  }

  _shouldIncludeFile(fileName) {
    const ext = path.extname(fileName);

    if (!this.extensions.includes(ext)) {
      return false;
    }

    if (fileName.includes('package-lock.json') || fileName.includes('.min.js')) {
      return false;
    }

    return true;
  }

  async readFileEntry(relativePath, options = {}) {
    if (typeof relativePath !== 'string' || relativePath.trim() === '') {
      throw new Error('readFileEntry requires a non-empty relative path.');
    }

    const {
      includeContent = true,
      includeMetadata = true
    } = options;

    const targetPath = this._resolvePath(relativePath);
    const entry = {
      path: path.relative(this.workingDirectory, targetPath).replace(/\\/g, '/')
    };

    if (includeContent) {
      entry.content = await fs.readFile(targetPath, 'utf8');
    }

    if (includeMetadata) {
      try {
        const stats = await fs.stat(targetPath);
        entry.size = stats.size;
        entry.modified = stats.mtime.toISOString();
      } catch (error) {
        // Ignore metadata failures
      }
    }

    return entry;
  }

  _resolvePath(relativePath) {
    const base = path.resolve(this.workingDirectory);
    const target = path.resolve(this.workingDirectory, relativePath);
    const rel = path.relative(base, target);

    // Use secure path.relative check instead of vulnerable startsWith
    // Empty or '.' means same directory - allowed
    if (rel === '' || rel === '.') {
      return target;
    }

    // If relative path starts with '..' or is absolute, it's outside workspace
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new Error(`Path "${relativePath}" is outside the working directory.`);
    }

    return target;
  }

  getLastScanErrors() {
    return Array.isArray(this.lastScanErrors) ? [...this.lastScanErrors] : [];
  }

  getLastIndexErrors() {
    return Array.isArray(this.lastIndexErrors) ? [...this.lastIndexErrors] : [];
  }
}

module.exports = FileScanner;

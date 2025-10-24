const fs = require('fs').promises;
const path = require('path');

class FileScanner {
  constructor(workingDirectory) {
    this.workingDirectory = workingDirectory;
    this.extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.scala', '.html', '.css', '.json', '.md', '.txt'];
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
      limit = Number.POSITIVE_INFINITY,
      includeHidden = false
    } = options;

    const relevantFiles = [];
    const baseDir = path.isAbsolute(dir) ? dir : path.join(this.workingDirectory, dir);

    const scan = async (currentDir) => {
      if (relevantFiles.length >= limit) {
        return;
      }

      let items;
      try {
        items = await fs.readdir(currentDir, { withFileTypes: true });
      } catch (error) {
        return;
      }

      for (const dirent of items) {
        const name = dirent.name;

        if (!includeHidden && name.startsWith('.')) {
          continue;
        }

        if (dirent.isDirectory()) {
          if (name === 'node_modules' || name === '.git') {
            continue;
          }

          await scan(path.join(currentDir, name));

          if (relevantFiles.length >= limit) {
            break;
          }
        } else if (dirent.isFile()) {
          if (this._shouldIncludeFile(name)) {
            relevantFiles.push(path.join(currentDir, name));
            if (relevantFiles.length >= limit) {
              break;
            }
          }
        }
      }
    };

    await scan(baseDir);
    return relevantFiles.slice(0, Math.min(relevantFiles.length, limit));
  }

  async buildDirectoryIndex(options = {}) {
    const {
      startPath = '.',
      maxDepth = 3,
      includeFiles = true,
      includeHidden = false,
      limit = 200
    } = options;

    const entries = [];
    const baseDir = path.isAbsolute(startPath) ? startPath : path.join(this.workingDirectory, startPath);

    const traverse = async (currentDir, depth) => {
      if (entries.length >= limit || depth > maxDepth) {
        return;
      }

      let items;
      try {
        items = await fs.readdir(currentDir, { withFileTypes: true });
      } catch (error) {
        return;
      }

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

          entries.push({
            type: 'directory',
            path: relativePath
          });

          if (entries.length >= limit) {
            return;
          }

          await traverse(fullPath, depth + 1);

          if (entries.length >= limit) {
            return;
          }
        } else if (includeFiles && dirent.isFile() && this._shouldIncludeFile(name)) {
          entries.push({
            type: 'file',
            path: relativePath
          });

          if (entries.length >= limit) {
            return;
          }
        }
      }
    };

    await traverse(baseDir, 0);
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

    if (!target.toLowerCase().startsWith(base.toLowerCase())) {
      throw new Error(`Path "${relativePath}" is outside the working directory.`);
    }

    return target;
  }
}

module.exports = FileScanner;

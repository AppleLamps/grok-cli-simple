const fs = require('fs').promises;
const path = require('path');

class FileScanner {
  constructor(workingDirectory) {
    this.workingDirectory = workingDirectory;
    this.extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.scala', '.html', '.css', '.json', '.md', '.txt'];
  }

  async scanProjectFiles() {
    try {
      const files = await this.getRelevantFiles();
      const projectContext = [];

      for (const file of files) {
        try {
          const content = await fs.readFile(file, 'utf8');
          const relativePath = path.relative(this.workingDirectory, file);
          projectContext.push({
            path: relativePath,
            content: content
          });
        } catch (error) {
          // Skip files that can't be read
          continue;
        }
      }

      return projectContext;
    } catch (error) {
      console.log('Warning: Could not read project files');
      return [];
    }
  }

  async getRelevantFiles(dir = '.') {
    const relevantFiles = [];

    const scan = async (currentDir) => {
      try {
        const items = await fs.readdir(currentDir);

        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          const stat = await fs.stat(fullPath);

          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== '.git') {
            await scan(fullPath);
          } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (this.extensions.includes(ext) && !item.includes('package-lock.json') && !item.includes('.min.js')) {
              relevantFiles.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    };

    await scan(dir);
    return relevantFiles.slice(0, 20); // Limit to first 20 files
  }
}

module.exports = FileScanner;

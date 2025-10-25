const fs = require('fs').promises;
const path = require('path');
const { ensureInsideWorkingDirectory, validateSecurePath } = require('../utils/pathSecurity');
const { ensureString } = require('../utils/tool-helpers');

async function createFileTool(args, context) {
  const relativePath = ensureString(args?.path, 'path', 'create_file');
  const overwrite = Boolean(args?.overwrite);
  const content = typeof args?.content === 'string' ? args.content : '';
  const shouldRefresh = Boolean(args?.refresh_context);

  const targetPath = ensureInsideWorkingDirectory(relativePath, context.workingDirectory, 'create_file');
  const directory = path.dirname(targetPath);

  // Security: validate parent directory against symlinks
  try {
    const dirStats = await fs.lstat(directory);
    if (dirStats.isSymbolicLink()) {
      throw new Error(`Parent directory is a symlink, which is not allowed for security reasons.`);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  await fs.mkdir(directory, { recursive: true });

  // Security: validate target path (if it exists) against symlinks
  await validateSecurePath(targetPath, context.workingDirectory, 'create_file');

  const fileAlreadyExists = await fs.access(targetPath).then(() => true).catch(() => false);

  if (fileAlreadyExists && !overwrite) {
    throw new Error(`File "${relativePath}" already exists. Set "overwrite": true to replace it.`);
  }

  // Security: Use atomic operations to prevent TOCTOU vulnerabilities
  if (!fileAlreadyExists) {
    // For new files, use 'wx' flag to ensure exclusive creation
    const fd = await fs.open(targetPath, 'wx');
    try {
      await fd.writeFile(content, 'utf8');
    } finally {
      await fd.close();
    }
  } else {
    // For overwrites, write to temp file then atomic rename
    const tempPath = `${targetPath}.tmp.${Date.now()}`;
    await fs.writeFile(tempPath, content, 'utf8');
    
    try {
      await fs.rename(tempPath, targetPath);
    } catch (error) {
      // Cleanup temp file on rename failure
      await fs.unlink(tempPath).catch(() => {}); // Ignore cleanup errors
      throw error;
    }
  }

  // Security: post-write validation to ensure no symlink was created
  await validateSecurePath(targetPath, context.workingDirectory, 'create_file');

  let refreshedEntry = null;
  if (typeof context.refreshProjectEntry === 'function') {
    try {
      refreshedEntry = await context.refreshProjectEntry(relativePath, {
        includeContent: true,
        includeMetadata: true,
        changeType: fileAlreadyExists ? 'file_updated' : 'file_created',
        changeDetails: {
          tool: 'create_file',
          overwrite: fileAlreadyExists
        }
      });
    } catch (error) {
      // Ignore refresh errors; creation succeeded
    }
  }

  const result = {
    type: 'create_file_result',
    path: relativePath,
    status: fileAlreadyExists ? 'overwritten' : 'created',
    bytes_written: Buffer.byteLength(content, 'utf8')
  };

  if (refreshedEntry && refreshedEntry.modified) {
    result.modified = refreshedEntry.modified;
  }

  if (refreshedEntry && typeof refreshedEntry.size === 'number') {
    result.size = refreshedEntry.size;
  }

  if (shouldRefresh) {
    if (!context.fileScanner || typeof context.fileScanner.scanProjectFiles !== 'function' || typeof context.setProjectFiles !== 'function') {
      throw new Error('create_file tool cannot refresh context because scanning is unavailable.');
    }

    const refreshedFiles = await context.fileScanner.scanProjectFiles();
    context.setProjectFiles(refreshedFiles);

    result.refreshed_context = {
      count: refreshedFiles.length
    };
  }

  return result;
}

module.exports = createFileTool;

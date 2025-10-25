const fs = require('fs').promises;
const { ensureInsideWorkingDirectory, validateSecurePath } = require('../utils/pathSecurity');
const { ensureString, ensurePositiveInteger, applyLimitedReplacements } = require('../utils/tool-helpers');

// Extracted editFileTool from lib/tools/index.js with identical logic
async function editFileTool(args, context) {
  const relativePath = ensureString(args?.path, 'path', 'edit_file');
  const operations = Array.isArray(args?.operations) ? args.operations : null;
  const shouldRefresh = Boolean(args?.refresh_context);

  if (!operations || operations.length === 0) {
    throw new Error('Tool "edit_file" requires a non-empty "operations" array.');
  }

  const targetPath = ensureInsideWorkingDirectory(relativePath, context.workingDirectory, 'edit_file');

  // Security: validate against symlinks and path traversal
  await validateSecurePath(targetPath, context.workingDirectory, 'edit_file');

  let originalContent;

  try {
    originalContent = await fs.readFile(targetPath, 'utf8');
  } catch (error) {
    throw new Error(`File "${relativePath}" cannot be read. ${error.message || ''}`.trim());
  }

  let updatedContent = originalContent;
  const appliedOperations = [];

  for (let index = 0; index < operations.length; index += 1) {
    const operation = operations[index];

    if (!operation || typeof operation !== 'object') {
      throw new Error(`Tool "edit_file" operations[${index}] must be an object.`);
    }

    if (operation.type === 'replace') {
      const find = ensureString(operation.find, `operations[${index}].find`, 'edit_file');
      const replaceWith = typeof operation.replace === 'string' ? operation.replace : '';
      const replaceAll = Boolean(operation.replace_all);
      let limit = replaceAll ? Number.POSITIVE_INFINITY : 1;

      if (!replaceAll && operation.count !== undefined) {
        limit = ensurePositiveInteger(operation.count, `operations[${index}].count`, 'edit_file');
      }

      const { text, replacements } = applyLimitedReplacements(
        updatedContent,
        find,
        replaceWith,
        limit === Number.POSITIVE_INFINITY ? Number.MAX_SAFE_INTEGER : limit
      );

      if (replacements === 0) {
        // Return warning instead of throwing, allowing idempotent operations
        appliedOperations.push({ 
          index, 
          type: 'replace', 
          replacements: 0,
          warning: 'No matching text found to replace',
          suggestion: 'Use read_file to verify the exact content before editing',
          find_pattern_preview: find.substring(0, 100) + (find.length > 100 ? '...' : '')
        });
        continue;
      }

      updatedContent = text;
      appliedOperations.push({ index, type: 'replace', replacements });
      continue;
    }

    if (operation.type === 'replace_range') {
      const startLine = ensurePositiveInteger(operation.start, `operations[${index}].start`, 'edit_file');
      const endLine = ensurePositiveInteger(operation.end ?? operation.start, `operations[${index}].end`, 'edit_file');

      if (startLine > endLine) {
        throw new Error(`Tool "edit_file" operations[${index}].start must be <= end.`);
      }

      const replacementText = typeof operation.text === 'string' ? operation.text : '';
      const lines = updatedContent.split('\n');

      if (startLine > lines.length + 1) {
        throw new Error(`Tool "edit_file" operations[${index}] targets lines outside the file.`);
      }

      const deleteCount = Math.min(endLine, lines.length) - startLine + 1;
      const newLines = replacementText === '' ? [] : replacementText.split('\n');

      lines.splice(startLine - 1, Math.max(deleteCount, 0), ...newLines);
      updatedContent = lines.join('\n');
      appliedOperations.push({ index, type: 'replace_range', start: startLine, end: endLine });
      continue;
    }

    throw new Error(`Tool "edit_file" operations[${index}].type "${operation.type}" is not supported.`);
  }

  if (updatedContent === originalContent) {
    return {
      type: 'edit_file_result',
      path: relativePath,
      status: 'no_changes',
      operations_applied: appliedOperations
    };
  }

  // Security: Use atomic write to prevent TOCTOU vulnerabilities
  const tempPath = `${targetPath}.tmp.${Date.now()}`;
  await fs.writeFile(tempPath, updatedContent, 'utf8');
  
  try {
    await fs.rename(tempPath, targetPath);
  } catch (error) {
    // Cleanup temp file on rename failure
    await fs.unlink(tempPath).catch(() => {}); // Ignore cleanup errors
    throw error;
  }

  // Security: post-write validation to ensure no symlink was created
  await validateSecurePath(targetPath, context.workingDirectory, 'edit_file');

  let refreshedEntry = null;
  if (typeof context.refreshProjectEntry === 'function') {
    try {
      refreshedEntry = await context.refreshProjectEntry(relativePath, {
        includeContent: true,
        includeMetadata: true,
        changeType: 'file_updated',
        changeDetails: {
          tool: 'edit_file',
          operations: appliedOperations
        }
      });
    } catch (error) {
      // Ignore context refresh errors to avoid blocking the edit result
    }
  }

  const result = {
    type: 'edit_file_result',
    path: relativePath,
    status: 'updated',
    operations_applied: appliedOperations,
    bytes_written: Buffer.byteLength(updatedContent, 'utf8'),
    bytes_delta: Buffer.byteLength(updatedContent, 'utf8') - Buffer.byteLength(originalContent, 'utf8')
  };

  if (refreshedEntry && refreshedEntry.modified) {
    result.modified = refreshedEntry.modified;
  }

  if (refreshedEntry && typeof refreshedEntry.size === 'number') {
    result.size = refreshedEntry.size;
  }

  if (shouldRefresh) {
    if (!context.fileScanner || typeof context.fileScanner.scanProjectFiles !== 'function' || typeof context.setProjectFiles !== 'function') {
      throw new Error('edit_file tool cannot refresh context because scanning is unavailable.');
    }

    const refreshedFiles = await context.fileScanner.scanProjectFiles();
    context.setProjectFiles(refreshedFiles);

    result.refreshed_context = {
      count: refreshedFiles.length
    };
  }

  return result;
}

module.exports = editFileTool;

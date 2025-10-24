const fs = require('fs').promises;
const path = require('path');

function ensureString(value, fieldName, toolName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Tool "${toolName}" requires a non-empty string for "${fieldName}".`);
  }
  return value.trim();
}

function clampLines(lines, start, end) {
  const safeStart = Number.isInteger(start) ? Math.max(start, 1) : 1;
  const safeEnd = Number.isInteger(end) ? Math.min(end, lines.length) : lines.length;
  return [safeStart, safeEnd];
}

function ensureInsideWorkingDirectory(relativePath, workingDirectory, toolName) {
  const resolvedBase = path.resolve(workingDirectory);
  const resolvedTarget = path.resolve(workingDirectory, relativePath);

  if (!resolvedTarget.toLowerCase().startsWith(resolvedBase.toLowerCase())) {
    throw new Error(`Tool "${toolName}" cannot access paths outside the workspace.`);
  }

  return resolvedTarget;
}

function ensurePositiveInteger(value, fieldName, toolName) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Tool "${toolName}" requires a positive integer for "${fieldName}".`);
  }

  return parsed;
}

function applyLimitedReplacements(source, find, replaceWith, limit) {
  const parts = source.split(find);

  if (parts.length === 1) {
    return {
      text: source,
      replacements: 0
    };
  }

  const effectiveLimit = Math.min(limit, parts.length - 1);
  let result = '';

  for (let index = 0; index < parts.length - 1; index += 1) {
    result += parts[index];
    result += index < effectiveLimit ? replaceWith : find;
  }

  result += parts[parts.length - 1];

  return {
    text: result,
    replacements: effectiveLimit
  };
}

async function listContextTool(args, context) {
  const files = context.projectFiles || [];
  return {
    type: 'list_context_result',
    count: files.length,
    files: files.map((file) => ({
      path: file.path,
      size: file.content.length,
      preview: file.content.slice(0, 200)
    }))
  };
}

async function refreshContextTool(args, context) {
  const limit = Number.isInteger(args?.limit) ? Math.max(Math.min(args.limit, 100), 1) : 20;
  const includeMetadata = Boolean(args?.include_metadata);
  const includeHidden = Boolean(args?.include_hidden);
  const files = await context.fileScanner.scanProjectFiles({
    limit,
    includeContent: true,
    includeMetadata,
    includeHidden
  });
  context.setProjectFiles(files);
  return {
    type: 'refresh_context_result',
    message: `Project context refreshed with ${files.length} file${files.length === 1 ? '' : 's'}.`,
    files: files.map((file) => ({
      path: file.path,
      size: typeof file.content === 'string' ? file.content.length : file.size ?? 0,
      modified: file.modified
    }))
  };
}

async function readFileTool(args, context) {
  const relativePath = ensureString(args?.path, 'path', 'read_file');
  const targetPath = path.join(context.workingDirectory, relativePath);

  const rawContent = await fs.readFile(targetPath, 'utf8');
  let content = rawContent;

  if (args?.lines && (Number.isInteger(args.lines.start) || Number.isInteger(args.lines.end))) {
    const lines = rawContent.split('\n');
    const [start, end] = clampLines(lines, args.lines.start ?? 1, args.lines.end ?? lines.length);
    content = lines.slice(start - 1, end).join('\n');
  }

  if (content.length > 6000) {
    content = `${content.slice(0, 6000)}\n...\n[truncated]`;
  }

  return {
    type: 'read_file_result',
    path: relativePath,
    content
  };
}

async function searchCodeTool(args, context) {
  const query = ensureString(args?.query, 'query', 'search_code');
  const maxResults = Math.min(Math.max(args?.max_results ?? 20, 1), 50);
  const files = await context.fileScanner.getRelevantFiles();

  const matches = [];

  for (const filePath of files) {
    if (matches.length >= maxResults) {
      break;
    }

    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      const relativePath = path.relative(context.workingDirectory, filePath);

      lines.forEach((line, index) => {
        if (matches.length < maxResults && line.toLowerCase().includes(query.toLowerCase())) {
          matches.push({
            file: relativePath,
            line: index + 1,
            snippet: line.trim().slice(0, 200)
          });
        }
      });
    } catch (error) {
      // Skip unreadable files
    }
  }

  return {
    type: 'search_code_result',
    query,
    matches
  };
}

async function listDirectoryTool(args, context) {
  const startPath = typeof args?.path === 'string' && args.path.trim() !== '' ? args.path.trim() : '.';
  const maxDepth = Number.isInteger(args?.max_depth) ? Math.max(Math.min(args.max_depth, 10), 0) : 2;
  const includeFiles = args?.include_files !== undefined ? Boolean(args.include_files) : true;
  const includeHidden = Boolean(args?.include_hidden);
  const limit = Number.isInteger(args?.limit) ? Math.max(Math.min(args.limit, 500), 1) : 200;

  const entries = await context.fileScanner.buildDirectoryIndex({
    startPath,
    maxDepth,
    includeFiles,
    includeHidden,
    limit
  });

  return {
    type: 'directory_index_result',
    base_path: startPath,
    depth: maxDepth,
    entries,
    include_files: includeFiles
  };
}

async function editFileTool(args, context) {
  const relativePath = ensureString(args?.path, 'path', 'edit_file');
  const operations = Array.isArray(args?.operations) ? args.operations : null;
  const shouldRefresh = Boolean(args?.refresh_context);

  if (!operations || operations.length === 0) {
    throw new Error('Tool "edit_file" requires a non-empty "operations" array.');
  }

  const targetPath = ensureInsideWorkingDirectory(relativePath, context.workingDirectory, 'edit_file');
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
        throw new Error(`Tool "edit_file" could not find text to replace for operations[${index}].`);
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

  await fs.writeFile(targetPath, updatedContent, 'utf8');

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

async function createFileTool(args, context) {
  const relativePath = ensureString(args?.path, 'path', 'create_file');
  const overwrite = Boolean(args?.overwrite);
  const content = typeof args?.content === 'string' ? args.content : '';
  const shouldRefresh = Boolean(args?.refresh_context);

  const targetPath = ensureInsideWorkingDirectory(relativePath, context.workingDirectory, 'create_file');
  const directory = path.dirname(targetPath);

  await fs.mkdir(directory, { recursive: true });

  const fileAlreadyExists = await fs.access(targetPath).then(() => true).catch(() => false);

  if (fileAlreadyExists && !overwrite) {
    throw new Error(`File "${relativePath}" already exists. Set "overwrite": true to replace it.`);
  }

  await fs.writeFile(targetPath, content, 'utf8');

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

module.exports = {
  list_context: listContextTool,
  refresh_context: refreshContextTool,
  read_file: readFileTool,
  search_code: searchCodeTool,
  edit_file: editFileTool,
  create_file: createFileTool,
  list_directory: listDirectoryTool
};

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
  const files = await context.fileScanner.scanProjectFiles();
  context.setProjectFiles(files);
  return {
    type: 'refresh_context_result',
    message: `Project context refreshed with ${files.length} file${files.length === 1 ? '' : 's'}.`,
    files: files.map((file) => ({
      path: file.path,
      size: file.content.length
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

  const result = {
    type: 'create_file_result',
    path: relativePath,
    status: fileAlreadyExists ? 'overwritten' : 'created',
    bytes_written: Buffer.byteLength(content, 'utf8')
  };

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
  create_file: createFileTool
};

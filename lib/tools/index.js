const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Default limit for file scanning to prevent performance issues on large repos
const DEFAULT_SEARCH_LIMIT = 1000;

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

/**
 * Secure helper to validate a path is inside the workspace.
 * Uses path.relative() to prevent prefix attacks (e.g., /workspace vs /workspace-other).
 * @param {string} baseDir - Absolute base directory path
 * @param {string} targetPath - Absolute target path to validate
 * @param {string} toolName - Name of tool for error messages
 * @returns {string} The validated target path
 * @throws {Error} If path is outside workspace or attempts traversal
 */
function assertInsideWorkspace(baseDir, targetPath, toolName) {
  const base = path.resolve(baseDir);
  const target = path.resolve(targetPath);
  const rel = path.relative(base, target);

  // Empty or '.' means same directory - allowed
  if (rel === '' || rel === '.') {
    return target;
  }

  // If relative path starts with '..' or is absolute, it's outside workspace
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Tool "${toolName}" cannot access paths outside the workspace: ${path.basename(targetPath)}`);
  }

  return target;
}

function ensureInsideWorkingDirectory(relativePath, workingDirectory, toolName) {
  const resolvedBase = path.resolve(workingDirectory);
  const resolvedTarget = path.resolve(workingDirectory, relativePath);

  // Use secure path.relative check instead of vulnerable startsWith
  return assertInsideWorkspace(resolvedBase, resolvedTarget, toolName);
}

/**
 * Secure validation of file paths to prevent symlink attacks and path traversal.
 * Resolves symlinks consistently, validates workspace containment, and blocks symlink targets.
 * @param {string} targetPath - Absolute target path to validate
 * @param {string} workingDirectory - Absolute workspace root directory
 * @param {string} toolName - Name of tool for error messages
 * @throws {Error} If path is outside workspace, points to symlink, or resolves to invalid location
 */
async function validateSecurePath(targetPath, workingDirectory, toolName) {
  const realPath = await fs.realpath(targetPath).catch(() => targetPath);
  assertInsideWorkspace(path.resolve(workingDirectory), realPath, toolName);
  const stats = await fs.lstat(realPath).catch(() => null);
  if (stats && stats.isSymbolicLink()) {
    throw new Error(`Symlinks are not allowed for security reasons.`);
  }
}

function ensurePositiveInteger(value, fieldName, toolName) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Tool "${toolName}" requires a positive integer for "${fieldName}".`);
  }

  return parsed;
}

function applyLimitedReplacements(source, find, replaceWith, limit) {
  // Escape regex special characters for literal string matching
  const escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedFind, 'g');
  
  let replacements = 0;
  let lastIndex = 0;
  let result = '';
  
  if (limit <= 0) {
    return {
      text: source,
      replacements: 0
    };
  }
  
  // Use regex exec for non-overlapping matches
  let match;
  while ((match = regex.exec(source)) !== null && replacements < limit) {
    // Append text before match
    result += source.slice(lastIndex, match.index);
    // Append replacement
    result += replaceWith;
    lastIndex = regex.lastIndex;
    replacements++;
  }
  
  // Append remaining text
  result += source.slice(lastIndex);
  
  return {
    text: result,
    replacements
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
  const targetPath = ensureInsideWorkingDirectory(relativePath, context.workingDirectory, 'read_file');

  // Security: validate against symlinks and path traversal
  await validateSecurePath(targetPath, context.workingDirectory, 'read_file');

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
  const files = await context.fileScanner.getRelevantFiles('.', { 
    limit: DEFAULT_SEARCH_LIMIT,
    includeHidden: false 
  });

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
          warning: 'No matching text found to replace'
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

// OpenAI-compatible tool schemas for native tool calling
const toolSchemas = [
  {
    type: 'function',
    function: {
      name: 'list_context',
      description: 'List currently cached project files with metadata and content previews',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'refresh_context',
      description: 'Refresh the project file cache by scanning the workspace. Use when you need to see recently created/modified files.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'Maximum number of files to scan (1-100)',
            minimum: 1,
            maximum: 100,
            default: 20
          },
          include_metadata: {
            type: 'boolean',
            description: 'Include file size and modification time',
            default: false
          },
          include_hidden: {
            type: 'boolean',
            description: 'Include hidden files (starting with .)',
            default: false
          }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read the contents of a file in the workspace. Supports line range slicing.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Relative path to the file from workspace root'
          },
          lines: {
            type: 'object',
            description: 'Optional line range to read',
            properties: {
              start: {
                type: 'integer',
                description: '1-indexed start line',
                minimum: 1
              },
              end: {
                type: 'integer',
                description: '1-indexed end line',
                minimum: 1
              }
            }
          }
        },
        required: ['path']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_code',
      description: 'Search for text across all files in the workspace. Returns file paths, line numbers, and matching snippets.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query (case-insensitive substring match)'
          },
          max_results: {
            type: 'integer',
            description: 'Maximum number of matches to return (1-50)',
            minimum: 1,
            maximum: 50,
            default: 20
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_directory',
      description: 'List files and directories in the workspace with configurable depth and filtering',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Starting path (relative to workspace root)',
            default: '.'
          },
          max_depth: {
            type: 'integer',
            description: 'Maximum directory depth to traverse (0-10)',
            minimum: 0,
            maximum: 10,
            default: 2
          },
          include_files: {
            type: 'boolean',
            description: 'Include files in results',
            default: true
          },
          include_hidden: {
            type: 'boolean',
            description: 'Include hidden files/directories',
            default: false
          },
          limit: {
            type: 'integer',
            description: 'Maximum number of entries to return (1-500)',
            minimum: 1,
            maximum: 500,
            default: 200
          }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'edit_file',
      description: 'Edit an existing file using find/replace or line range operations. Multiple operations can be applied sequentially.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Relative path to the file'
          },
          operations: {
            type: 'array',
            description: 'Array of edit operations to apply',
            items: {
              type: 'object',
              oneOf: [
                {
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['replace'],
                      description: 'Find and replace operation'
                    },
                    find: {
                      type: 'string',
                      description: 'Text to find (literal string match)'
                    },
                    replace: {
                      type: 'string',
                      description: 'Replacement text'
                    },
                    replace_all: {
                      type: 'boolean',
                      description: 'Replace all occurrences (default: false, replaces first only)',
                      default: false
                    },
                    count: {
                      type: 'integer',
                      description: 'Number of replacements to make (ignored if replace_all is true)',
                      minimum: 1
                    }
                  },
                  required: ['type', 'find', 'replace']
                },
                {
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['replace_range'],
                      description: 'Replace a line range'
                    },
                    start: {
                      type: 'integer',
                      description: '1-indexed start line',
                      minimum: 1
                    },
                    end: {
                      type: 'integer',
                      description: '1-indexed end line',
                      minimum: 1
                    },
                    text: {
                      type: 'string',
                      description: 'Replacement text'
                    }
                  },
                  required: ['type', 'start', 'text']
                }
              ]
            }
          },
          refresh_context: {
            type: 'boolean',
            description: 'Refresh project context after edit',
            default: false
          }
        },
        required: ['path', 'operations']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_file',
      description: 'Create a new file or overwrite an existing file with specified content',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Relative path for the new file'
          },
          content: {
            type: 'string',
            description: 'File content',
            default: ''
          },
          overwrite: {
            type: 'boolean',
            description: 'Allow overwriting existing files',
            default: false
          },
          refresh_context: {
            type: 'boolean',
            description: 'Refresh project context after creation',
            default: false
          }
        },
        required: ['path']
      }
    }
  }
];

module.exports = {
  list_context: listContextTool,
  refresh_context: refreshContextTool,
  read_file: readFileTool,
  search_code: searchCodeTool,
  edit_file: editFileTool,
  create_file: createFileTool,
  list_directory: listDirectoryTool,
  assertInsideWorkspace, // Export for use in commands
  validateSecurePath, // Export for symlink validation in commands
  toolSchemas // Export schemas for native tool calling
};

const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { assertInsideWorkspace, ensureInsideWorkingDirectory, validateSecurePath } = require('../utils/pathSecurity');
const { ensureString, clampLines, ensurePositiveInteger, applyLimitedReplacements, DEFAULT_SEARCH_LIMIT } = require('../utils/tool-helpers');
const editFileTool = require('./edit-file');
const readFileTool = require('./read-file');
const searchCodeTool = require('./search-code');
const listDirectoryTool = require('./list-directory');
const createFileTool = require('./create-file');
const toolSchemas = require('./schemas');


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

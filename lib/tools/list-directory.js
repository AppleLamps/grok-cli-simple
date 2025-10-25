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

module.exports = listDirectoryTool;

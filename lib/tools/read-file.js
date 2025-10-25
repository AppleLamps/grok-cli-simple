const fs = require('fs').promises;
const { ensureInsideWorkingDirectory, validateSecurePath } = require('../utils/pathSecurity');
const { ensureString, clampLines } = require('../utils/tool-helpers');

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

module.exports = readFileTool;

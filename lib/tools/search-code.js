const fs = require('fs').promises;
const path = require('path');
const { ensureString, DEFAULT_SEARCH_LIMIT } = require('../utils/tool-helpers');

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

module.exports = searchCodeTool;

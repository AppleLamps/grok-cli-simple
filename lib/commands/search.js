const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { askQuestion } = require('../utils/prompt');

// Default limit for file scanning to prevent performance issues on large repos
const DEFAULT_SEARCH_LIMIT = 1000;

/**
 * Highlight all occurrences of the query in the text (case-insensitive)
 * @param {string} text - The text to highlight
 * @param {string} query - The query to highlight
 * @returns {string} Text with highlighted query
 */
function highlightQuery(text, query) {
  // Escape special regex characters
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Create case-insensitive regex with global flag
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  // Replace matches with highlighted version
  return text.replace(regex, (match) => chalk.bgYellow.black(match));
}

async function searchCommand(input, context) {
  const query = input.slice(7).trim();

  if (!query) {
    context.ui.error('Please provide a search query. Usage: search <query>');
    return;
  }

  console.log('');
  context.ui.header(`Searching for: "${query}"`, '🔍');
  context.ui.divider();

  try {
    const files = await context.fileScanner.getRelevantFiles('.', {
      limit: DEFAULT_SEARCH_LIMIT,
      includeHidden: false
    });
    const results = [];

    for (const filePath of files) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const lines = content.split('\n');
        const relativePath = path.relative(context.workingDirectory, filePath);

        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              file: relativePath,
              line: index + 1,
              content: line.trim()
            });
          }
        });
      } catch (error) {
        // Skip files that can't be read
        continue;
      }
    }

    if (results.length === 0) {
      context.ui.info(`No results found for "${query}"`);
      context.ui.divider();
      return;
    }

    context.ui.info(`Found ${results.length} result(s)`);
    console.log('');

    // Group by file
    const groupedResults = {};
    results.forEach(result => {
      if (!groupedResults[result.file]) {
        groupedResults[result.file] = [];
      }
      groupedResults[result.file].push(result);
    });

    // Display results
    for (const [file, matches] of Object.entries(groupedResults)) {
      console.log(`📄 ${file} (${matches.length} match${matches.length > 1 ? 'es' : ''}):`);
      matches.slice(0, 5).forEach((match) => {
        const highlightedContent = highlightQuery(match.content, query);
        console.log(`   Line ${match.line}: ${highlightedContent}`);
      });
      if (matches.length > 5) {
        console.log(`   ... and ${matches.length - 5} more match${matches.length - 5 > 1 ? 'es' : ''}`);
      }
      console.log('');
    }

    context.ui.divider();

    // Ask if they want AI analysis
    try {
      const analyze = await askQuestion(context.rl, 'Would you like me to analyze these results? (y/n): ');

      if (analyze.toLowerCase().startsWith('y')) {
        const summary = `Found "${query}" in ${Object.keys(groupedResults).length} file(s). Here are the matches:\n\n` +
          Object.entries(groupedResults).map(([file, matches]) =>
            `${file}:\n${matches.map(m => `  Line ${m.line}: ${m.content}`).join('\n')}`
          ).join('\n\n');

        await context.processMessage(`Analyze these search results:\n\n${summary}`, []);
      }
    } catch (error) {
      // readline might be closed in tests
      if (!error.message.includes('readline was closed')) {
        throw error;
      }
    }

  } catch (error) {
    context.ui.error(`Error searching: ${error.message}`);
  }
}

module.exports = searchCommand;

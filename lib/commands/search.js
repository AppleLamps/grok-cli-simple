const fs = require('fs').promises;
const path = require('path');
const { askQuestion } = require('../utils/prompt');

async function searchCommand(input, context) {
  const query = input.slice(7).trim();
  
  if (!query) {
    console.log('Please provide a search query. Usage: search <query>');
    return;
  }

  console.log(`\n🔍 Searching for "${query}" in project files...\n`);

  try {
    const files = await context.fileScanner.getRelevantFiles();
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
      console.log(`No results found for "${query}"\n`);
      return;
    }

    console.log(`Found ${results.length} result(s):\n`);
    
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
      matches.slice(0, 5).forEach(match => {
        console.log(`   Line ${match.line}: ${match.content}`);
      });
      if (matches.length > 5) {
        console.log(`   ... and ${matches.length - 5} more match${matches.length - 5 > 1 ? 'es' : ''}`);
      }
      console.log();
    }

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
    console.log(`Error searching: ${error.message}`);
  }
}

module.exports = searchCommand;

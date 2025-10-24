const fs = require('fs').promises;
const path = require('path');
const { askQuestion } = require('../utils/prompt');

const SECTION_DIVIDER = '─'.repeat(60);

async function readCommand(input, context) {
  const fileName = input.slice(5).trim();
  const filePath = path.join(context.workingDirectory, fileName);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    console.log(`\n${SECTION_DIVIDER}`);
    console.log(`📄 ${fileName}`);
    console.log(SECTION_DIVIDER);

    // Show first 30 lines, truncate if longer
    const lines = content.split('\n');
    const displayLines = lines.slice(0, 30);
    console.log(displayLines.join('\n'));

    if (lines.length > 30) {
      console.log(`\n... (${lines.length - 30} more lines)`);
    }

    console.log(`\n${SECTION_DIVIDER}`);

    // Ask if they want AI analysis
    const analyze = await askQuestion(context.rl, 'Would you like me to analyze this file? (y/n): ');

    if (analyze.toLowerCase().startsWith('y')) {
      await context.processMessage(`Analyze this file: ${fileName}\n\n${content}`, []);
    }

  } catch (error) {
    console.log(`\n${SECTION_DIVIDER}`);
    console.log(`Error reading file: ${error.message}`);
    console.log(SECTION_DIVIDER);
  }
}

module.exports = readCommand;

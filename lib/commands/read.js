const fs = require('fs').promises;
const path = require('path');
const { askQuestion } = require('../utils/prompt');
const { assertInsideWorkspace, validateSecurePath } = require('../utils/pathSecurity');

async function readCommand(input, context) {
  const fileName = input.slice(5).trim();

  if (!fileName) {
    context.ui.error('Please provide a filename. Usage: read <file>');
    return;
  }

  // Validate and resolve path using secure helper
  let filePath;
  try {
    const resolvedBase = path.resolve(context.workingDirectory);
    const resolvedTarget = path.resolve(context.workingDirectory, fileName);
    filePath = assertInsideWorkspace(resolvedBase, resolvedTarget, 'read');
    // Validate secure path (prevents symlink traversal)
    await validateSecurePath(filePath, context.workingDirectory, 'read');
  } catch (error) {
    context.ui.error(`Security Error: ${error.message}`);
    return;
  }

  try {
    const content = await fs.readFile(filePath, 'utf8');

    console.log('');
    context.ui.header(`Reading: ${fileName}`, '📄');
    context.ui.divider();

    // Show first 30 lines, truncate if longer
    const lines = content.split('\n');
    const displayLines = lines.slice(0, 30);
    console.log(displayLines.join('\n'));

    if (lines.length > 30) {
      console.log(`\n... (${lines.length - 30} more lines)`);
    }

    console.log('');
    context.ui.divider();

    // Ask if they want AI analysis
    const analyze = await askQuestion(context.rl, 'Would you like me to analyze this file? (y/n): ');

    if (analyze.toLowerCase().startsWith('y')) {
      await context.processMessage(`Analyze this file: ${fileName}\n\n${content}`, []);
    }

  } catch (error) {
    context.ui.error(`Error reading file: ${error.message}`);
  }
}

module.exports = readCommand;

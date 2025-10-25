const fs = require('fs').promises;
const path = require('path');
const open = require('open');
const { assertInsideWorkspace, validateSecurePath } = require('../utils/pathSecurity');
const { askQuestion } = require('../utils/prompt');

async function openCommand(input, context) {
  const fileName = input.slice(5).trim();
  
  if (!fileName) {
    console.log('Please provide a filename. Usage: open <file>');
    return;
  }

  // Validate and resolve path using secure helper
  let filePath;
  try {
    const resolvedBase = path.resolve(context.workingDirectory);
    const resolvedTarget = path.resolve(context.workingDirectory, fileName);
    filePath = assertInsideWorkspace(resolvedBase, resolvedTarget, 'open');
    // Validate secure path (prevents symlink traversal)
    await validateSecurePath(filePath, context.workingDirectory, 'open');
  } catch (error) {
    console.log(`Security Error: ${error.message}`);
    return;
  }

  try {
    // Check if path exists
    const stats = await fs.stat(filePath).catch(() => null);
    
    if (!stats) {
      console.log(`Path "${fileName}" does not exist.`);
      return;
    }

    // Handle directories explicitly - default to no for security
    if (stats.isDirectory()) {
      console.log(`⚠️  "${fileName}" is a directory. Opening directories may launch file managers or other applications.`);
      const confirm = await askQuestion(context.rl, `Continue and open directory? (y/N): `);
      if (!confirm.toLowerCase().startsWith('y')) {
        console.log('Cancelled for security.');
        return;
      }
    }

    // Handle non-regular files (sockets, devices, etc.) - more restrictive
    if (!stats.isFile() && !stats.isDirectory()) {
      console.log(`⚠️  SECURITY WARNING: "${fileName}" is not a regular file (type: special file/device).`);
      console.log('   Opening special files can be dangerous and may have unexpected system effects.');
      const confirm = await askQuestion(context.rl, `Are you sure you want to open this special file? (y/N): `);
      if (!confirm.toLowerCase().startsWith('y')) {
        console.log('Cancelled for security.');
        return;
      }
    }

    await open(filePath);
    console.log(`Opened ${fileName}`);
  } catch (error) {
    console.log(`Error opening file: ${error.message}`);
  }
}

module.exports = openCommand;

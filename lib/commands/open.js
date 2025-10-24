const path = require('path');
const open = require('open');

async function openCommand(input, context) {
  const fileName = input.slice(5).trim();
  const filePath = path.join(context.workingDirectory, fileName);

  try {
    await open(filePath);
    console.log(`Opened ${fileName}`);
  } catch (error) {
    console.log(`Error opening file: ${error.message}`);
  }
}

module.exports = openCommand;

async function helpCommand() {
  console.log('\n📖 Available Commands:');
  console.log('  help              Show this help message');
  console.log('  clear             Clear the terminal');
  console.log('  read <file>       Read and analyze a specific file');
  console.log('  edit <file>       Edit a file with AI suggestions');
  console.log('  search <query>    Search codebase for specific text');
  console.log('  open <file>       Open a file in your default editor');
  console.log('  history           Show recent tool usage details');
  console.log('  config ui         View or update UI preferences');
  console.log('  exit/quit         Exit LampCode');
  console.log('\nYou can also ask me to:');
  console.log('  • Write or modify code');
  console.log('  • Debug issues');
  console.log('  • Explain how things work');
  console.log('  • Run terminal commands');
  console.log('  • Analyze your project\n');
}

module.exports = helpCommand;

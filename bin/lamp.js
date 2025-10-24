#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const { LampCode } = require('../lib/lampcode');
const packageJson = require('../package.json');

const program = new Command();

// Create lib directory path
const libPath = path.join(__dirname, '..', 'lib');

// Ensure the main module exists
const mainModulePath = path.join(libPath, 'lampcode.js');
if (!fs.existsSync(mainModulePath)) {
  console.error('Error: LampCode module not found. Please run npm install first.');
  process.exit(1);
}

program
  .name('lamp')
  .description('A CLI coding assistant powered by OpenRouter API')
  .version(packageJson.version);

// Default command - start interactive chat
program
  .action(async () => {
    try {
      const lampCode = new LampCode();
      await lampCode.startChat();
    } catch (error) {
      console.error('Error starting LampCode:', error.message);
      process.exit(1);
    }
  });

// Help option
program.on('--help', () => {
  console.log('\nExamples:');
  console.log('  lamp                    Start interactive coding session');
  console.log('  lamp --help             Show this help message');
  console.log('  lamp --version          Show version number');
});

program.parse();

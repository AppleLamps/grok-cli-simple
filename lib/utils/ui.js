const chalk = require('chalk');

// Color scheme
const colors = {
  primary: chalk.cyan,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.blue,
  dim: chalk.gray,
  highlight: chalk.magenta,
  assistant: chalk.cyan.bold,
  user: chalk.green.bold,
  tool: chalk.yellow.bold
};

// Box drawing characters
const box = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  divider: '─'
};

class UI {
  constructor(width = 70) {
    this.width = width;
  }

  // Strip ANSI escape codes from text to get visible length
  stripAnsi(text) {
    // Regex to match ANSI escape sequences: \x1b[...m or \u001b[...m
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  }

  // Create a horizontal line
  line(char = box.horizontal) {
    return char.repeat(this.width);
  }

  // Create a boxed header
  header(text, icon = '🚀') {
    const content = ` ${icon} ${text} `;
    const visibleLength = this.stripAnsi(content).length;
    const padding = Math.max(0, this.width - visibleLength - 2);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;

    console.log(colors.primary(box.topLeft + box.horizontal.repeat(this.width - 2) + box.topRight));
    console.log(colors.primary(box.vertical) + ' '.repeat(leftPad) + colors.primary.bold(content) + ' '.repeat(rightPad) + colors.primary(box.vertical));
    console.log(colors.primary(box.bottomLeft + box.horizontal.repeat(this.width - 2) + box.bottomRight));
  }

  // Create a simple divider
  divider(color = colors.dim) {
    console.log(color(this.line()));
  }

  // Info message
  info(text, icon = 'ℹ') {
    console.log(colors.info(`${icon} ${text}`));
  }

  // Success message
  success(text, icon = '✓') {
    console.log(colors.success(`${icon} ${text}`));
  }

  // Warning message
  warning(text, icon = '⚠') {
    console.log(colors.warning(`${icon} ${text}`));
  }

  // Error message
  error(text, icon = '✗') {
    console.log(colors.error(`${icon} ${text}`));
  }

  // Tool invocation header
  toolHeader(toolName, args) {
    console.log('\n' + colors.dim(this.line()));
    console.log(colors.tool(`🔧 ${toolName}`));

    const keys = Object.keys(args);
    if (keys.length > 0 && keys.length <= 3) {
      keys.forEach(key => {
        const value = JSON.stringify(args[key]);
        const display = value.length > 50 ? value.slice(0, 50) + '...' : value;
        console.log(colors.dim(`   ${key}: ${display}`));
      });
    } else if (keys.length > 3) {
      console.log(colors.dim(`   ${keys.length} arguments provided`));
    }
  }

  // Tool result
  toolResult(toolName, result, duration) {
    console.log(colors.success(`   ✓ ${toolName} completed`) + colors.dim(` (${duration}ms)`));
  }

  // Tool error
  toolError(toolName, error, duration) {
    console.log(colors.error(`   ✗ ${toolName} failed: ${error}`));
    if (duration) {
      console.log(colors.dim(`   Duration: ${duration}ms`));
    }
  }

  // Assistant response box
  assistantMessage(message) {
    // Handle empty or whitespace-only messages
    if (!message || message.trim().length === 0) {
      message = '(No response)';
    }

    console.log('\n' + colors.assistant(box.topLeft + box.horizontal.repeat(this.width - 2) + box.topRight));
    console.log(colors.assistant(box.vertical) + ' ' + colors.assistant.bold('Assistant') + ' '.repeat(this.width - 13) + colors.assistant(box.vertical));
    console.log(colors.assistant(box.vertical) + box.horizontal.repeat(this.width - 2) + colors.assistant(box.vertical));

    // Word wrap the message
    const lines = this.wrapText(message, this.width - 4);

    // Ensure at least one line is displayed
    if (lines.length === 0) {
      lines.push('');
    }

    lines.forEach(line => {
      const visibleLength = this.stripAnsi(line).length;
      const padding = Math.max(0, this.width - visibleLength - 4);
      console.log(colors.assistant(box.vertical) + ' ' + line + ' '.repeat(padding + 1) + colors.assistant(box.vertical));
    });

    console.log(colors.assistant(box.bottomLeft + box.horizontal.repeat(this.width - 2) + box.bottomRight));
    console.log(colors.dim('\n→ Ready for your next prompt\n'));
  }

  // Processing indicator
  processing() {
    console.log('\n' + colors.info('⏳ Processing...'));
  }

  // Wrap text to fit width
  wrapText(text, maxWidth) {
    // Handle newlines explicitly
    const paragraphs = text.split('\n');
    const lines = [];

    paragraphs.forEach(paragraph => {
      // Handle empty lines
      if (paragraph.trim().length === 0) {
        lines.push('');
        return;
      }

      const words = paragraph.split(' ');
      let currentLine = '';

      words.forEach(word => {
        // Handle very long words that exceed maxWidth
        const wordVisibleLength = this.stripAnsi(word).length;
        if (wordVisibleLength > maxWidth) {
          // Push current line if it exists
          if (currentLine) {
            lines.push(currentLine);
            currentLine = '';
          }
          // Break the long word into chunks
          let remainingWord = word;
          while (this.stripAnsi(remainingWord).length > maxWidth) {
            const chunk = remainingWord.substring(0, maxWidth);
            lines.push(chunk);
            remainingWord = remainingWord.substring(maxWidth);
          }
          if (remainingWord) {
            currentLine = remainingWord;
          }
          return;
        }

        const potentialLine = currentLine ? currentLine + ' ' + word : word;
        const visibleLength = this.stripAnsi(potentialLine).length;

        if (visibleLength <= maxWidth) {
          currentLine = potentialLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      });

      if (currentLine) lines.push(currentLine);
    });

    return lines;
  }

  // Welcome screen
  welcome(fileCount, workingDir) {
    console.clear();
    this.header('LampCode - AI Coding Assistant', '🚀');
    console.log('');
    console.log(colors.dim('  Type ') + colors.primary.bold('help') + colors.dim(' to see available commands'));
    console.log(colors.dim('  Type ') + colors.primary.bold('exit') + colors.dim(' or ') + colors.primary.bold('quit') + colors.dim(' to end the session'));
    console.log('');

    if (fileCount > 0) {
      console.log(colors.success(`  📁 Loaded ${fileCount} project file${fileCount === 1 ? '' : 's'}`));
    }

    console.log(colors.dim(`  📂 ${workingDir}`));
    console.log('');
    this.divider();
    console.log('');
  }

  // Command list
  commandList() {
    console.log('');
    console.log(colors.primary.bold('Available Commands:'));
    console.log('');
    console.log(colors.primary('  help') + colors.dim('                        Show this help message'));
    console.log(colors.primary('  clear') + colors.dim('                       Clear the screen'));
    console.log(colors.primary('  read <file>') + colors.dim('                 Read and analyze a file'));
    console.log(colors.primary('  edit <file>') + colors.dim('                 Edit a file with AI assistance'));
    console.log(colors.primary('  search <query>') + colors.dim('              Search the codebase'));
    console.log(colors.primary('  open <file>') + colors.dim('                 Open a file in your editor'));
    console.log(colors.primary('  extract <schema> from <file>') + colors.dim('  Extract structured data using JSON schema'));
    console.log(colors.primary('  estimate cost "<prompt>"') + colors.dim('    Estimate API cost for a prompt'));
    console.log(colors.primary('  config') + colors.dim('                      View/change configuration'));
    console.log(colors.primary('  history') + colors.dim('                     View tool call history'));
    console.log(colors.primary('  clear-logs') + colors.dim('                  Clear all session logs'));
    console.log(colors.primary('  exit/quit') + colors.dim('                   End the session'));
    console.log('');
    console.log(colors.dim('Or just chat naturally - the AI will use tools automatically!'));
    console.log('');
  }

  // Goodbye message
  goodbye() {
    console.log('');
    this.divider(colors.primary);
    console.log(colors.primary.bold('  👋 Thanks for using LampCode!'));
    this.divider(colors.primary);
    console.log('');
  }
}

module.exports = UI;

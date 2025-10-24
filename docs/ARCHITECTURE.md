# LampCode Architecture

## 📐 Project Structure

```
lampcode/
├── bin/
│   └── lamp.js                 # CLI entry point, handles command parsing
│
├── lib/
│   ├── lampcode.js             # Main orchestrator class
│   │
│   ├── commands/               # Command modules (one per command)
│   │   ├── index.js            # Export all commands
│   │   ├── help.js             # Help command
│   │   ├── read.js             # Read file command
│   │   ├── edit.js             # Edit file with AI command
│   │   ├── search.js           # Search codebase command
│   │   └── open.js             # Open file command
│   │
│   └── utils/                  # Shared utilities
│       ├── apiClient.js        # OpenRouter API communication
│       ├── fileScanner.js      # Project file scanning
│       └── prompt.js           # Readline prompt helpers
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md         # This file
│   ├── CHANGELOG.md            # Version history
│   ├── EXAMPLES.md             # Usage examples
│   ├── FEATURES.md             # Feature guide
│   ├── QUICK-START.md          # Getting started
│   └── USAGE.md                # Usage guide
│
├── package.json                # NPM configuration
├── README.md                   # Main documentation
├── .env                        # Environment variables
├── .env.example                # Environment template
└── .gitignore                  # Git ignore rules
```

---

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
- **Commands** - Each command is a self-contained module
- **Utils** - Shared functionality extracted to reusable modules
- **Orchestrator** - Main class coordinates everything but doesn't implement details

### 2. **Modularity**
- Easy to add new commands (just create a new file in `commands/`)
- Easy to add new utilities (create in `utils/`)
- No need to modify existing code to add features

### 3. **Context Pattern**
Commands receive a context object with everything they need:
```javascript
{
  workingDirectory,  // Current directory
  apiClient,         // API communication
  fileScanner,       // File operations
  systemPrompt,      // AI system prompt
  rl,                // Readline interface
  processMessage     // AI chat function
}
```

---

## 📦 Core Components

### `lib/lampcode.js` - Main Orchestrator
**Responsibilities:**
- Initialize utilities (API client, file scanner)
- Set up readline interface
- Route commands to appropriate handlers
- Manage conversation history
- Process AI chat messages

**Key Methods:**
- `startChat()` - Start interactive session
- `getContext()` - Provide context to commands
- `processMessage()` - Handle AI chat

---

### `lib/commands/` - Command Modules

Each command is a separate module that exports a single async function:

```javascript
async function commandName(input, context) {
  // Command implementation
}

module.exports = commandName;
```

**Current Commands:**
- `help.js` - Display available commands
- `read.js` - Read and optionally analyze files
- `edit.js` - AI-assisted file editing
- `search.js` - Search codebase with optional AI analysis
- `open.js` - Open files in default editor

**Adding New Commands:**
1. Create `lib/commands/yourCommand.js`
2. Export async function
3. Add to `lib/commands/index.js`
4. Add route in `lib/lampcode.js` startChat()

---

### `lib/utils/` - Utility Modules

#### `apiClient.js` - API Communication
```javascript
class APIClient {
  makeRequest(messages)  // Send chat completion request
}
```

#### `fileScanner.js` - File Operations
```javascript
class FileScanner {
  scanProjectFiles()     // Get all project files with content
  getRelevantFiles()     // Get list of relevant file paths
}
```

#### `prompt.js` - User Input
```javascript
askQuestion(rl, question)  // Prompt user for input
```

---

## 🔄 Data Flow

### Command Execution Flow
```
User Input → lamp.js (CLI)
           ↓
    lampcode.js (orchestrator)
           ↓
    commands/[command].js
           ↓
    utils/[utility].js
           ↓
    Response to User
```

### AI Chat Flow
```
User Message → processMessage()
             ↓
       Build context (system prompt + history + project files)
             ↓
       apiClient.makeRequest()
             ↓
       OpenRouter API
             ↓
       Display Response
             ↓
       Update History
```

---

## 🎯 Design Decisions

### Why Separate Command Files?
- **Easier to maintain** - Each command is 50-150 lines, not 500+
- **Easier to test** - Test individual commands in isolation
- **Easier to extend** - Add new commands without touching existing code
- **Better collaboration** - Multiple developers can work on different commands

### Why Context Object?
- **Loose coupling** - Commands don't need to know about LampCode class internals
- **Flexibility** - Easy to add new context items without changing all commands
- **Testability** - Easy to mock context for testing

### Why Utils Folder?
- **Reusability** - Multiple commands can use same utilities
- **Single responsibility** - Each utility has one clear purpose
- **Easy to swap** - Can replace APIClient with different implementation

---

## 🚀 Adding New Features

### Example: Adding a "format" Command

1. **Create command file:**
```javascript
// lib/commands/format.js
async function formatCommand(input, context) {
  const fileName = input.slice(7).trim();
  // Implementation here
}
module.exports = formatCommand;
```

2. **Export in index:**
```javascript
// lib/commands/index.js
const formatCommand = require('./format');

module.exports = {
  // ... existing commands
  format: formatCommand
};
```

3. **Add route in orchestrator:**
```javascript
// lib/lampcode.js in startChat()
if (trimmedInput.startsWith('format ')) {
  await commands.format(input.trim(), this.getContext());
  this.rl.prompt();
  return;
}
```

4. **Update help:**
```javascript
// lib/commands/help.js
console.log('  format <file>     Format code file');
```

That's it! No changes to existing code needed.

---

## 📊 Code Metrics

### Before Refactor
- **1 monolithic file** - 523 lines
- **Mixed concerns** - Commands, utils, orchestration all together
- **Hard to extend** - Must edit large file for any change

### After Refactor
- **Main orchestrator** - 213 lines (focused on coordination)
- **6 command modules** - 30-120 lines each (single responsibility)
- **3 utility modules** - 40-70 lines each (reusable)
- **Total code** - Similar LOC, but organized and maintainable

---

## 🔮 Future Architecture

### Potential Enhancements

1. **Plugin System**
   - Load commands from `plugins/` directory
   - Allow third-party command extensions

2. **Config System**
   - `lib/config.js` for centralized configuration
   - Support multiple profiles

3. **Event System**
   - Emit events for command execution
   - Allow middleware/hooks

4. **Command Registry**
   - Auto-discover commands
   - Dynamic help generation

5. **Testing Framework**
   - Unit tests for each command
   - Integration tests for workflows

---

## 📝 Best Practices

### When Adding New Commands
1. Keep commands focused (single responsibility)
2. Use context object for dependencies
3. Handle errors gracefully
4. Provide user feedback
5. Ask for confirmation on destructive operations

### When Adding Utilities
1. Make them reusable
2. Single clear purpose
3. Well-documented
4. Easy to test in isolation

### General Guidelines
1. Follow existing patterns
2. Keep files small (<200 lines)
3. Use meaningful names
4. Comment complex logic
5. Test thoroughly before committing

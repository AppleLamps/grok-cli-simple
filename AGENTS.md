# AGENTS.md - AI Agent Instructions for LampCode

> **Purpose:** This document provides AI coding agents with comprehensive guidance for understanding, navigating, and contributing to the LampCode CLI project.

---

## Project Overview

**LampCode** is a command-line AI coding assistant powered by OpenRouter API. It provides interactive chat, file operations, code search, and AI-assisted editing capabilities.

**Key Characteristics:**

- **Language:** Node.js (CommonJS modules)
- **Architecture:** Modular command pattern with utility separation
- **Primary Function:** AI-powered coding assistance via CLI
- **API:** OpenRouter (supports multiple LLM providers)
- **POWERSHELL** I am always on Windows, use POWERSHELL commands to create folders, files, etc.

**Version:** 1.2.4

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Link globally for testing
npm link

# Start the CLI
lamp

# Show help
lamp --help

# Show version
lamp --version
```

---

## Directory Structure

```text
lampcode/
├── bin/
│   └── lamp.js                 # CLI entry point (Commander.js)
│
├── lib/
│   ├── lampcode.js             # Main orchestrator class (1303 lines)
│   │                           # Responsibilities: initialization, routing, AI chat,
│   │                           # tool execution, token management, context caching
│   │
│   ├── commands/               # Command modules (one file per command)
│   │   ├── index.js            # Exports all commands
│   │   ├── help.js             # Display available commands
│   │   ├── read.js             # Read and analyze files
│   │   ├── edit.js             # AI-assisted file editing
│   │   ├── search.js           # Search codebase
│   │   ├── open.js             # Open files in editor
│   │   └── history.js          # View tool call history
│   │
│   ├── tools/                  # Autonomous tool registry and implementations
│   │   ├── index.js            # Main tool registry and exports
│   │   ├── read-file.js        # Read file content with line ranges
│   │   ├── edit-file.js        # Find/replace file modifications
│   │   ├── create-file.js      # Create new files with content
│   │   ├── search-code.js      # Search across project files
│   │   ├── list-directory.js   # List directory contents and structure
│   │   └── schemas.js          # Tool schemas for native calling
│   │
│   └── utils/                  # Shared utilities
│       ├── apiClient.js        # OpenRouter API communication
│       ├── fileScanner.js      # Project file scanning with caching
│       ├── ui.js               # Terminal UI with colors (chalk)
│       ├── uiHelpers.js        # UI formatting utilities
│       ├── prompt.js           # Readline prompt helpers
│       ├── pathSecurity.js     # Path validation and security
│       ├── tool-helpers.js     # Shared tool utility functions
│       └── tokenEstimator.js   # Token counting and estimation
│
├── scripts/                    # Testing and utility scripts
│   └── test-tools-registry.js  # Tool registry validation
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md         # Detailed architecture guide
│   ├── CHANGELOG.md            # Version history
│   ├── EXAMPLES.md             # Usage examples
│   ├── FEATURES.md             # Feature documentation
│   ├── QUICK-START.md          # Getting started guide
│   ├── USAGE.md                # User manual
│   └── REFACTOR-SUMMARY.md     # Refactoring documentation
│
├── package.json                # NPM configuration & dependencies
├── README.md                   # Main documentation
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment template
└── .gitignore                  # Git ignore rules
```

---

## Core Architecture Patterns

### 1. Command Pattern

Each command is a self-contained module that exports an async function:

```javascript
// lib/commands/myCommand.js
async function myCommand(input, context) {
  // Parse input
  const arg = input.slice(10).trim();
  
  // Use context utilities
  const { workingDirectory, apiClient, rl } = context;
  
  // Implement command logic
  console.log('Doing something...');
  
  // Handle errors gracefully
  try {
    // ... operation
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

module.exports = myCommand;
```

### 2. Context Object

Commands receive a context object with all necessary dependencies:

```javascript
{
  workingDirectory,     // string: Current working directory
  apiClient,            // APIClient: For OpenRouter requests
  fileScanner,          // FileScanner: For file operations
  systemPrompt,         // string: AI system prompt
  rl,                   // readline.Interface: User input
  processMessage,       // function: AI chat handler
  projectFiles,         // Array<{ path, content }>: Cached project context
  setProjectFiles,      // function(files): Updates cached project context
  toolHandlers          // Record<string, function>: Available autonomous tools
}
```

### 3. Utility Classes

Utilities are encapsulated in classes for reusability:

```javascript
// APIClient - handles API communication
apiClient.makeRequest(messages) // Returns Promise<string>

// FileScanner - handles file operations
fileScanner.scanProjectFiles()  // Returns Promise<Array<{path, content}>>
fileScanner.getRelevantFiles()  // Returns Promise<Array<string>>
```

### 4. Tool Registry & Autonomous Actions

Located at `lib/tools/index.js`. Each tool exposes a structured async handler that receives `(args, context)` and returns JSON-serialisable results. Current built-ins include:

- `list_context` – returns current cached project files and previews
- `refresh_context` – rescans the workspace (limit 20 files) and updates cache
- `read_file` – reads files with optional line slicing and truncation safeguards
- `search_code` – performs text search with capped results
- `create_file` – creates or overwrites files (optionally refreshing context)
- `edit_file` – modifies existing files with find/replace operations
- `list_directory` – lists directory contents and structure

`LampCode.processMessage()` parses JSON responses from the model. When the model requests `{ "type": "tool_call", ... }`, the orchestrator executes the corresponding handler, logs the action to the terminal (tool name, args, errors, context refresh counts), appends the result as a `tool` message, and re-queries the model until a final reply is produced or the iteration cap (default 5) is reached.

---

## Adding New Features

### Step 1: Create Command Module

```javascript
// lib/commands/analyze.js
const { askQuestion } = require('../utils/prompt');

async function analyzeCommand(input, context) {
  const fileName = input.slice(8).trim();
  
  if (!fileName) {
    console.log('Usage: analyze <file>');
    return;
  }
  
  console.log(`Analyzing ${fileName}...`);
  
  // Use context utilities
  const { apiClient, systemPrompt, workingDirectory } = context;
  
  // Implementation here
  
  console.log('Analysis complete!');
}

module.exports = analyzeCommand;
```

### Step 2: Export in Index

```javascript
// lib/commands/index.js
const analyzeCommand = require('./analyze');

module.exports = {
  help: require('./help'),
  read: require('./read'),
  edit: require('./edit'),
  search: require('./search'),
  open: require('./open'),
  history: require('./history'),
  analyze: analyzeCommand  // Add new command
};
```

### Step 3: Add Route in Orchestrator

```javascript
// lib/lampcode.js - in startChat() method, add:
if (trimmedInput.startsWith('analyze ')) {
  await commands.analyze(input.trim(), this.getContext());
  this.rl.prompt();
  return;
}

// Example: History command is routed as:
if (trimmedInput === 'history') {
  await commands.history(input.trim(), this.getContext());
  this.rl.prompt();
  return;
}
```

### Step 4: Update Help

```javascript
// lib/commands/help.js - Update UI commandList method
console.log('  analyze <file>    Perform code analysis');
```

**That's it!** No changes to existing code required.

---

## Tool Registry Deep Dive

### Available Tools

LampCode provides 7 built-in tools that the AI can invoke autonomously:

1. **`list_context`** - View currently cached project files
   - Returns file paths, sizes, and content previews
   - No arguments required

2. **`refresh_context`** - Rescan workspace and update cache
   - Args: `limit` (max files, default 20), `include_metadata`, `include_hidden`
   - Updates project context with fresh file data

3. **`read_file`** - Read file content with optional line ranges
   - Args: `file_path` (required), `start_line`, `end_line`, `max_lines`
   - Supports line slicing and truncation safeguards

4. **`search_code`** - Search for text patterns across files
   - Args: `query` (required), `file_pattern`, `max_results`
   - Returns matching lines with file paths and line numbers

5. **`create_file`** - Create new files with content
   - Args: `file_path` (required), `content` (required), `overwrite`, `refresh_context`
   - Security: Validates paths stay within workspace

6. **`edit_file`** - Modify files with find/replace operations
   - Args: `file_path` (required), `edits` (array of {find, replace, limit})
   - Supports multiple edits in a single call

7. **`list_directory`** - Explore directory structure
   - Args: `directory_path`, `recursive`, `max_depth`, `include_hidden`
   - Returns file and directory listings

### Tool Security

All file operations enforce security through `pathSecurity.js`:

- **Workspace Boundaries**: Tools cannot access files outside the working directory
- **Path Traversal Protection**: Blocks `../` and absolute paths attempting to escape
- **Symlink Protection**: Prevents following symlinks that lead outside workspace
- **Validation**: Uses `path.relative()` to prevent prefix attacks

---

## Coding Conventions

### File Naming

- **Commands:** lowercase, single word (e.g., `search.js`, `edit.js`)
- **Utilities:** camelCase (e.g., `apiClient.js`, `fileScanner.js`)
- **Classes:** PascalCase class names (e.g., `class APIClient`)

### Code Style

- **Module System:** CommonJS (`require`/`module.exports`)
- **Async/Await:** Prefer over promises and callbacks
- **Error Handling:** Try-catch blocks with user-friendly messages
- **Logging:** Use `console.log()` for output, `console.error()` for errors
- **Line Length:** Keep under 100 characters when possible
- **Indentation:** 2 spaces

### Function Signatures

**Commands:**

```javascript
async function commandName(input, context) { }
```

**Utilities:**

```javascript
function utilityFunction(param1, param2) { }
```

**Classes:**

```javascript
class ClassName {
  constructor(param1, param2) { }
  async methodName(param) { }
}
```

---

## Dependencies

### Production

```json
{
  "axios": "^1.6.0",        // HTTP client for API requests
  "chalk": "^4.1.2",        // Terminal colors and styling
  "commander": "^11.1.0",   // CLI framework
  "dotenv": "^16.3.1",      // Environment variable management
  "open": "^9.1.0"          // Cross-platform file opening
}
```

### Development

```json
{
  "@types/node": "^20.10.0" // Node.js type definitions
}
```

**Note:** Uses `chalk` v4.1.2 for terminal styling (last version supporting CommonJS). The UI utility class (`lib/utils/ui.js`) provides styled output methods.

---

## Environment Variables

Required in `.env` file:

```bash
OPENROUTER_API_KEY=sk-or-v1-...    # Required: OpenRouter API key
OPENROUTER_MODEL=x-ai/grok-code-fast-1  # Optional: Default model
```

**Available Models:**

- `x-ai/grok-code-fast-1` - **Recommended default** - Optimized for agentic tasks, 4x faster, 1/10th cost
- `anthropic/claude-3.5-sonnet` - High quality reasoning
- `openai/gpt-4` - Most capable
- `openai/gpt-3.5-turbo` - Cost effective

**Grok Code Fast 1 Optimization Tips:**

- Uses XML-structured system prompts for clarity
- Native JSON tool calling (not XML-based)
- Optimized for rapid iteration and agentic workflows
- See `grok-code-fast-1-tips.md` for detailed prompting strategies

---

## Testing & Verification

### Manual Testing Commands

```bash
# Test version
lamp --version

# Test help
echo "help" | lamp

# Test search
echo "search axios" | lamp

# Test command availability
lamp --help
```

### Pre-Commit Checklist

- [ ] All commands work (test with piped input)
- [ ] No syntax errors (run `node lib/lampcode.js` directly if needed)
- [ ] Help text updated for new commands
- [ ] Documentation updated in `docs/`
- [ ] `.gitignore` includes sensitive files

### Common Testing Pattern

```javascript
// Quick test script
const { LampCode } = require('./lib/lampcode');

async function test() {
  const lamp = new LampCode();
  // Test your feature
  process.exit(0);
}

test().catch(console.error);
```

---

## Build & Deployment

### Local Development

```bash
npm install          # Install dependencies
npm link            # Link globally for testing
lamp                # Test the CLI
```

### Publishing to NPM

```bash
# Update version in package.json and bin/lamp.js
npm version patch   # or minor/major

# Publish
npm publish
```

### Global Installation (Users)

```bash
npm install -g lampcode
```

---

## Important Context

### API Communication

- **Provider:** OpenRouter (aggregates multiple LLM providers)
- **Authentication:** API key via Bearer token
- **Rate Limits:** Dependent on OpenRouter plan
- **Error Handling:** 401 (invalid key), 429 (rate limit)

### File Operations

- **Scan Limit:** 20 files maximum to avoid token overflow
- **Excluded:** `node_modules`, `.git`, `package-lock.json`, `.min.js`
- **Supported Extensions:** `.js`, `.ts`, `.jsx`, `.tsx`, `.py`, `.java`, `.cpp`, `.c`, `.go`, `.rs`, `.php`, `.rb`, `.swift`, `.kt`, `.scala`, `.html`, `.css`, `.json`, `.md`, `.txt`
- **Autonomous tools:** `create_file` keeps writes inside the workspace, supports `overwrite` toggles, and can trigger a fresh project scan when called with `refresh_context: true`
- **Logging:** Every tool invocation is printed in the CLI so users can audit automatic actions, including refresh summaries and iteration limits
- **Security:** All paths validated through `pathSecurity.js` to prevent directory traversal and symlink attacks

### Token Management

LampCode includes sophisticated token tracking and optimization:

- **Model-Specific Limits:** Configures max tokens per model (Grok: 8K, Claude: 180K, GPT-4: 120K)
- **Automatic History Trimming:** Keeps conversation history under 8,000 tokens
- **Context Optimization:** Caches file content and generates smart snippets
- **Token Estimation:** Uses `tokenEstimator.js` for accurate token counting
- **Safety Margins:** Reserves buffer tokens to prevent API rejections

**Model Configurations** (in `lampcode.js`):
```javascript
const MODEL_CONFIGS = {
  'x-ai/grok-code-fast-1': { maxInputTokens: 8000, safetyMargin: 1000 },
  'anthropic/claude-3.5-sonnet': { maxInputTokens: 180000, safetyMargin: 5000 },
  'openai/gpt-4': { maxInputTokens: 120000, safetyMargin: 4000 },
  'openai/gpt-3.5-turbo': { maxInputTokens: 15000, safetyMargin: 2000 }
};
```

### Advanced Features

**Directory Indexing & Caching:**
- Pre-loads directory structures for fast file lookups
- Maintains `projectFileIndex` and `projectBaseNameIndex` maps
- Caches directory entries to avoid repeated filesystem scans

**Tool History Tracking:**
- Records every tool call with timestamp, duration, status
- Accessible via `history` command
- Includes detailed summaries and error messages

**Change Logging:**
- Tracks all file modifications during session
- Useful for debugging and understanding AI actions

**Context Snippets:**
- Generates smart code snippets from project files
- Caches snippets to reduce redundant processing
- Limits snippet size to stay within token budgets

### Readline Interface

- **Library:** Native Node.js `readline`
- **Prompt:** `lamp>`
- **Exit:** `exit`, `quit`, or `Ctrl+D`
- **Important:** Must handle `readline.close()` errors in tests

### Conversation History

- **Limit:** Stores up to 40 recent exchanges, but only the last 10 are replayed per API call to manage token usage
- **Storage:** In-memory only (cleared on exit)
- **Format:** Array of `{role, content}` objects

---

## Common Pitfalls & Solutions

### ❌ Pitfall 1: Large Monolithic Files

**Problem:** Adding all code to `lampcode.js`
**Solution:** Create separate command module in `lib/commands/`

### ❌ Pitfall 2: Blocking Operations

**Problem:** Synchronous file operations
**Solution:** Always use `fs.promises` and `async/await`

### ❌ Pitfall 3: Poor Error Messages

**Problem:** Technical error messages
**Solution:** Wrap in try-catch with user-friendly messages

### ❌ Pitfall 4: Missing Confirmation

**Problem:** Destructive operations without confirmation
**Solution:** Use `askQuestion()` for confirmation prompts

### ❌ Pitfall 5: Hardcoded Paths

**Problem:** Using absolute paths
**Solution:** Use `path.join(context.workingDirectory, fileName)`

---

## API Request Pattern

```javascript
// Standard API request pattern
async function makeAIRequest(context, userMessage) {
  const messages = [
    { role: 'system', content: context.systemPrompt },
    { role: 'user', content: userMessage }
  ];
  
  try {
    const response = await context.apiClient.makeRequest(messages);
    return response;
  } catch (error) {
    throw new Error(`AI request failed: ${error.message}`);
  }
}
```

---

## File Operation Pattern

```javascript
// Standard file operation pattern
const fs = require('fs').promises;
const path = require('path');

async function readProjectFile(fileName, context) {
  const filePath = path.join(context.workingDirectory, fileName);
  
  try {
    // Check if exists
    await fs.access(filePath);
    
    // Read content
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${fileName}`);
    }
    throw error;
  }
}
```

---

## User Interaction Pattern

```javascript
// Standard user prompt pattern
const { askQuestion } = require('../utils/prompt');

async function getConfirmation(context) {
  const answer = await askQuestion(
    context.rl, 
    'Are you sure? (y/n): '
  );
  
  return answer.toLowerCase().startsWith('y');
}
```

---

## Example: Complete New Command

Here's a complete example of adding a "lint" command:

```javascript
// lib/commands/lint.js
const { execSync } = require('child_process');
const { askQuestion } = require('../utils/prompt');

async function lintCommand(input, context) {
  const fileName = input.slice(5).trim();
  
  if (!fileName) {
    console.log('Usage: lint <file>');
    return;
  }
  
  console.log(`\n🔍 Linting ${fileName}...`);
  
  try {
    // Run linter
    const output = execSync(`eslint ${fileName}`, {
      cwd: context.workingDirectory,
      encoding: 'utf8'
    });
    
    if (output) {
      console.log(output);
      
      // Ask if they want AI help
      const wantHelp = await askQuestion(
        context.rl,
        'Would you like AI help fixing these issues? (y/n): '
      );
      
      if (wantHelp.toLowerCase().startsWith('y')) {
        await context.processMessage(
          `Help me fix these linting issues:\n\n${output}`,
          []
        );
      }
    } else {
      console.log('✅ No linting issues found!');
    }
    
  } catch (error) {
    console.log(`Error running linter: ${error.message}`);
  }
}

module.exports = lintCommand;
```

Then follow steps 2-4 above to integrate it.

---

## Best Practices for AI Agents

### When Reading Code

1. Start with `AGENTS.md` (this file) and `docs/ARCHITECTURE.md`
2. Understand the command pattern before modifying
3. Check existing commands for patterns to follow
4. Review context object structure

### When Writing Code

1. Follow existing patterns (don't reinvent)
2. Create new command files, don't modify existing ones
3. Always provide user feedback (console.log)
4. Handle errors gracefully
5. Ask for confirmation on destructive operations

### When Debugging

1. Test commands with piped input: `echo "command" | lamp`
2. Check readline is properly closed in tests
3. Verify file paths are relative to working directory
4. Check API key is loaded from .env

### When Documenting

1. Update help command for new features
2. Add examples to `docs/EXAMPLES.md`
3. Update `docs/CHANGELOG.md` with changes
4. Keep `AGENTS.md` updated with new patterns

---

## Decision Context

### Why Modular Architecture?

- Easy to add features without touching existing code
- Each command is independently testable
- Multiple developers can work simultaneously
- Clear separation of concerns

### Why CommonJS vs ESM?

- Better compatibility with existing Node.js tools
- Synchronous require() for configuration
- Easier for users without build step

### Why No Testing Framework?

- Keep dependencies minimal
- Manual testing with piped input is simple
- Project size doesn't warrant test framework yet

### Why OpenRouter vs Direct API?

- Access to multiple LLM providers
- Cost optimization by switching models
- Unified interface for different providers

---

## References

- **Architecture Details:** `docs/ARCHITECTURE.md`
- **Usage Examples:** `docs/EXAMPLES.md`
- **Feature Guide:** `docs/FEATURES.md`
- **User Manual:** `docs/USAGE.md`
- **OpenRouter API:** <https://openrouter.ai/docs>

---

## Agent Success Checklist

When contributing to this codebase, ensure:

- [ ] New commands follow the established pattern
- [ ] Code is added to appropriate directory (commands/utils)
- [ ] Existing code is not unnecessarily modified
- [ ] User feedback is provided for all operations
- [ ] Errors are handled with friendly messages
- [ ] Confirmations are requested for destructive operations
- [ ] Help text is updated
- [ ] Documentation is updated
- [ ] Manual testing is performed (include scenarios where the AI executes tools autonomously)
- [ ] Code follows existing style conventions

---

**Last Updated:** 2025-10-24 | **Version:** 1.2.4

For questions or clarifications, refer to `docs/ARCHITECTURE.md` or examine existing command implementations in `lib/commands/`.

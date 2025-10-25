# 🚀 LampCode

A powerful CLI coding assistant powered by OpenRouter API. Get AI help with your coding tasks directly from the terminal.

## ✨ Features

- **Interactive Chat**: Natural language coding assistance
- **Beautiful UI**: Colorful terminal interface with styled boxes and clear formatting
- **Project Analysis**: Understands your current project structure
- **File Operations**: Read, analyze, and modify your code files
- **Autonomous Tooling**: AI automatically invokes tools to read, search, edit, or create files
- **Multiple AI Models**: Support for Grok, Claude, GPT, and other OpenRouter models
- **Optimized for Grok**: XML-structured prompts and native JSON tool calling
- **Context Aware**: Provides relevant suggestions based on your project
- **Real-time Tool Logging**: Watch the AI work with colored tool call indicators

## 🛠️ Installation

### 1. Clone and Setup

```bash
# Navigate to your project directory
cd your-project

# Install dependencies
npm install
```

### 2. Configure API Key

1. Copy the environment template:

   ```bash
   # On macOS/Linux:
   cp .env.example .env
   
   # On Windows (PowerShell):
   Copy-Item .env.example .env
   ```

2. Get your OpenRouter API key from [openrouter.ai](https://openrouter.ai)

3. Add your API key to `.env`:

   ```env
   OPENROUTER_API_KEY=your_api_key_here
   OPENROUTER_MODEL=x-ai/grok-code-fast-1
   ```

**Windows Note:** Use PowerShell or Git Bash for best compatibility. Windows CMD may have limited functionality.

### 3. Make it globally available

#### Option A: Global npm install (Recommended)

```bash
npm install -g .
```

#### Option B: Add to PATH manually

```bash
# On Windows
npm run build
# Add the bin directory to your PATH

# On macOS/Linux
chmod +x bin/lamp.js
sudo ln -s $(pwd)/bin/lamp.js /usr/local/bin/lamp
```

## 🚀 Usage

### Start Interactive Session

Simply type `lamp` in your terminal:

```bash
lamp
```

### Available Commands

- `help` - Show available commands with styled formatting
- `clear` - Clear the terminal screen
- `read <filename>` - Read and analyze a specific file
- `edit <filename>` - Edit a file with AI suggestions
- `search <query>` - Search codebase for specific text
- `open <filename>` - Open a file in your default editor
- `history` - View tool call history with timestamps and durations
- `exit` or `quit` - Exit LampCode

**Natural Language:** Just chat! The AI will automatically use tools when needed:

- "Create a React component" → AI uses `create_file`
- "Search for axios usage" → AI uses `search_code`
- "Update package.json version" → AI uses `edit_file`

### Example Interactions

```bash
lamp> How can I improve the performance of this React component?

lamp> Write a function to validate email addresses in TypeScript

lamp> read package.json

lamp> edit app.js
# AI will help you modify the file with your instructions

lamp> search axios
# Find all occurrences of "axios" in your codebase

lamp> What does this error mean: TypeError: Cannot read property 'map' of undefined?

lamp> Create a todo list component with React hooks
```

## 🔧 Configuration

### Environment Variables

Configure LampCode by creating a `.env` file in your project root:

```env
# Required: Your OpenRouter API key
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: AI model selection (default: x-ai/grok-code-fast-1)
OPENROUTER_MODEL=x-ai/grok-code-fast-1

# Optional: Custom API endpoint (default: https://openrouter.ai/api/v1)
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Optional: Request timeout in milliseconds (default: 30000)
API_TIMEOUT=30000

# Optional: Maximum retry attempts for failed requests (default: 3)
MAX_RETRIES=3
```

### Supported Models

You can change the AI model in your `.env` file:

```env
# Grok (recommended - optimized for agentic tasks)
OPENROUTER_MODEL=x-ai/grok-code-fast-1

# Claude models
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_MODEL=anthropic/claude-3-opus
OPENROUTER_MODEL=anthropic/claude-3-haiku

# OpenAI models
OPENROUTER_MODEL=openai/gpt-4
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

**Why Grok Code Fast 1?**

- 4x faster than other models
- 1/10th the cost
- Optimized for tool calling and code tasks
- Native JSON support

### Project Context

LampCode automatically analyzes your project files to provide context-aware assistance:

- Reads common file types (`.js`, `.ts`, `.py`, `.java`, etc.)
- Understands your project structure
- Provides relevant suggestions based on your codebase
- Keeps the context fresh when the AI requests a rescan or creates new files (with logging so you can review every tool call)

### Autonomous Tools

The AI can automatically invoke these tools to complete tasks:

#### 1. `list_context`
**View cached project files**
- Shows currently loaded files with sizes and previews
- No parameters needed
- Example: "What files are currently loaded?"

#### 2. `refresh_context`
**Rescan workspace**
- Parameters: `limit` (max files, default 20), `include_metadata`, `include_hidden`
- Updates project context with fresh file data
- Example: "Refresh the project context to see my new files"

#### 3. `read_file`
**Read file content**
- Parameters: `file_path` (required), `start_line`, `end_line`, `max_lines`
- Supports reading specific line ranges for large files
- Example: "Read the authentication middleware"

#### 4. `search_code`
**Search across files**
- Parameters: `query` (required), `file_pattern`, `max_results`
- Returns matching lines with file paths and line numbers
- Example: "Find all uses of the getUserData function"

#### 5. `create_file`
**Create new files**
- Parameters: `file_path` (required), `content` (required), `overwrite`, `refresh_context`
- Creates files within workspace boundaries
- Example: "Create a new React component for the user profile"

#### 6. `edit_file`
**Modify existing files**
- Parameters: `file_path` (required), `edits` (array of find/replace operations)
- Supports multiple edits in a single operation
- Example: "Update the API endpoint URL in the config file"

#### 7. `list_directory`
**Explore directory structure**
- Parameters: `directory_path`, `recursive`, `max_depth`, `include_hidden`
- Lists files and subdirectories
- Example: "Show me what's in the components folder"

**Security:** All file operations validate paths to prevent access outside the workspace. Symlinks and directory traversal attempts are blocked.

## 📝 Requirements

- Node.js 16.0.0 or higher
- OpenRouter API key
- Internet connection for AI requests

## 🐛 Troubleshooting

### Common Issues

1. **"command not found"**
   - Make sure LampCode is installed globally or added to PATH
   - Try running `npm link` in the project directory

2. **"API key not found"**
   - Ensure `OPENROUTER_API_KEY` is set in your `.env` file
   - Check that the `.env` file is in your project root

3. **"Rate limit exceeded"**
   - OpenRouter has rate limits - wait a moment and try again
   - Consider upgrading your OpenRouter plan for higher limits

4. **Permission denied**
   - On macOS/Linux, make sure the script is executable: `chmod +x bin/lamp.js`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with OpenRouter API
- Optimized for x.ai's Grok Code Fast 1
- Inspired by modern CLI coding assistants
- Thanks to the open source community for amazing tools like Commander.js and Chalk

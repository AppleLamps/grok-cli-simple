# 🚀 LampCode

A powerful CLI coding assistant powered by OpenRouter API. Get AI help with your coding tasks directly from the terminal.

## ✨ Features

- **Interactive Chat**: Natural language coding assistance
- **Project Analysis**: Understands your current project structure
- **File Operations**: Read, analyze, and help modify your code files
- **Autonomous Tooling**: AI can invoke built-in tools to read, search, apply precise edits, or create files on your behalf
- **Guided CLI Experience**: Structured dividers and detailed tool summaries keep every interaction easy to follow
- **Multiple AI Models**: Support for Claude, GPT, and other OpenRouter models
- **Context Aware**: Provides relevant suggestions based on your project

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
   cp .env.example .env
   ```

2. Get your OpenRouter API key from [openrouter.ai](https://openrouter.ai)

3. Add your API key to `.env`:

   ```env
   OPENROUTER_API_KEY=your_api_key_here
   OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
   ```

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

- `help` - Show available commands
- `clear` - Clear the terminal screen
- `read <filename>` - Read and analyze a specific file
- `edit <filename>` - Edit a file with AI suggestions
- `search <query>` - Search codebase for specific text
- `open <filename>` - Open a file in your default editor
- `exit` or `quit` - Exit LampCode
- AI chats can also autonomously trigger internal tools (like reading files, searching code, or creating new files) when additional context is needed.

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

### Supported Models

You can change the AI model in your `.env` file:

```env
# Claude models (recommended)
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_MODEL=anthropic/claude-3-opus
OPENROUTER_MODEL=anthropic/claude-3-haiku

# OpenAI models
OPENROUTER_MODEL=openai/gpt-4
OPENROUTER_MODEL=openai/gpt-3.5-turbo

# Other models available on OpenRouter
```

### Project Context

LampCode automatically analyzes your project files to provide context-aware assistance:

- Reads common file types (`.js`, `.ts`, `.py`, `.java`, etc.)
- Understands your project structure
- Provides relevant suggestions based on your codebase
- Keeps the context fresh when the AI requests a rescan or creates new files (with logging so you can review every tool call)

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
- Inspired by modern CLI coding assistants
- Thanks to the open source community for amazing tools like Commander.js and Inquirer.js

# LampCode Changelog

## Version 1.1.0 - Edit & Search Features

### New Features

- ✅ **Edit Command** - AI-assisted file editing with confirmation
- ✅ **Search Command** - Search codebase for text with results grouping
- ✅ Create new files with AI assistance
- ✅ AI analysis of search results

### Improvements

- Better error handling for readline in tests
- Updated documentation with new commands
- Enhanced help system

## Version 1.0.0 - Initial Release

### Features

- ✅ Interactive CLI interface with readline
- ✅ OpenRouter API integration (supports multiple AI models)
- ✅ Project context awareness (auto-scans project files)
- ✅ File reading and analysis commands
- ✅ Built-in help system
- ✅ Cross-platform support (Windows, macOS, Linux)
- ✅ Environment variable configuration

### Commands

- `lamp` - Start interactive session
- `lamp --help` - Show help
- `lamp --version` - Show version
- `help` - In-session help
- `read <file>` - Read and analyze files
- `open <file>` - Open file in editor
- `clear` - Clear screen
- `exit/quit` - Exit session

### Dependencies

- axios - HTTP client for API requests
- commander - CLI framework
- dotenv - Environment variable management
- open - Cross-platform file opening

### Bug Fixes (v1.0.0 final)

- Fixed `ora` spinner compatibility issues with ESM/CommonJS
- Removed unnecessary dependencies (chalk, inquirer, ora)
- Simplified to use native Node.js readline module
- Added proper .env loading in constructor
- Improved error handling for API requests

### Configuration

Default model: `anthropic/claude-3.5-sonnet`
Supports any OpenRouter-compatible model via `.env`

### Known Issues

None

### Future Enhancements

- File editing capabilities
- Multi-file context management
- Code generation templates
- Plugin system
- Better error messages
- Syntax highlighting for code blocks

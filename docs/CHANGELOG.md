# LampCode Changelog

## Version 1.3.0 - Prompt Caching & Expanded Context

### Highlights

- 💰 **Prompt Caching Support** – Automatic caching for Grok, OpenAI, and DeepSeek models; manual `cache_control` for Anthropic Claude and Google Gemini
- 🚀 **256K Context for Grok** – Increased Grok Code Fast 1 token limit from 8K to 256K (full context window)
- 📉 **Cost Reduction** – Up to 50-80% savings on input tokens for repeated conversations
- ⚡ **Faster Responses** – Cached prompts process faster, reducing latency
- 🎯 **Smart Cache Management** – System prompts and project context automatically optimized for caching

### Technical Details

- Added model-specific caching configurations to `MODEL_CONFIGS`
- Implemented `requiresManualCaching()` and `supportsPromptCaching()` helper methods
- Updated `buildBaseMessages()` to format messages with `cache_control` breakpoints for Anthropic/Gemini
- System prompts and project context are now cached separately for optimal reuse
- OpenRouter automatically routes to the same provider to maximize cache hits

### Model Support

**Automatic Caching (No Configuration):**

- Grok (x-ai/grok-code-fast-1) - Default model
- OpenAI (GPT-4, GPT-3.5) - Prompts > 1024 tokens
- DeepSeek

**Manual Caching (Automatic `cache_control` Insertion):**

- Anthropic Claude (3.5 Sonnet, Opus, Haiku)
- Google Gemini (2.5 Pro, 2.5 Flash)

### Documentation Updates

- Added prompt caching section to README.md
- Updated AGENTS.md with caching details and new model configurations
- Documented cost savings and best practices

## Version 1.2.0 - Context Refresh & UI Tweaks

### Highlights

- 🔄 **Smarter Context Management** – Added incremental refresh helpers, change logging, and normalized project paths so tool edits reflect immediately without full rescans.
- 🛠️ **Tool Enhancements** – `edit_file` and `create_file` now refresh single-file context snapshots and report updated metadata.
- 🧹 **Cleaner CLI Output** – Default verbosity switched to "minimal" for compact tool call summaries, keeping the terminal readable.
- 🗂️ **Directory Tracking** – Cached directory indexes invalidate automatically when new files appear, reducing stale listings.

### Other Improvements

- Added recent change history accessor for potential future diagnostics.
- Normalized paths returned by the file scanner to ensure consistent casing and separators across platforms.

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

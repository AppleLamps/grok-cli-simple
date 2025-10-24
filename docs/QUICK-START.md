# LampCode Quick Start

Get up and running in 2 minutes!

## Setup (One Time)

1. **Set your API key:**

   ```bash
   # Edit .env file
   OPENROUTER_API_KEY=your_key_here
   OPENROUTER_MODEL=x-ai/grok-code-fast-1
   ```

2. **Install globally (optional):**

   ```bash
   npm link
   ```

## Basic Usage

Start LampCode:

```bash
lamp
```

Type `help` to see all commands.

## Essential Commands

| Command | Description | Example |
|---------|-------------|---------|
| `help` | Show help | `help` |
| `read <file>` | Read file | `read app.js` |
| `edit <file>` | Edit file with AI | `edit app.js` |
| `search <text>` | Search codebase | `search useState` |
| `open <file>` | Open in editor | `open package.json` |
| `clear` | Clear screen | `clear` |
| `exit` | Quit | `exit` |

## Common Tasks

### 🔍 Find Something

```
lamp> search authentication
```

### ✏️ Edit a File

```
lamp> edit myfile.js
Instructions: Add error handling
```

### 🤔 Ask Questions

```
lamp> How does authentication work in this project?
lamp> What does package.json do?
lamp> Write a function to validate emails
```

### 📖 Read & Analyze

```
lamp> read config.js
Would you like me to analyze this file? y
```

### 🆕 Create New File

```
lamp> edit newfile.js
File not found. Create it? y
Instructions: Create a logger utility
```

## Quick Tips

- **Be Specific**: "Add try-catch to fetchUser" is better than "improve this"
- **Review First**: Always check AI suggestions before applying
- **Chain Commands**: Search → Read → Edit → Test
- **Ask Questions**: Not sure? Just ask the AI!

## Keyboard Shortcuts

- `Ctrl+C` - Cancel current operation
- `Ctrl+D` - Exit (alternative to typing `exit`)
- `↑/↓` - Command history (in some terminals)

## Troubleshooting

**Command not found:**

```bash
npm link
```

**API errors:**

- Check your API key in `.env`
- Verify you have credits on OpenRouter

**Slow responses:**

- Switch to faster model in `.env`
- Example: `x-ai/grok-code-fast-1`

## Next Steps

1. Try the examples: `cat EXAMPLES.md`
2. Read full docs: `cat README.md`
3. Learn features: `cat FEATURES.md`

## Get Help

Inside lamp session:

```
lamp> help
```

Common questions:

```
lamp> How do I...?
lamp> What does... mean?
lamp> Can you explain...?
```

---

**That's it! You're ready to code with AI assistance.** 🚀

Start with: `lamp` then try `search axios` or `read package.json`

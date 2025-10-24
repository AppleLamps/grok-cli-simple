# LampCode Usage Guide

## Quick Start

1. **Start LampCode:**

   ```bash
   lamp
   ```

2. **Ask questions about your code:**

   ```
   lamp> How can I improve the performance of this project?
   lamp> What does the package.json file do?
   lamp> Write a function to validate email addresses
   ```

## Commands

- `help` - Show available commands
- `clear` - Clear the terminal screen
- `read <filename>` - Read and analyze a specific file
- `edit <filename>` - Edit a file with AI suggestions
- `search <query>` - Search codebase for specific text
- `open <filename>` - Open a file in your default editor
- `exit` or `quit` - Exit LampCode

## Examples

### Reading a File

```
lamp> read package.json
```

This will display the file contents and ask if you want AI analysis.

### Asking for Code Help

```
lamp> How do I connect to a PostgreSQL database in Node.js?
```

### Debugging

```
lamp> I'm getting a TypeError: Cannot read property 'map' of undefined. How do I fix this?
```

### Code Generation

```
lamp> Write a React component that displays a todo list with add and delete functionality
```

### Editing Files

```
lamp> edit utils.js
Instructions: Add a function to format phone numbers
```

The AI will suggest changes and ask for confirmation before applying them.

### Searching Code

```
lamp> search useState
```

This will find all files containing "useState" and show you the matches.

## Tips

1. **Be Specific** - The more context you provide, the better the responses
2. **Use Project Context** - LampCode automatically scans your project files for context
3. **Ask Follow-ups** - LampCode maintains conversation history within a session
4. **Read Files First** - Use `read <filename>` to give LampCode specific file context

## Configuration

Edit your `.env` file to customize:

```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=x-ai/grok-code-fast-1
```

Available models:

- `x-ai/grok-code-fast-1` - Fast responses, good for quick questions
- `anthropic/claude-3.5-sonnet` - High quality, detailed responses
- `openai/gpt-4` - OpenAI's most capable model
- `openai/gpt-3.5-turbo` - Fast and cost-effective

## Troubleshooting

**Issue:** `TypeError: ora is not a function`

- **Solution:** Run `npm install` to update dependencies

**Issue:** API key not found

- **Solution:** Make sure your `.env` file has `OPENROUTER_API_KEY` set

**Issue:** Command not found

- **Solution:** Run `npm link` from the project directory

**Issue:** Slow responses

- **Solution:** Try switching to a faster model like `x-ai/grok-code-fast-1`

## Getting Help

Run `lamp --help` to see CLI options, or type `help` inside the interactive session.

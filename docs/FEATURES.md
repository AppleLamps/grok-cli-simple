# LampCode Features Guide

## 🔍 Search Command

The search command helps you find text across your entire codebase quickly.

### Basic Usage

```bash
lamp> search axios
```

### What It Does

- Searches all relevant files in your project
- Shows file name and line numbers
- Displays matched lines with context
- Groups results by file
- Optionally analyzes results with AI

### Example Output

```
🔍 Searching for "axios" in project files...

Found 7 result(s):

📄 lib/lampcode.js (2 matches):
   Line 1: const axios = require('axios');
   Line 55: const response = await axios.post(`${this.baseURL}/chat/completions`, {

📄 package.json (1 match):
   Line 24: "axios": "^1.6.0",

Would you like me to analyze these results? (y/n):
```

### Use Cases

- Find where a function is used
- Locate specific error messages
- Search for imports/dependencies
- Find TODO comments
- Discover similar code patterns

---

## ✏️ Edit Command

The edit command uses AI to help you modify or create files with natural language instructions.

### Basic Usage

```bash
lamp> edit myfile.js
Instructions: Add error handling to the fetchData function
```

### What It Does

1. Shows current file content (if it exists)
2. Asks for your instructions
3. AI generates suggested changes
4. Shows you a preview of the changes
5. Asks for confirmation before applying
6. Optionally opens the file after editing

### Example Flow

**Editing an existing file:**

```
lamp> edit utils.js

📄 Current content of utils.js:
──────────────────────────────────────────────────
export function formatDate(date) {
  return date.toString();
}
──────────────────────────────────────────────────

💡 What changes would you like to make?
Instructions: Make it format as MM/DD/YYYY

Thinking about the changes...

📝 Suggested changes:
──────────────────────────────────────────────────
export function formatDate(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}
──────────────────────────────────────────────────

Apply these changes? (y/n): y

✅ File "utils.js" has been updated!
Would you like to open it? (y/n):
```

**Creating a new file:**

```
lamp> edit config.json

File "config.json" not found.
Would you like to create it? (y/n): y

💡 What changes would you like to make?
Instructions: Create a config with API endpoint and timeout

Thinking about the changes...

📝 Suggested changes:
──────────────────────────────────────────────────
{
  "apiEndpoint": "https://api.example.com",
  "timeout": 5000,
  "retries": 3
}
──────────────────────────────────────────────────

Apply these changes? (y/n): y

✅ File "config.json" has been created!
```

### Use Cases

- Add new functions to existing files
- Refactor code with specific patterns
- Add error handling
- Add comments/documentation
- Fix bugs with guidance
- Convert between formats
- Add new features
- Create boilerplate files

### Tips for Best Results

1. **Be Specific**
   - ❌ "improve this"
   - ✅ "add try-catch error handling to all async functions"

2. **Provide Context**
   - ❌ "add a button"
   - ✅ "add a submit button that calls handleSubmit when clicked"

3. **One Change at a Time**
   - Better to make multiple small edits than one large unclear edit

4. **Review Before Applying**
   - Always check the suggested changes carefully
   - You can say 'n' and try again with different instructions

---

## 🤖 AI Chat

Beyond commands, you can chat directly with the AI about your code.

### Example Questions

**General Help:**

```
lamp> How do I connect to MongoDB in Node.js?
lamp> What's the difference between let and const?
lamp> Explain promises vs async/await
```

**Project-Specific:**

```
lamp> What does this project do?
lamp> How can I improve the code structure?
lamp> Are there any security issues I should fix?
```

**Debugging:**

```
lamp> I'm getting "Cannot read property 'map' of undefined"
lamp> Why is my React component re-rendering too much?
lamp> My API calls are failing, what could be wrong?
```

**Code Generation:**

```
lamp> Write a function to validate email addresses
lamp> Create a React hook for fetching data
lamp> Generate unit tests for the User class
```

---

## 📖 Read Command

Read and optionally analyze files with AI.

```bash
lamp> read package.json
```

Shows file content and offers AI analysis.

---

## 🚀 Open Command

Open any file in your default editor.

```bash
lamp> open app.js
```

---

## 💡 Pro Tips

1. **Chain Commands**: Use read before edit to understand the file better
2. **Search First**: Use search to find what you need before editing
3. **Ask Questions**: If unsure, ask the AI about the code before changing it
4. **Project Context**: LampCode automatically includes project files in context
5. **Experiment**: Try different instructions if the first result isn't perfect

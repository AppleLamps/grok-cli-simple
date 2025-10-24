const readline = require('readline');
const APIClient = require('./utils/apiClient');
const FileScanner = require('./utils/fileScanner');
const commands = require('./commands');
const tools = require('./tools');

class LampCode {
  constructor() {
    // Load environment variables
    require('dotenv').config();

    // Configuration
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';
    this.workingDirectory = process.cwd();
    
    // Initialize utilities
    this.apiClient = new APIClient(this.apiKey, this.model);
    this.fileScanner = new FileScanner(this.workingDirectory);
    this.projectFiles = [];
    this.toolHandlers = tools;
    this.maxToolIterations = 5;
    
    // System prompt for AI
    this.systemPrompt = this.getSystemPrompt();
    
    // Conversation history
    this.conversationHistory = [];
    
    // Readline interface
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  getSystemPrompt() {
    const toolEntries = Object.keys(this.toolHandlers || {}).map((name) => `- ${name}`);
    const toolList = toolEntries.length > 0 ? toolEntries.join('\n') : '- (no tools available)';

    return `You are LampCode, an expert coding assistant. You help users with programming tasks including:

1. Writing, debugging, and explaining code
2. Analyzing project structure and files
3. Suggesting improvements and best practices
4. Running terminal commands when appropriate
5. Creating new files and modifying existing ones

Guidelines:
- Be concise but helpful in your responses
- Always explain your reasoning when suggesting code changes
- If asked to modify files, show the exact changes needed
- When analyzing code, point out potential issues and improvements
- If you need to run commands, ask for permission first
- Be proactive in offering help with related tasks

Current working directory: ${this.workingDirectory}

Tool use:
- Respond with JSON whenever you need to call a tool.
- Use the shape { "type": "tool_call", "tool": "<name>", "args": { ... } }.
- After receiving tool results, continue the task with another JSON response.
- When no tool is required, reply with { "type": "reply", "message": "..." }.

Available tools:
${toolList}

Always respond in a helpful, professional manner.`;
  }

  async startChat() {
    console.log('\n🚀 LampCode - Your AI Coding Assistant\n');
    console.log('Type "exit" or "quit" to end the session\n');

    // Read project context
    const initialProjectFiles = await this.fileScanner.scanProjectFiles();
    this.setProjectFiles(initialProjectFiles);
    if (this.projectFiles.length > 0) {
      console.log(`📁 Found ${this.projectFiles.length} relevant files in your project\n`);
    }

    console.log('Commands: help, clear, read <file>, edit <file>, search <query>, open <file>, exit/quit\n');

    this.rl.setPrompt('lamp> ');
    this.rl.prompt();

    this.rl.on('line', async (input) => {
      const trimmedInput = input.trim().toLowerCase();

      // Exit command
      if (trimmedInput === 'exit' || trimmedInput === 'quit') {
        console.log('\n👋 Goodbye!');
        this.rl.close();
        return;
      }

      // Help command
      if (trimmedInput === 'help') {
        await commands.help();
        this.rl.prompt();
        return;
      }

      // Clear command
      if (trimmedInput === 'clear') {
        console.clear();
        this.rl.prompt();
        return;
      }

      // Read command
      if (trimmedInput.startsWith('read ')) {
        await commands.read(input.trim(), this.getContext());
        this.rl.prompt();
        return;
      }

      // Edit command
      if (trimmedInput.startsWith('edit ')) {
        await commands.edit(input.trim(), this.getContext());
        this.rl.prompt();
        return;
      }

      // Search command
      if (trimmedInput.startsWith('search ')) {
        await commands.search(input.trim(), this.getContext());
        this.rl.prompt();
        return;
      }

      // Open command
      if (trimmedInput.startsWith('open ')) {
        await commands.open(input.trim(), this.getContext());
        this.rl.prompt();
        return;
      }

      // Process as AI chat message
      if (input.trim()) {
        await this.processMessage(input.trim());
      }

      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log('\n👋 Goodbye!');
      process.exit(0);
    });
  }

  // Get context object for commands
  getContext() {
    return {
      workingDirectory: this.workingDirectory,
      apiClient: this.apiClient,
      fileScanner: this.fileScanner,
      systemPrompt: this.systemPrompt,
      rl: this.rl,
      processMessage: this.processMessage.bind(this),
      projectFiles: this.projectFiles,
      setProjectFiles: this.setProjectFiles.bind(this),
      toolHandlers: this.toolHandlers
    };
  }

  async processMessage(userMessage, projectFilesOverride = undefined) {
    console.log('Processing...');

    const projectFiles = Array.isArray(projectFilesOverride) ? projectFilesOverride : this.projectFiles;

    try {
      const messages = this.buildBaseMessages(projectFiles);
      const historyEntries = [{ role: 'user', content: userMessage }];

      messages.push({
        role: 'user',
        content: userMessage
      });

      let iterations = 0;
      let rawResponse = await this.apiClient.makeRequest(messages);
      let parsedResponse = this.safeParseModelResponse(rawResponse);

      while (parsedResponse && parsedResponse.type === 'tool_call' && iterations < this.maxToolIterations) {
        const toolName = parsedResponse.tool;
        const toolArgs = parsedResponse.args || {};
        console.log(`\n🔧 Executing tool: ${toolName}`);
        if (Object.keys(toolArgs).length > 0) {
          console.log(`   Args: ${JSON.stringify(toolArgs)}`);
        }
        const toolResult = await this.executeTool(toolName, toolArgs);

        if (toolResult?.type === 'tool_error') {
          console.log(`   ❌ Tool error: ${toolResult.error}`);
        } else {
          console.log(`   ✅ Tool finished: ${toolResult?.type || 'unknown_result'}`);
          if (toolResult?.refreshed_context) {
            console.log(`   🔄 Context refreshed (${toolResult.refreshed_context.count} files)`);
          }
        }

        const assistantToolMessage = {
          role: 'assistant',
          content: JSON.stringify({
            type: 'tool_call',
            tool: toolName,
            args: toolArgs
          })
        };

        const toolMessage = {
          role: 'tool',
          name: toolName,
          content: JSON.stringify(toolResult)
        };

        messages.push(assistantToolMessage, toolMessage);
        historyEntries.push(assistantToolMessage, toolMessage);

        iterations += 1;
        rawResponse = await this.apiClient.makeRequest(messages);
        parsedResponse = this.safeParseModelResponse(rawResponse);
      }

      if (parsedResponse && parsedResponse.type === 'tool_call') {
        parsedResponse = {
          type: 'reply',
          message: `I reached the tool call limit (${this.maxToolIterations}). Please try again.`
        };
        console.log(`   ⚠️ Tool iteration limit of ${this.maxToolIterations} reached.`);
      }

      const assistantOutput = this.formatAssistantOutput(parsedResponse, rawResponse);

      console.log('\n🤖 Assistant:');
      console.log(assistantOutput);
      console.log();

      historyEntries.push({ role: 'assistant', content: assistantOutput });
      this.appendToHistory(historyEntries);

    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  setProjectFiles(files) {
    this.projectFiles = Array.isArray(files) ? files : [];
  }

  buildBaseMessages(projectFiles) {
    const messages = [{
      role: 'system',
      content: this.systemPrompt
    }];

    this.conversationHistory.slice(-10).forEach((msg) => {
      messages.push(msg);
    });

    if (projectFiles && projectFiles.length > 0) {
      const contextMessage = `Here are some files from your current project:\n\n${
        projectFiles.map((f) => `File: ${f.path}\n${f.content}`).join('\n\n')
      }`;
      messages.push({
        role: 'system',
        content: contextMessage
      });
    }

    return messages;
  }

  safeParseModelResponse(rawResponse) {
    if (!rawResponse) {
      return null;
    }

    try {
      return JSON.parse(rawResponse);
    } catch (error) {
      return null;
    }
  }

  formatAssistantOutput(parsedResponse, rawResponse) {
    if (parsedResponse && parsedResponse.type === 'reply' && typeof parsedResponse.message === 'string') {
      return parsedResponse.message.trim();
    }

    if (parsedResponse && parsedResponse.type === 'error' && typeof parsedResponse.message === 'string') {
      return `Error: ${parsedResponse.message.trim()}`;
    }

    return rawResponse;
  }

  async executeTool(toolName, args) {
    const handler = this.toolHandlers[toolName];

    if (!handler) {
      return {
        type: 'tool_error',
        error: `Unknown tool "${toolName}".`
      };
    }

    try {
      const context = this.getContext();
      return await handler(args ?? {}, context);
    } catch (error) {
      return {
        type: 'tool_error',
        error: error.message || 'Tool execution failed.'
      };
    }
  }

  appendToHistory(entries) {
    this.conversationHistory.push(...entries);

    if (this.conversationHistory.length > 40) {
      this.conversationHistory.splice(0, this.conversationHistory.length - 40);
    }
  }
}

module.exports = { LampCode };
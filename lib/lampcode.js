const path = require('path');
const readline = require('readline');
const APIClient = require('./utils/apiClient');
const FileScanner = require('./utils/fileScanner');
const UI = require('./utils/ui');
const commands = require('./commands');
const { toolSchemas, ...tools } = require('./tools');
const { estimateHistoryTokens, estimateTokens } = require('./utils/tokenEstimator');

const INDENT = '   ';
const DEFAULT_DIVIDER_LENGTH = 60;
const MAX_CONTEXT_FILES = 8;
const CONTEXT_SNIPPET_LENGTH = 1200;
const MAX_HISTORY_TOKENS = 8000; // Trim history if it exceeds this

// Model-specific token limits and safety margins
const MODEL_CONFIGS = {
  'x-ai/grok-code-fast-1': { maxInputTokens: 8000, safetyMargin: 1000, maxOutputTokens: 1000 },
  'anthropic/claude-3.5-sonnet': { maxInputTokens: 180000, safetyMargin: 5000, maxOutputTokens: 8192 },
  'openai/gpt-4': { maxInputTokens: 120000, safetyMargin: 4000, maxOutputTokens: 4096 },
  'openai/gpt-3.5-turbo': { maxInputTokens: 15000, safetyMargin: 2000, maxOutputTokens: 4096 },
  // Default for unknown models
  'default': { maxInputTokens: 8000, safetyMargin: 1000, maxOutputTokens: 1000 }
};
const DEFAULT_FILE_SEARCH_LIMIT = 1000; // Default limit for search operations

class LampCode {
  constructor() {
    // Load environment variables
    require('dotenv').config();

    // Configuration
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.model = process.env.OPENROUTER_MODEL || 'x-ai/grok-code-fast-1';
    this.workingDirectory = process.cwd();
    
    // Validate API key at startup
    if (!this.apiKey) {
      console.error('\n❌ Error: OPENROUTER_API_KEY not found in environment');
      console.error('\n📝 Quick fix:');
      console.error('   1. Copy .env.example to .env: cp .env.example .env');
      console.error('   2. Add your API key from https://openrouter.ai');
      console.error('   3. Edit .env and set: OPENROUTER_API_KEY=your_key_here');
      console.error('   4. Restart lamp\n');
      process.exit(1);
    }
    
    // Initialize utilities
    this.apiClient = new APIClient(this.apiKey, this.model);
    this.fileScanner = new FileScanner(this.workingDirectory);
    this.ui = new UI(70);
    this.projectFiles = [];
    this.toolHandlers = tools;
    this.maxToolIterations = 5;
    this.uiConfig = {
      divider: 'unicode',
      verbosity: 'minimal'
    };
    this.dividerLength = DEFAULT_DIVIDER_LENGTH;
    this.toolHistory = [];
    this.projectFileIndex = new Map();
    this.projectBaseNameIndex = new Map();
    this.recentContextPaths = [];
    this.knownPaths = new Set();
    this.directoryIndexLoaded = false;
    this.cachedDirectoryEntries = [];
    this.directoryIndexPromise = null;
    this.lastContextKey = null;
    this.cachedContextSnippets = null;
    this.changeLog = [];
    
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

  /**
   * Get recent conversation history
   * @param {number} limit - Maximum number of entries to return
   * @returns {Array} Recent conversation entries
   */
  getRecentConversation(limit = 10) {
    if (this.conversationHistory.length <= limit) {
      return [...this.conversationHistory];
    }

    return this.conversationHistory.slice(this.conversationHistory.length - limit);
  }

  /**
   * Get model configuration for current model
   * @returns {Object} Model configuration with maxInputTokens, safetyMargin, maxOutputTokens
   */
  getModelConfig() {
    return MODEL_CONFIGS[this.model] || MODEL_CONFIGS['default'];
  }

  getSystemPrompt() {
    return `You are LampCode, an expert coding assistant specialized in agentic task completion.

**Working Directory:** ${this.workingDirectory}

**Your Capabilities:**
- Write, debug, and explain code with precision
- Analyze project structure and provide architectural insights
- Suggest improvements following best practices
- Create and modify files using available tools
- Search codebases efficiently

**Guidelines:**
- Be specific and concrete - avoid vague solutions
- Use tools proactively to gather information and implement changes
- Iterate quickly and refine based on context
- Always explain your reasoning when suggesting changes
- Focus only on relevant files and context
- Point out potential issues and improvements

**Tool Usage Strategy:**
- Use \`read_file\` to examine specific files or code sections
- Use \`search_code\` to find patterns, functions, or imports across the codebase
- Use \`create_file\` to generate new files with content
- Use \`edit_file\` for targeted modifications using find/replace operations
- Use \`list_directory\` to explore project structure
- Use \`list_context\` to see what's currently loaded in memory
- Use \`refresh_context\` when you need to see recently created/modified files

**Important Notes:**
- All file paths are relative to the working directory
- For large files, use line ranges in \`read_file\` when possible
- Multiple edits can be batched in a single \`edit_file\` call
- Always validate that files exist before attempting to edit them

Respond in a helpful, professional, and efficient manner. Use tools as needed to complete tasks accurately.`;
  }

  /**
   * Start the interactive chat interface
   */
  async startChat() {
    // Read project context
    const initialProjectFiles = await this.fileScanner.scanProjectFiles();
    this.setProjectFiles(initialProjectFiles);
    
    // Show welcome screen
    this.ui.welcome(this.projectFiles.length, this.workingDirectory);

    this.rl.setPrompt('lamp> ');
    this.rl.prompt();

    this.rl.on('line', async (input) => {
      const trimmedInput = input.trim().toLowerCase();

      // Exit command
      if (trimmedInput === 'exit' || trimmedInput === 'quit') {
        this.ui.goodbye();
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

      // History command
      if (trimmedInput === 'history') {
        await commands.history(input.trim(), this.getContext());
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
      toolHandlers: this.toolHandlers,
      getDivider: this.getDivider.bind(this),
      uiConfig: { ...this.uiConfig },
      updateUIConfig: this.updateUIConfig.bind(this),
      getToolHistory: this.getToolHistory.bind(this),
      getUIConfig: this.getUIConfig.bind(this),
      refreshProjectEntry: this.refreshProjectEntry.bind(this),
      getRecentChanges: this.getRecentChanges.bind(this)
    };
  }

  /**
   * Process user message with AI, executing tools as needed
   * @param {string} userMessage - User input message
   * @param {Array} projectFilesOverride - Optional override for project files context
   */
  async processMessage(userMessage, projectFilesOverride = undefined) {
    this.ui.processing();

    const projectFiles = Array.isArray(projectFilesOverride) ? projectFilesOverride : this.projectFiles;

    try {
      const messages = await this.buildBaseMessages(projectFiles);
      const historyEntries = [{ role: 'user', content: userMessage }];

      messages.push({
        role: 'user',
        content: userMessage
      });

      let iterations = 0;
      let messageResponse = await this.apiClient.makeRequest(messages, {
        tools: toolSchemas,
        tool_choice: 'auto',
        temperature: 0.2 // Lower temperature for deterministic tool calls
      });

      // Native tool calling loop
      while (messageResponse.tool_calls && Array.isArray(messageResponse.tool_calls) && messageResponse.tool_calls.length > 0 && iterations < this.maxToolIterations) {
        // Add assistant message with tool_calls to history
        messages.push(messageResponse);
        historyEntries.push({
          role: 'assistant',
          content: messageResponse.content || '',
          tool_calls: messageResponse.tool_calls
        });

        // Execute each tool call
        for (const toolCall of messageResponse.tool_calls) {
          const toolName = toolCall.function.name;
          let toolArgs = {};
          
          try {
            toolArgs = JSON.parse(toolCall.function.arguments);
          } catch (parseError) {
            console.log(`${INDENT}⚠️ Failed to parse tool arguments: ${parseError.message}`);
          }

          const invocationStartedAt = Date.now();
          this.logToolInvocation(toolName, toolArgs);
          const toolResult = await this.executeTool(toolName, toolArgs);
          const elapsedMs = Date.now() - invocationStartedAt;

          if (toolResult?.type === 'tool_error') {
            this.logToolError(toolName, toolResult.error, elapsedMs);
            this.recordToolHistoryEntry({
              timestamp: new Date().toISOString(),
              tool: toolName,
              status: 'error',
              durationMs: elapsedMs,
              args: toolArgs,
              error: toolResult.error
            });
          } else {
            const summaryLines = this.logToolResult(toolName, toolResult, elapsedMs);
            this.recordToolHistoryEntry({
              timestamp: new Date().toISOString(),
              tool: toolName,
              status: 'success',
              durationMs: elapsedMs,
              args: toolArgs,
              resultType: toolResult?.type,
              summary: summaryLines
            });
          }

          // Add tool result message
          const toolMessage = {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult)
          };

          messages.push(toolMessage);
          historyEntries.push(toolMessage);
        }

        iterations += 1;
        messageResponse = await this.apiClient.makeRequest(messages, {
          tools: toolSchemas,
          tool_choice: 'auto',
          temperature: 0.2
        });
      }

      if (messageResponse.tool_calls && messageResponse.tool_calls.length > 0) {
        console.log(`${INDENT}⚠️ Tool iteration limit of ${this.maxToolIterations} reached.`);
        // Make final request without tools to get conversational response
        messages.push(messageResponse);
        messages.push({
          role: 'user',
          content: 'Please provide a final response based on the tool results so far.'
        });
        messageResponse = await this.apiClient.makeRequest(messages, {
          temperature: 0.7 // Higher temperature for conversational response
        });
      }

      // Extract final text response (higher temperature for natural conversation)
      let assistantOutput = messageResponse.content || '';
      
      // If no tool calls were made initially, we already have the conversational response at 0.2
      // Re-request with proper temperature if this was the first response
      if (iterations === 0 && assistantOutput) {
        // First response had tool schemas but no tool calls - get conversational response
        messageResponse = await this.apiClient.makeRequest(messages, {
          temperature: 0.7
        });
        assistantOutput = messageResponse.content || assistantOutput;
      }

      this.logAssistantResponse(assistantOutput);

      historyEntries.push({ role: 'assistant', content: assistantOutput });
      this.appendToHistory(historyEntries);

    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  /**
   * Set project files and rebuild indices
   * @param {Array} files - Array of file objects with path and content
   */
  setProjectFiles(files) {
    const safeFiles = Array.isArray(files) ? files : [];
    this.projectFiles = safeFiles
      .map((file) => {
        if (!file) {
          return null;
        }

        const normalizedPath = this.normalizeProjectPath(file.path);

        if (!normalizedPath) {
          return null;
        }

        return {
          ...file,
          path: normalizedPath
        };
      })
      .filter(Boolean);
    this.cachedContextSnippets = null;
    this.lastContextKey = null;
    this.rebuildProjectIndex(this.projectFiles);
    this.directoryIndexLoaded = false;
    this.cachedDirectoryEntries = [];
    this.directoryIndexPromise = null;
    this.recordChange({
      type: 'context_refresh',
      details: {
        count: this.projectFiles.length
      }
    });
  }

  async buildBaseMessages(projectFiles) {
    const modelConfig = this.getModelConfig();
    const maxPromptTokens = modelConfig.maxInputTokens - modelConfig.maxOutputTokens - modelConfig.safetyMargin;

    const messages = [{
      role: 'system',
      content: this.systemPrompt
    }];

    // Add conversation history
    const historyMessages = this.getRecentConversation();
    messages.push(...historyMessages);

    // Estimate tokens used so far
    let currentTokens = estimateTokens(this.systemPrompt);
    historyMessages.forEach(msg => {
      if (msg && msg.content) {
        currentTokens += estimateTokens(msg.content);
      }
    });

    // Calculate available tokens for context
    const availableContextTokens = Math.max(maxPromptTokens - currentTokens, 0);
    
    if (availableContextTokens < 500) {
      // Not enough space for meaningful context, trim history and retry
      const trimmedHistory = historyMessages.slice(-Math.max(1, Math.floor(historyMessages.length / 2)));
      messages.splice(1, historyMessages.length, ...trimmedHistory);
      
      currentTokens = estimateTokens(this.systemPrompt);
      trimmedHistory.forEach(msg => {
        if (msg && msg.content) {
          currentTokens += estimateTokens(msg.content);
        }
      });
    }

    // Get context with budget-aware selection
    const ensuredContext = await this.ensureContextCoverage(projectFiles);
    const contextKey = this.buildContextKey(ensuredContext);
    const remainingTokens = Math.max(maxPromptTokens - currentTokens, 0);

    let selectedContext;
    if (this.lastContextKey && this.cachedContextSnippets && this.lastContextKey === contextKey) {
      selectedContext = this.cachedContextSnippets;
    } else {
      selectedContext = this.selectRelevantContextWithBudget(ensuredContext, remainingTokens, {
        maxFiles: MAX_CONTEXT_FILES,
        snippetLength: CONTEXT_SNIPPET_LENGTH
      });
      this.cachedContextSnippets = selectedContext;
      this.lastContextKey = contextKey;
    }

    // Add context to the main system message instead of creating a second system message
    if (selectedContext.length > 0) {
      const contextMessageLines = selectedContext.map((entry) => {
        const header = `File: ${entry.path}`;
        return `${header}\n${entry.content}`;
      });

      const contextContent = `\n\n## Project Context\n\nHere are relevant snippets from your project:\n\n${contextMessageLines.join('\n\n')}`;
      
      // Update the first (and only) system message to include context
      messages[0].content += contextContent;
    }

    return messages;
  }

  buildContextKey(contextEntries) {
    if (!Array.isArray(contextEntries) || contextEntries.length === 0) {
      return '';
    }

    const parts = contextEntries.map((entry) => {
      const pathPart = entry.path || '';
      const modifiedPart = entry.modified || '';
      const sizePart = typeof entry.content === 'string' ? entry.content.length : entry.size ?? 0;
      return `${pathPart}:${modifiedPart}:${sizePart}`;
    });

    parts.sort();
    return parts.join('|');
  }

  /**
   * Validate and sanitize tool arguments before execution
   * @param {string} toolName - Name of the tool
   * @param {Object} args - Tool arguments to validate
   * @returns {Object} Sanitized arguments
   * @throws {Error} If validation fails
   */
  validateToolArgs(toolName, args) {
    if (!args || typeof args !== 'object') {
      throw new Error(`Invalid arguments for tool "${toolName}": arguments must be an object`);
    }

    // Create a sanitized copy of arguments
    const sanitized = {};

    // Validate path arguments for tools that use them
    const pathTools = ['read_file', 'edit_file', 'create_file', 'list_directory'];
    if (pathTools.includes(toolName) && args.path !== undefined) {
      if (typeof args.path !== 'string') {
        throw new Error(`Tool "${toolName}" requires path to be a string`);
      }
      
      // Basic path sanitization - remove null bytes and excessive path components
      const cleanPath = args.path.replace(/\0/g, '').replace(/\.{2,}/g, '..');
      
      // Prevent obvious path traversal attempts
      if (cleanPath.includes('../') && cleanPath.split('../').length > 5) {
        throw new Error(`Tool "${toolName}" path contains excessive traversal attempts`);
      }
      
      sanitized.path = cleanPath.trim();
    }

    // Validate numeric arguments
    const numericFields = ['limit', 'max_depth', 'count', 'start', 'end', 'max_results'];
    numericFields.forEach(field => {
      if (args[field] !== undefined) {
        const num = Number(args[field]);
        if (!Number.isFinite(num) || num < 0 || num > 1000000) {
          throw new Error(`Tool "${toolName}" field "${field}" must be a valid non-negative number under 1M`);
        }
        sanitized[field] = Math.floor(num); // Ensure integer
      }
    });

    // Copy other safe fields
    const safeFields = ['query', 'content', 'overwrite', 'refresh_context', 'include_files', 
                       'include_hidden', 'operations', 'replace_all', 'include_metadata'];
    safeFields.forEach(field => {
      if (args[field] !== undefined) {
        sanitized[field] = args[field];
      }
    });

    // Validate and preserve nested 'lines' object for read_file
    if (toolName === 'read_file' && args.lines && typeof args.lines === 'object') {
      const lines = {};
      
      if (args.lines.start !== undefined) {
        const s = Number(args.lines.start);
        if (!Number.isInteger(s) || s < 1) {
          throw new Error(`Tool "read_file" lines.start must be an integer >= 1`);
        }
        lines.start = s;
      }
      
      if (args.lines.end !== undefined) {
        const e = Number(args.lines.end);
        if (!Number.isInteger(e) || e < 1) {
          throw new Error(`Tool "read_file" lines.end must be an integer >= 1`);
        }
        lines.end = e;
      }
      
      // Only set lines if at least one property was validated
      if (Object.keys(lines).length > 0) {
        sanitized.lines = lines;
      }
    }

    // Validate operations array for edit_file tool
    if (toolName === 'edit_file' && sanitized.operations) {
      if (!Array.isArray(sanitized.operations)) {
        throw new Error('Tool "edit_file" operations must be an array');
      }
      // Limit operations count to prevent abuse
      if (sanitized.operations.length > 50) {
        throw new Error('Tool "edit_file" operations array cannot exceed 50 items');
      }
    }

    // Tool-specific schema validation
    if (toolName === 'read_file') {
      if (typeof sanitized.path !== 'string' || sanitized.path.trim() === '') {
        throw new Error('Tool "read_file" requires a non-empty path');
      }
      if (sanitized.lines !== undefined && typeof sanitized.lines !== 'object') {
        throw new Error('Tool "read_file" lines must be an object when provided');
      }
    }

    if (toolName === 'search_code') {
      if (typeof sanitized.query !== 'string' || sanitized.query.trim() === '') {
        throw new Error('Tool "search_code" requires a non-empty query');
      }
      if (sanitized.query.length > 500) {
        throw new Error('Tool "search_code" query cannot exceed 500 characters');
      }
    }

    if (toolName === 'edit_file') {
      if (!Array.isArray(sanitized.operations) || sanitized.operations.length === 0) {
        throw new Error('Tool "edit_file" requires a non-empty operations array');
      }
      sanitized.operations.forEach((op, idx) => {
        if (!op || typeof op !== 'object') {
          throw new Error(`Tool "edit_file" operations[${idx}] must be an object`);
        }
        if (!['replace', 'replace_range'].includes(op.type)) {
          throw new Error(`Tool "edit_file" operations[${idx}].type must be 'replace' or 'replace_range'`);
        }

        if (op.type === 'replace') {
          if (typeof op.find !== 'string' || op.find.length === 0) {
            throw new Error(`Tool "edit_file" operations[${idx}].find must be a non-empty string`);
          }
          if (op.count !== undefined && (!Number.isInteger(op.count) || op.count < 1)) {
            throw new Error(`Tool "edit_file" operations[${idx}].count must be an integer >= 1`);
          }
          if (op.replace !== undefined && typeof op.replace !== 'string') {
            throw new Error(`Tool "edit_file" operations[${idx}].replace must be a string when provided`);
          }
          if (op.replace_all !== undefined && typeof op.replace_all !== 'boolean') {
            throw new Error(`Tool "edit_file" operations[${idx}].replace_all must be a boolean when provided`);
          }
        } else if (op.type === 'replace_range') {
          if (!Number.isInteger(op.start) || op.start < 1) {
            throw new Error(`Tool "edit_file" operations[${idx}].start must be an integer >= 1`);
          }
          if (op.end !== undefined && (!Number.isInteger(op.end) || op.end < 1)) {
            throw new Error(`Tool "edit_file" operations[${idx}].end must be an integer >= 1 when provided`);
          }
          if (op.text !== undefined && typeof op.text !== 'string') {
            throw new Error(`Tool "edit_file" operations[${idx}].text must be a string when provided`);
          }
        }
      });
    }

    return sanitized;
  }

  /**
   * Execute a tool with validated arguments
   * @param {string} toolName - Name of the tool to execute
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} Tool result object
   */
  async executeTool(toolName, args) {
    const handler = this.toolHandlers[toolName];

    if (!handler) {
      return {
        type: 'tool_error',
        error: `Unknown tool "${toolName}".`
      };
    }

    try {
      // Validate and sanitize tool arguments before execution
      const sanitizedArgs = this.validateToolArgs(toolName, args ?? {});
      const context = this.getContext();
      return await handler(sanitizedArgs, context);
    } catch (error) {
      return {
        type: 'tool_error',
        error: error.message || 'Tool execution failed.'
      };
    }
  }

  /**
   * Append entries to conversation history with token-based trimming
   * @param {Array} entries - Message entries to append
   */
  appendToHistory(entries) {
    this.conversationHistory.push(...entries);

    // Trim by entry count (hard limit)
    if (this.conversationHistory.length > 40) {
      this.conversationHistory.splice(0, this.conversationHistory.length - 40);
    }

    // Trim by token count (soft limit)
    const estimatedTokens = estimateHistoryTokens(this.conversationHistory);
    if (estimatedTokens > MAX_HISTORY_TOKENS) {
      // Remove oldest entries until under token limit
      while (
        this.conversationHistory.length > 1 &&
        estimateHistoryTokens(this.conversationHistory) > MAX_HISTORY_TOKENS
      ) {
        this.conversationHistory.shift();
      }
    }
  }

  printDivider() {
    console.log(this.getDivider());
  }

  logToolInvocation(toolName, toolArgs) {
    this.ui.toolHeader(toolName, toolArgs);
  }

  logToolError(toolName, errorMessage, elapsedMs) {
    this.ui.toolError(toolName, errorMessage, elapsedMs);
    this.ui.divider();
  }

  logToolResult(toolName, result, elapsedMs) {
    this.ui.toolResult(toolName, result, elapsedMs);

    const summaryLines = this.buildToolSummary(result);
    const includeDetails = this.uiConfig?.verbosity !== 'minimal';
    
    if (includeDetails && summaryLines.length > 0) {
      summaryLines.forEach((line) => {
        console.log(`   ${line}`);
      });
    }

    if (result?.refreshed_context) {
      this.ui.info(`Context refreshed (${result.refreshed_context.count} files)`, '🔄');
    }

    this.ui.divider();
    return summaryLines;
  }

  buildToolSummary(result) {
    if (!result || typeof result !== 'object') {
      return [];
    }

    const lines = [];
    const countMatches = Array.isArray(result.matches) ? result.matches.length : undefined;

    switch (result.type) {
      case 'list_context_result':
        lines.push(`Files in cache: ${result.count ?? 0}`);
        break;
      case 'refresh_context_result':
        if (result.message) {
          lines.push(result.message);
        } else {
          lines.push(`Context refreshed with ${result.files ? result.files.length : 0} file(s).`);
        }
        break;
      case 'read_file_result':
        if (result.path) {
          lines.push(`Path: ${result.path}`);
        }
        lines.push(`Characters returned: ${result.content ? result.content.length : 0}`);
        break;
      case 'search_code_result':
        if (result.query) {
          lines.push(`Query: ${result.query}`);
        }
        lines.push(`Matches: ${countMatches ?? 0}`);
        if (countMatches) {
          const uniqueFiles = new Set(result.matches.map((match) => match.file));
          lines.push(`Files matched: ${uniqueFiles.size}`);
        }
        break;
      case 'edit_file_result':
        if (result.path) {
          lines.push(`Path: ${result.path}`);
        }
        lines.push(`Status: ${result.status}`);
        if (Array.isArray(result.operations_applied) && result.operations_applied.length > 0) {
          const opSummaries = result.operations_applied.map((op) => {
            if (op.type === 'replace') {
              const replacements = op.replacements ?? 0;
              return `${replacements} replacement${replacements === 1 ? '' : 's'}`;
            }
            if (op.type === 'replace_range') {
              return `lines ${op.start}-${op.end}`;
            }
            return op.type;
          });
          lines.push(`Operations: ${opSummaries.join(', ')}`);
        }
        if (typeof result.bytes_delta === 'number') {
          const delta = result.bytes_delta;
          lines.push(`Size change: ${delta >= 0 ? '+' : ''}${delta} bytes`);
        }
        break;
      case 'create_file_result':
        if (result.path) {
          lines.push(`Path: ${result.path}`);
        }
        lines.push(`Status: ${result.status}`);
        if (typeof result.bytes_written === 'number') {
          lines.push(`Bytes written: ${result.bytes_written}`);
        }
        break;
      default:
        if (result.message) {
          lines.push(result.message);
        }
    }

    return lines;
  }

  logAssistantResponse(message) {
    this.ui.assistantMessage(message);
  }

  recordToolHistoryEntry(entry) {
    if (!entry || typeof entry !== 'object') {
      return;
    }

    this.toolHistory.push(entry);

    if (this.toolHistory.length > 25) {
      this.toolHistory.shift();
    }
  }

  getToolHistory() {
    return [...this.toolHistory];
  }

  updateUIConfig(changes = {}) {
    const nextConfig = { ...this.uiConfig };
    const allowedDivider = ['unicode', 'ascii'];
    const allowedVerbosity = ['detailed', 'minimal'];

    if (Object.prototype.hasOwnProperty.call(changes, 'divider')) {
      const dividerValue = changes.divider;
      if (!allowedDivider.includes(dividerValue)) {
        throw new Error(`Unsupported divider style "${dividerValue}". Use "unicode" or "ascii".`);
      }
      nextConfig.divider = dividerValue;
    }

    if (Object.prototype.hasOwnProperty.call(changes, 'verbosity')) {
      const verbosityValue = changes.verbosity;
      if (!allowedVerbosity.includes(verbosityValue)) {
        throw new Error(`Unsupported verbosity "${verbosityValue}". Use "detailed" or "minimal".`);
      }
      nextConfig.verbosity = verbosityValue;
    }

    if (Object.prototype.hasOwnProperty.call(changes, 'dividerLength')) {
      const parsed = Number.parseInt(changes.dividerLength, 10);
      if (!Number.isInteger(parsed) || parsed < 20 || parsed > 120) {
        throw new Error('Divider length must be an integer between 20 and 120.');
      }
      this.dividerLength = parsed;
    }

    this.uiConfig = nextConfig;

    return this.getUIConfig();
  }

  getDivider() {
    const style = this.uiConfig?.divider === 'ascii' ? '-' : '─';
    const length = Number.isInteger(this.dividerLength) ? this.dividerLength : DEFAULT_DIVIDER_LENGTH;
    return style.repeat(length);
  }

  getUIConfig() {
    return {
      ...this.uiConfig,
      dividerLength: this.dividerLength
    };
  }

  async findFilesByBaseName(baseName) {
    if (!baseName) {
      return [];
    }

    const indexed = this.projectBaseNameIndex.get(baseName);
    if (indexed && indexed.length > 0) {
      return indexed;
    }

    const directoryEntries = await this.lookupDirectoryIndex();
    return directoryEntries
      .filter((entry) => entry.type === 'file' && path.basename(entry.path) === baseName)
      .map((entry) => entry.path);
  }

  selectRelevantContext(projectFiles, options = {}) {
    if (!Array.isArray(projectFiles) || projectFiles.length === 0) {
      return [];
    }

    const {
      maxFiles = MAX_CONTEXT_FILES,
      snippetLength = CONTEXT_SNIPPET_LENGTH
    } = options;

    const scored = projectFiles.map((file) => {
      const recentBoost = this.recentContextPaths.includes(file.path) ? 5 : 0;
      const sizePenalty = Math.log(Math.max(file.content ? file.content.length : 1, 1));
      return {
        file,
        score: recentBoost - sizePenalty
      };
    });

    scored.sort((a, b) => b.score - a.score);

    const selected = scored.slice(0, maxFiles);
    const results = selected.map((entry) => {
      const file = entry.file;
      let content = typeof file.content === 'string' ? file.content : '';

      if (content.length > snippetLength) {
        content = `${content.slice(0, snippetLength)}\n...\n[truncated for context]`;
      }

      return {
        path: file.path,
        modified: file.modified,
        size: file.size,
        content
      };
    });

    this.recentContextPaths = results.map((entry) => entry.path);
    return results;
  }

  /**
   * Budget-aware context selection that respects token limits
   * @param {Array} projectFiles - Available project files
   * @param {number} tokenBudget - Maximum tokens available for context
   * @param {Object} options - Selection options
   * @returns {Array} Selected context entries within budget
   */
  selectRelevantContextWithBudget(projectFiles, tokenBudget, options = {}) {
    if (!Array.isArray(projectFiles) || projectFiles.length === 0 || tokenBudget <= 0) {
      return [];
    }

    const {
      maxFiles = MAX_CONTEXT_FILES,
      snippetLength = CONTEXT_SNIPPET_LENGTH
    } = options;

    // Score and sort files by relevance
    const scored = projectFiles.map((file) => {
      const recentBoost = this.recentContextPaths.includes(file.path) ? 5 : 0;
      const sizePenalty = Math.log(Math.max(file.content ? file.content.length : 1, 1));
      return {
        file,
        score: recentBoost - sizePenalty
      };
    });

    scored.sort((a, b) => b.score - a.score);

    // Iteratively add files while staying within budget
    const results = [];
    let usedTokens = 0;
    const overhead = 50; // Approximate tokens for headers and formatting

    for (const entry of scored) {
      if (results.length >= maxFiles) {
        break;
      }

      const file = entry.file;
      let content = typeof file.content === 'string' ? file.content : '';
      
      // Start with full content, then trim if necessary
      let currentSnippetLength = Math.min(content.length, snippetLength);
      let estimatedTokens = estimateTokens(content.slice(0, currentSnippetLength)) + overhead;

      // If this file would exceed budget, try with progressively smaller snippets
      while (estimatedTokens > 0 && usedTokens + estimatedTokens > tokenBudget && currentSnippetLength > 200) {
        currentSnippetLength = Math.floor(currentSnippetLength * 0.7); // Reduce by 30%
        estimatedTokens = estimateTokens(content.slice(0, currentSnippetLength)) + overhead;
      }

      // Skip file if even a minimal snippet would exceed budget
      if (usedTokens + estimatedTokens > tokenBudget) {
        continue;
      }

      // Truncate content if needed
      if (currentSnippetLength < content.length) {
        content = `${content.slice(0, currentSnippetLength)}\n...\n[truncated for token budget]`;
      }

      results.push({
        path: file.path,
        modified: file.modified,
        size: file.size,
        content
      });

      usedTokens += estimatedTokens;
    }

    this.recentContextPaths = results.map((entry) => entry.path);
    return results;
  }

  rebuildProjectIndex(files) {
    this.projectFileIndex.clear();
    this.projectBaseNameIndex.clear();

    files.forEach((file) => {
      if (!file || !file.path) {
        return;
      }

      this.projectFileIndex.set(file.path, file);
      const base = path.basename(file.path);
      const existing = this.projectBaseNameIndex.get(base) || [];
      existing.push(file.path);
      this.projectBaseNameIndex.set(base, existing);
      this.knownPaths.add(file.path);
    });
  }

  async refreshProjectEntry(relativePath, options = {}) {
    const {
      includeContent = true,
      includeMetadata = true,
      changeType,
      changeDetails
    } = options;

    return this.loadFileEntry(relativePath, {
      includeContent,
      includeMetadata,
      recordChange: true,
      changeType,
      changeDetails
    });
  }

  async ensureContextCoverage(projectFiles) {
    const files = Array.isArray(projectFiles) ? [...projectFiles] : [];
    const known = new Set(files.map((file) => file.path));

    // Performance: Only check files that haven't been validated recently (5 min throttle)
    const now = Date.now();
    const VALIDATION_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes
    const MAX_CHECKS_PER_MESSAGE = 3; // Reduce from 5 to 3

    const staleCandidates = files
      .filter((file) => {
        if (!file || !file.path) return false;
        // Skip if recently validated
        if (file.lastValidated && (now - file.lastValidated) < VALIDATION_THROTTLE_MS) {
          return false;
        }
        return true;
      })
      .slice(0, MAX_CHECKS_PER_MESSAGE);
    if (staleCandidates.length > 0) {
      const metadataChecks = await Promise.all(
        staleCandidates.map((file) => this.fileScanner.readFileEntry(file.path, {
          includeContent: false,
          includeMetadata: true
        }).catch(() => null))
      );

      for (let index = 0; index < metadataChecks.length; index += 1) {
        const metadata = metadataChecks[index];
        const original = staleCandidates[index];

        if (!metadata) {
          continue;
        }

        const targetPath = metadata.path || original.path;
        if (!original || !original.modified || metadata.modified !== original.modified) {
          const refreshed = await this.loadFileEntry(targetPath);
          if (refreshed) {
            // Mark as validated with timestamp
            refreshed.lastValidated = now;
            const existingIndex = files.findIndex((file) => file.path === refreshed.path);
            if (existingIndex >= 0) {
              files[existingIndex] = refreshed;
            } else {
              files.push(refreshed);
              known.add(refreshed.path);
            }
          }
        } else {
          // File hasn't changed, just update validation timestamp
          original.lastValidated = now;
        }
      }
    }

    const missingPaths = Array.from(this.knownPaths).filter((p) => !known.has(p)).slice(0, 5);

    if (missingPaths.length === 0) {
      return files;
    }

    const entries = await Promise.all(
      missingPaths.map((relativePath) => this.loadFileEntry(relativePath).catch(() => null))
    );

    entries.forEach((entry, index) => {
      if (entry) {
        this.upsertProjectEntry(entry);
        if (!known.has(entry.path)) {
          files.push(entry);
          known.add(entry.path);
        }
      } else {
        this.knownPaths.delete(missingPaths[index]);
      }
    });

    return files;
  }

  async loadFileEntry(relativePath, options = {}) {
    const normalizedPath = this.normalizeProjectPath(relativePath);

    if (!normalizedPath) {
      throw new Error(`Path "${relativePath}" is outside the working directory.`);
    }

    const {
      includeContent = true,
      includeMetadata = true,
      recordChange = false,
      changeType,
      changeDetails
    } = options;

    const previous = this.projectFileIndex.get(normalizedPath) || null;
    const entry = await this.fileScanner.readFileEntry(normalizedPath, {
      includeContent,
      includeMetadata
    });

    const modifiedChanged = includeMetadata && previous?.modified !== entry.modified;
    const sizeChanged = includeMetadata && previous?.size !== entry.size;
    const contentChanged = includeContent && previous?.content !== entry.content;
    const hasChanged = !previous || modifiedChanged || sizeChanged || contentChanged;

    this.upsertProjectEntry(entry);
    this.commitProjectEntry(entry);

    if (hasChanged) {
      this.cachedContextSnippets = null;
      this.lastContextKey = null;
      if (!previous) {
        this.directoryIndexLoaded = false;
        this.cachedDirectoryEntries = [];
      }
    }

    if (recordChange) {
      this.recordChange({
        type: changeType || (previous ? 'file_updated' : 'file_added'),
        path: entry.path,
        modified: entry.modified,
        size: entry.size,
        ...(changeDetails || {})
      });
    }

    return entry;
  }

  upsertProjectEntry(entry) {
    if (!entry || !entry.path) {
      return;
    }

    this.projectFileIndex.set(entry.path, entry);
    const base = path.basename(entry.path);
    const stored = this.projectBaseNameIndex.get(base) || [];

    if (!stored.includes(entry.path)) {
      stored.push(entry.path);
      this.projectBaseNameIndex.set(base, stored);
    }

    this.knownPaths.add(entry.path);
  }

  commitProjectEntry(entry) {
    if (!entry || !entry.path) {
      return;
    }

    const index = this.projectFiles.findIndex((file) => file.path === entry.path);
    const copy = { ...entry };

    if (index >= 0) {
      this.projectFiles[index] = copy;
    } else {
      this.projectFiles.push(copy);
    }
  }

  normalizeProjectPath(inputPath) {
    if (typeof inputPath !== 'string' || inputPath.trim() === '') {
      return null;
    }

    const base = path.resolve(this.workingDirectory);
    const absolute = path.resolve(this.workingDirectory, inputPath);
    const relative = path.relative(base, absolute);

    // Use secure path.relative check instead of vulnerable startsWith
    // Empty or '.' means same directory - allowed
    if (relative === '' || relative === '.') {
      return '.';
    }

    // If relative path starts with '..' or is absolute, it's outside workspace
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      return null;
    }

    return relative.replace(/\\/g, '/');
  }

  async lookupDirectoryIndex() {
    if (this.directoryIndexLoaded && this.cachedDirectoryEntries && this.cachedDirectoryEntries.length > 0) {
      return this.cachedDirectoryEntries;
    }

    if (this.directoryIndexPromise) {
      return await this.directoryIndexPromise;
    }

    this.directoryIndexPromise = this.fileScanner.buildDirectoryIndex({
      includeFiles: true,
      includeHidden: false,
      maxDepth: 4,
      limit: 400
    }).then((entries) => {
      this.cachedDirectoryEntries = entries;
      this.directoryIndexLoaded = true;
      entries.forEach((entry) => {
        this.knownPaths.add(entry.path);
      });
      return entries;
    }).catch((error) => {
      // Reset promise on error so retry is possible
      this.directoryIndexPromise = null;
      this.directoryIndexLoaded = false;
      // Return empty array on error
      return [];
    });

    return await this.directoryIndexPromise;
  }

  recordChange(change) {
    if (!change || typeof change !== 'object') {
      return;
    }

    const entry = {
      timestamp: new Date().toISOString(),
      ...change
    };

    this.changeLog.push(entry);

    if (this.changeLog.length > 50) {
      this.changeLog.splice(0, this.changeLog.length - 50);
    }
  }

  getRecentChanges(limit = 20) {
    if (limit <= 0) {
      return [];
    }

    return this.changeLog.slice(-limit).map((entry) => ({ ...entry }));
  }
}

module.exports = { LampCode };
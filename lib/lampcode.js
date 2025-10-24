const path = require('path');
const readline = require('readline');
const APIClient = require('./utils/apiClient');
const FileScanner = require('./utils/fileScanner');
const commands = require('./commands');
const tools = require('./tools');

const INDENT = '   ';
const DEFAULT_DIVIDER_LENGTH = 60;
const MAX_CONTEXT_FILES = 8;
const CONTEXT_SNIPPET_LENGTH = 1200;

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

  getRecentConversation(limit = 10) {
    if (this.conversationHistory.length <= limit) {
      return [...this.conversationHistory];
    }

    return this.conversationHistory.slice(this.conversationHistory.length - limit);
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
    this.printDivider();
    console.log('🚀 LampCode - Your AI Coding Assistant');
    this.printDivider();
    console.log('Type "exit" or "quit" to end the session');
    this.printDivider();

    // Read project context
    const initialProjectFiles = await this.fileScanner.scanProjectFiles();
    this.setProjectFiles(initialProjectFiles);
    if (this.projectFiles.length > 0) {
      console.log(`📁 Found ${this.projectFiles.length} relevant files in your project`);
      this.printDivider();
    }

    console.log('Commands: help, clear, read <file>, edit <file>, search <query>, open <file>, exit/quit');
    this.printDivider();

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

  async processMessage(userMessage, projectFilesOverride = undefined) {
    console.log('\nProcessing...');

    const projectFiles = Array.isArray(projectFilesOverride) ? projectFilesOverride : this.projectFiles;

    try {
      const messages = await this.buildBaseMessages(projectFiles);
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
        console.log(`${INDENT}⚠️ Tool iteration limit of ${this.maxToolIterations} reached.`);
      }

      const assistantOutput = this.formatAssistantOutput(parsedResponse, rawResponse);

      this.logAssistantResponse(assistantOutput);

      historyEntries.push({ role: 'assistant', content: assistantOutput });
      this.appendToHistory(historyEntries);

    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

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
    this.recordChange({
      type: 'context_refresh',
      details: {
        count: this.projectFiles.length
      }
    });
  }

  async buildBaseMessages(projectFiles) {
    const messages = [{
      role: 'system',
      content: this.systemPrompt
    }];

    this.getRecentConversation().forEach((msg) => {
      messages.push(msg);
    });

    const ensuredContext = await this.ensureContextCoverage(projectFiles);
    const contextKey = this.buildContextKey(ensuredContext);

    let selectedContext;
    if (this.lastContextKey && this.cachedContextSnippets && this.lastContextKey === contextKey) {
      selectedContext = this.cachedContextSnippets;
    } else {
      selectedContext = this.selectRelevantContext(ensuredContext, {
        maxFiles: MAX_CONTEXT_FILES,
        snippetLength: CONTEXT_SNIPPET_LENGTH
      });
      this.cachedContextSnippets = selectedContext;
      this.lastContextKey = contextKey;
    }

    if (selectedContext.length > 0) {
      const contextMessageLines = selectedContext.map((entry) => {
        const header = `File: ${entry.path}`;
        return `${header}\n${entry.content}`;
      });

      messages.push({
        role: 'system',
        content: `Here are relevant snippets from your project:\n\n${contextMessageLines.join('\n\n')}`
      });
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

  printDivider() {
    console.log(this.getDivider());
  }

  logToolInvocation(toolName, toolArgs) {
    const divider = this.getDivider();
    console.log(`\n${divider}`);
    console.log(`🔧 Tool call: ${toolName}`);

    const includeDetails = this.uiConfig?.verbosity !== 'minimal';
    const keys = Object.keys(toolArgs);

    if (includeDetails && keys.length > 0) {
      console.log(`${INDENT}Args:`);
      keys.forEach((key) => {
        console.log(`${INDENT}- ${key}: ${JSON.stringify(toolArgs[key])}`);
      });
    } else if (!includeDetails && keys.length > 0) {
      console.log(`${INDENT}Args provided (${keys.length} field${keys.length === 1 ? '' : 's'})`);
    }
  }

  logToolError(toolName, errorMessage, elapsedMs) {
    console.log(`${INDENT}❌ ${toolName} failed: ${errorMessage || 'Unknown error.'}`);
    if (typeof elapsedMs === 'number') {
      console.log(`${INDENT}⏱️ Duration: ${elapsedMs} ms`);
    }
    this.printDivider();
  }

  logToolResult(toolName, result, elapsedMs) {
    const resultType = result?.type || 'unknown_result';
    console.log(`${INDENT}✅ ${toolName} completed (${resultType})`);

    const summaryLines = [];
    if (typeof elapsedMs === 'number') {
      summaryLines.push(`⏱️ Duration: ${elapsedMs} ms`);
    }
    summaryLines.push(...this.buildToolSummary(result));

    const includeDetails = this.uiConfig?.verbosity !== 'minimal';
    if (includeDetails) {
      summaryLines.forEach((line) => {
        console.log(`${INDENT}${line}`);
      });
    } else if (summaryLines.length > 0) {
      console.log(`${INDENT}${summaryLines[0]}`);
    }

    if (result?.refreshed_context) {
      console.log(`${INDENT}🔄 Context refreshed (${result.refreshed_context.count} files)`);
    }

    this.printDivider();
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
    const divider = this.getDivider();
    console.log(`\n${divider}`);
    console.log('🤖 Assistant');
    console.log(divider);
    console.log(message);
    console.log(divider);
    console.log('Ready for your next prompt.');
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

  findFilesByBaseName(baseName) {
    if (!baseName) {
      return [];
    }

    const indexed = this.projectBaseNameIndex.get(baseName);
    if (indexed && indexed.length > 0) {
      return indexed;
    }

    return this.lookupDirectoryIndex()
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

    const staleCandidates = files.slice(0, 5).filter((file) => file && file.path);
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
            const existingIndex = files.findIndex((file) => file.path === refreshed.path);
            if (existingIndex >= 0) {
              files[existingIndex] = refreshed;
            } else {
              files.push(refreshed);
              known.add(refreshed.path);
            }
          }
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

    const absolute = path.resolve(this.workingDirectory, inputPath);
    if (!absolute.toLowerCase().startsWith(this.workingDirectory.toLowerCase())) {
      return null;
    }

    const relative = path.relative(this.workingDirectory, absolute);
    return relative === '' ? '.' : relative.replace(/\\/g, '/');
  }

  lookupDirectoryIndex() {
    if (this.directoryIndexLoaded && this.cachedDirectoryEntries) {
      return this.cachedDirectoryEntries;
    }

    this.cachedDirectoryEntries = [];
    this.directoryIndexLoaded = true;

    this.fileScanner.buildDirectoryIndex({
      includeFiles: true,
      includeHidden: false,
      maxDepth: 4,
      limit: 400
    }).then((entries) => {
      this.cachedDirectoryEntries = entries;
      entries.forEach((entry) => {
        this.knownPaths.add(entry.path);
      });
    }).catch(() => {
      // Ignore errors building directory index
    });

    return this.cachedDirectoryEntries;
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
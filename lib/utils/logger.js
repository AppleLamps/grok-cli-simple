const fs = require('fs').promises;
const path = require('path');

/**
 * Logger utility for LampCode
 * Handles persistent logging to .lampcode/ folder
 */
class Logger {
  constructor(workingDirectory, options = {}) {
    this.workingDirectory = workingDirectory;
    this.enabled = options.enabled !== false; // Default to true
    this.logDir = options.logDir || '.lampcode';
    this.retentionDays = options.retentionDays || 30;

    // Full paths
    this.logDirPath = path.join(workingDirectory, this.logDir);
    this.sessionsDir = path.join(this.logDirPath, 'sessions');
    this.toolHistoryFile = path.join(this.logDirPath, 'tool-history.jsonl');
    this.changesFile = path.join(this.logDirPath, 'changes.jsonl');
    this.errorsFile = path.join(this.logDirPath, 'errors.log');

    // Session state
    this.sessionId = null;
    this.sessionStartTime = null;
    this.sessionMessages = [];
    this.sessionToolCalls = [];
    this.sessionChanges = [];
    this.sessionErrors = [];
  }

  /**
   * Initialize logging directory structure
   */
  async initialize() {
    if (!this.enabled) {
      return;
    }

    try {
      // Create directories
      await fs.mkdir(this.logDirPath, { recursive: true });
      await fs.mkdir(this.sessionsDir, { recursive: true });

      // Create .gitignore in .lampcode folder
      const gitignorePath = path.join(this.logDirPath, '.gitignore');
      const gitignoreContent = `# LampCode logs - excluded by default for privacy
sessions/
*.jsonl
*.log
`;
      await fs.writeFile(gitignorePath, gitignoreContent, 'utf8').catch(() => { });

      // Clean up old logs
      await this.cleanupOldLogs();
    } catch (error) {
      // Silently fail if we can't create log directory
      console.error(`Warning: Could not initialize logging: ${error.message}`);
      this.enabled = false;
    }
  }

  /**
   * Start a new session
   */
  async startSession(model) {
    if (!this.enabled) {
      return null;
    }

    this.sessionId = this.generateSessionId();
    this.sessionStartTime = new Date().toISOString();
    this.sessionMessages = [];
    this.sessionToolCalls = [];
    this.sessionChanges = [];
    this.sessionErrors = [];

    return this.sessionId;
  }

  /**
   * End the current session and write to disk
   */
  async endSession(model, totalTokens = 0) {
    if (!this.enabled || !this.sessionId) {
      return;
    }

    try {
      const sessionData = {
        session_id: this.sessionId,
        start_time: this.sessionStartTime,
        end_time: new Date().toISOString(),
        model: model,
        total_tokens: totalTokens,
        messages: this.sessionMessages,
        tool_calls: this.sessionToolCalls,
        changes: this.sessionChanges,
        errors: this.sessionErrors
      };

      const sessionFile = path.join(this.sessionsDir, `${this.sessionId}.json`);
      await fs.writeFile(sessionFile, JSON.stringify(sessionData, null, 2), 'utf8');

      // Update latest.json symlink (or copy on Windows)
      const latestFile = path.join(this.sessionsDir, 'latest.json');
      try {
        await fs.unlink(latestFile).catch(() => { });
        // On Windows, copy instead of symlink
        if (process.platform === 'win32') {
          await fs.copyFile(sessionFile, latestFile);
        } else {
          await fs.symlink(path.basename(sessionFile), latestFile);
        }
      } catch (error) {
        // Ignore symlink errors
      }
    } catch (error) {
      console.error(`Warning: Could not save session: ${error.message}`);
    }

    // Reset session state
    this.sessionId = null;
    this.sessionStartTime = null;
    this.sessionMessages = [];
    this.sessionToolCalls = [];
    this.sessionChanges = [];
    this.sessionErrors = [];
  }

  /**
   * Log a message in the conversation
   */
  async logMessage(role, content, toolCalls = null) {
    if (!this.enabled || !this.sessionId) {
      return;
    }

    const message = {
      timestamp: new Date().toISOString(),
      role,
      content: typeof content === 'string' ? content : JSON.stringify(content)
    };

    if (toolCalls) {
      message.tool_calls = toolCalls;
    }

    this.sessionMessages.push(message);
  }

  /**
   * Log a tool call
   */
  async logToolCall(toolName, args, result, status, durationMs, error = null) {
    if (!this.enabled) {
      return;
    }

    const entry = {
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      tool: toolName,
      status,
      duration_ms: durationMs,
      args: this.sanitizeArgs(args),
      result_type: result?.type || null,
      error: error || null
    };

    // Add to session
    if (this.sessionId) {
      this.sessionToolCalls.push(entry);
    }

    // Append to tool-history.jsonl
    try {
      await fs.appendFile(this.toolHistoryFile, JSON.stringify(entry) + '\n', 'utf8');
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Log a file change
   */
  async logChange(changeType, filePath, details = {}) {
    if (!this.enabled) {
      return;
    }

    const entry = {
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      type: changeType,
      path: filePath,
      ...details
    };

    // Add to session
    if (this.sessionId) {
      this.sessionChanges.push(entry);
    }

    // Append to changes.jsonl
    try {
      await fs.appendFile(this.changesFile, JSON.stringify(entry) + '\n', 'utf8');
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Log an error
   */
  async logError(error, context = {}) {
    if (!this.enabled) {
      return;
    }

    const errorEntry = {
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      message: error.message || String(error),
      stack: error.stack || null,
      context
    };

    // Add to session
    if (this.sessionId) {
      this.sessionErrors.push(errorEntry);
    }

    // Append to errors.log
    try {
      const logLine = `[${errorEntry.timestamp}] ${errorEntry.message}\n${errorEntry.stack || ''}\n\n`;
      await fs.appendFile(this.errorsFile, logLine, 'utf8');
    } catch (err) {
      // Silently fail
    }
  }

  /**
   * Clean up old log files
   */
  async cleanupOldLogs() {
    if (!this.enabled) {
      return;
    }

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

      // Clean up old session files
      const sessionFiles = await fs.readdir(this.sessionsDir);
      for (const file of sessionFiles) {
        if (file === 'latest.json' || !file.endsWith('.json')) {
          continue;
        }

        const filePath = path.join(this.sessionsDir, file);
        const stats = await fs.stat(filePath);

        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
        }
      }
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Clear all logs
   */
  async clearAllLogs() {
    if (!this.enabled) {
      return { deleted: 0 };
    }

    let deleted = 0;

    try {
      // Delete all session files
      const sessionFiles = await fs.readdir(this.sessionsDir);
      for (const file of sessionFiles) {
        await fs.unlink(path.join(this.sessionsDir, file));
        deleted++;
      }

      // Delete JSONL files
      await fs.unlink(this.toolHistoryFile).catch(() => { });
      await fs.unlink(this.changesFile).catch(() => { });
      await fs.unlink(this.errorsFile).catch(() => { });
      deleted += 3;
    } catch (error) {
      // Silently fail
    }

    return { deleted };
  }

  /**
   * Get log statistics
   */
  async getStats() {
    if (!this.enabled) {
      return null;
    }

    try {
      const sessionFiles = await fs.readdir(this.sessionsDir);
      const sessionCount = sessionFiles.filter(f => f.endsWith('.json') && f !== 'latest.json').length;

      const stats = {
        sessions: sessionCount,
        log_dir: this.logDirPath,
        enabled: this.enabled
      };

      // Get file sizes
      try {
        const toolHistoryStats = await fs.stat(this.toolHistoryFile);
        stats.tool_history_size = toolHistoryStats.size;
      } catch (e) {
        stats.tool_history_size = 0;
      }

      try {
        const changesStats = await fs.stat(this.changesFile);
        stats.changes_size = changesStats.size;
      } catch (e) {
        stats.changes_size = 0;
      }

      return stats;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate a unique session ID
   */
  generateSessionId() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    return `${date}_${time}`;
  }

  /**
   * Sanitize arguments for logging (remove sensitive data)
   */
  sanitizeArgs(args) {
    if (!args || typeof args !== 'object') {
      return args;
    }

    const sanitized = { ...args };

    // Truncate large content fields
    if (sanitized.content && typeof sanitized.content === 'string' && sanitized.content.length > 500) {
      sanitized.content = sanitized.content.substring(0, 500) + '... (truncated)';
    }

    return sanitized;
  }
}

module.exports = Logger;


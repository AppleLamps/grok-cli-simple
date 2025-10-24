const axios = require('axios');

class APIClient {
  constructor(apiKey, model, baseURL = 'https://openrouter.ai/api/v1') {
    this.apiKey = apiKey;
    this.model = model;
    this.baseURL = baseURL;
  }

  /**
   * Make a request to OpenRouter API with native tool calling support
   * @param {Array} messages - Array of message objects
   * @param {Object} options - Request options
   * @param {number} options.temperature - Temperature (0-2). Use 0.2 for tool calls, 0.7 for conversation
   * @param {Array} options.tools - OpenAI-compatible tool schemas
   * @param {string|Object} options.tool_choice - Tool selection: 'auto', 'none', or {type: 'function', function: {name: '...'}}
   * @param {Object} options.response_format - Response format: {type: 'json_object'} or {type: 'json_schema', json_schema: {...}}
   * @param {number} options.max_tokens - Maximum tokens to generate
   * @returns {Promise<Object>} Complete message object (not just content string)
   */
  async makeRequest(messages, options = {}) {
    const {
      temperature = 0.7,
      tools = null,
      tool_choice = 'auto',
      response_format = null,
      max_tokens = 2000,
      maxRetries = 3
    } = options;

    return this._makeRequestWithRetry(messages, {
      temperature,
      tools,
      tool_choice,
      response_format,
      max_tokens
    }, maxRetries);
  }

  async _makeRequestWithRetry(messages, options, attemptsRemaining) {
    try {
      // Build request payload
      const payload = {
        model: this.model,
        messages,
        temperature: options.temperature,
        max_tokens: options.max_tokens
      };

      // Add native tool calling parameters if tools provided
      if (options.tools && Array.isArray(options.tools) && options.tools.length > 0) {
        payload.tools = options.tools;
        payload.tool_choice = options.tool_choice;
      }

      // Add response format if specified
      if (options.response_format) {
        payload.response_format = options.response_format;
      }

      const response = await axios.post(`${this.baseURL}/chat/completions`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lampcode.dev',
          'X-Title': 'LampCode CLI'
        },
        timeout: 30000 // 30 second timeout
      });

      // Return the complete message object for tool_calls support
      return response.data.choices[0].message;
    } catch (error) {
      // Non-retryable errors
      if (error.response?.status === 401) {
        throw new Error('Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY.');
      }

      // Retryable errors: 408 (timeout), 429 (rate limit), 5xx (server errors), network errors
      const isRetryable = 
        error.response?.status === 408 ||
        error.response?.status === 429 ||
        (error.response?.status >= 500 && error.response?.status < 600) ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT';

      if (isRetryable && attemptsRemaining > 0) {
        // Exponential backoff with jitter: base delay + random jitter
        const baseDelayMs = Math.pow(2, 3 - attemptsRemaining) * 1000;
        const jitterMs = Math.random() * 250; // Random jitter up to 250ms
        const delayMs = baseDelayMs + jitterMs;
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return this._makeRequestWithRetry(messages, options, attemptsRemaining - 1);
      }

      // Final error handling
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response?.data?.error) {
        // OpenRouter API error with details
        const apiError = error.response.data.error;
        throw new Error(`API Error: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        throw new Error(`API request failed: ${error.message}`);
      }
    }
  }
}

module.exports = APIClient;

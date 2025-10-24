const axios = require('axios');

class APIClient {
  constructor(apiKey, model, baseURL = 'https://openrouter.ai/api/v1') {
    this.apiKey = apiKey;
    this.model = model;
    this.baseURL = baseURL;
  }

  async makeRequest(messages) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not found. Please set OPENROUTER_API_KEY environment variable.');
    }

    console.log('Thinking...');

    try {
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lampcode.dev',
          'X-Title': 'LampCode CLI'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`API request failed: ${error.message}`);
      }
    }
  }
}

module.exports = APIClient;

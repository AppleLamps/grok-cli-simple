/**
 * Simple token estimation for conversation history management
 * Uses a rough approximation: ~4 characters per token (OpenAI's typical ratio)
 */

/**
 * Estimate token count for a string
 * @param {string} text - Text to estimate
 * @returns {number} Estimated token count
 */
function estimateTokens(text) {
  if (typeof text !== 'string') {
    return 0;
  }
  // Rough approximation: 4 chars per token
  return Math.ceil(text.length / 4);
}

/**
 * Estimate total tokens for conversation history
 * @param {Array} messages - Array of message objects with 'content' property
 * @returns {number} Estimated total token count
 */
function estimateHistoryTokens(messages) {
  if (!Array.isArray(messages)) {
    return 0;
  }

  let totalTokens = 0;
  messages.forEach(msg => {
    if (msg && msg.content) {
      totalTokens += estimateTokens(msg.content);
    }
  });

  return totalTokens;
}

module.exports = {
  estimateTokens,
  estimateHistoryTokens
};

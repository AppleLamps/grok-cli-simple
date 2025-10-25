const { estimateTokens } = require('../utils/tokenEstimator');

// Model pricing data (per 1K tokens) - based on OpenRouter pricing
const MODEL_PRICING = {
  'x-ai/grok-code-fast-1': { input: 0.0001, output: 0.0001 },
  'anthropic/claude-3.5-sonnet': { input: 0.003, output: 0.015 },
  'openai/gpt-4': { input: 0.03, output: 0.06 },
  'openai/gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'google/gemini-2.5-pro': { input: 0.00125, output: 0.005 },
  'google/gemini-2.5-flash': { input: 0.000075, output: 0.0003 },
  'deepseek/deepseek-chat': { input: 0.00014, output: 0.00028 },
  // Default for unknown models
  'default': { input: 0.001, output: 0.002 }
};

async function estimateCommand(input, context) {
  // Parse command: estimate cost "<prompt text>"
  // OR: estimate cost (then use current context)
  const parts = input.slice(13).trim(); // Remove "estimate cost"

  let promptText = '';
  let useCurrentContext = false;

  if (parts.length === 0) {
    // No prompt provided, estimate for current conversation context
    useCurrentContext = true;
  } else {
    // Extract prompt text (handle quoted strings)
    const quotedMatch = parts.match(/^["'](.*)["']$/);
    if (quotedMatch) {
      promptText = quotedMatch[1];
    } else {
      promptText = parts;
    }
  }

  try {
    // Get current model from context
    const currentModel = process.env.OPENROUTER_MODEL || 'x-ai/grok-code-fast-1';
    const pricing = MODEL_PRICING[currentModel] || MODEL_PRICING['default'];

    let inputTokens = 0;

    if (useCurrentContext) {
      // Estimate based on current conversation context
      console.log('');
      context.ui.header('Estimating Cost for Current Context', '📊');
      context.ui.divider();

      // Estimate system prompt
      const systemPromptTokens = estimateTokens(context.systemPrompt);
      inputTokens += systemPromptTokens;

      // Estimate project files context
      if (context.projectFiles && Array.isArray(context.projectFiles)) {
        context.projectFiles.forEach(file => {
          if (file && file.content) {
            inputTokens += estimateTokens(file.content);
          }
        });
      }

      console.log(`   System prompt: ~${systemPromptTokens.toLocaleString()} tokens`);
      console.log(`   Project context: ~${(inputTokens - systemPromptTokens).toLocaleString()} tokens`);
      console.log('');
    } else {
      // Estimate based on provided prompt
      console.log('');
      context.ui.header('Estimating Cost for Prompt', '📊');
      context.ui.divider();
      inputTokens = estimateTokens(promptText);
      console.log(`   Prompt: "${promptText.substring(0, 60)}${promptText.length > 60 ? '...' : ''}"`);
      console.log('');
    }

    // Estimate output tokens (assume 500 or 0.5x input, whichever is larger)
    const estimatedOutputTokens = Math.max(500, Math.floor(inputTokens * 0.5));

    // Calculate costs
    const inputCost = (inputTokens / 1000) * pricing.input;
    const outputCost = (estimatedOutputTokens / 1000) * pricing.output;
    const totalCost = inputCost + outputCost;

    // Display formatted output
    context.ui.divider();
    console.log(`   Model: ${currentModel}`);
    console.log('');
    console.log(`   Input tokens:      ~${inputTokens.toLocaleString()} ($${inputCost.toFixed(6)})`);
    console.log(`   Estimated output:  ~${estimatedOutputTokens.toLocaleString()} ($${outputCost.toFixed(6)})`);
    console.log('');
    console.log(`   Total estimate:    ~$${totalCost.toFixed(6)}`);
    console.log('');
    context.ui.divider();
    context.ui.info('Note: Actual cost may vary based on:');
    console.log('   • Actual output length (estimated at 50% of input or 500 tokens minimum)');
    console.log('   • Prompt caching (can reduce costs by 50-90%)');
    console.log('   • Model-specific tokenization differences');
    console.log('');

  } catch (error) {
    context.ui.error(`Error estimating cost: ${error.message}`);
  }
}

module.exports = estimateCommand;


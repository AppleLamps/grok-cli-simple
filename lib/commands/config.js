const UI = require('../utils/ui');

async function configCommand(input, context) {
  const ui = new UI(70);
  
  // Parse subcommand
  const parts = input.slice(7).trim().split(/\s+/); // Remove "config "
  const subcommand = parts[0] || '';
  
  if (!subcommand) {
    // Display current configuration
    displayCurrentConfig(context, ui);
    return;
  }

  if (subcommand === 'list' && parts[1] === 'models') {
    // List all available models
    displayAvailableModels(context, ui);
    return;
  }

  if (subcommand === 'set' && parts[1] === 'model' && parts[2]) {
    // Set model for current session
    const modelName = parts.slice(2).join(' ');
    try {
      context.setModel(modelName);
      ui.success(`Model changed to: ${modelName}`);
      console.log('');
      console.log('   Note: This change is for the current session only.');
      console.log('   To make it permanent, update OPENROUTER_MODEL in your .env file.');
      console.log('');
    } catch (error) {
      ui.error(error.message);
      console.log('');
      console.log('   Use "config list models" to see available models.');
      console.log('');
    }
    return;
  }

  // Invalid subcommand
  console.log('');
  console.log('Usage:');
  console.log('  config                  Display current configuration');
  console.log('  config list models      List all available models');
  console.log('  config set model <name> Change model for current session');
  console.log('');
}

function displayCurrentConfig(context, ui) {
  const modelConfig = context.getModelConfig();
  const apiKeyStatus = process.env.OPENROUTER_API_KEY ? '✓ Set' : '✗ Not set';
  
  console.log('');
  ui.header('Current Configuration', '⚙️');
  console.log('');
  
  console.log('  Model:');
  console.log(`    ${context.currentModel}`);
  console.log('');
  
  console.log('  Model Capabilities:');
  console.log(`    Max Input Tokens:  ${modelConfig.maxInputTokens.toLocaleString()}`);
  console.log(`    Max Output Tokens: ${modelConfig.maxOutputTokens.toLocaleString()}`);
  console.log(`    Prompt Caching:    ${modelConfig.supportsPromptCaching ? '✓ Supported' : '✗ Not supported'}`);
  if (modelConfig.supportsPromptCaching) {
    console.log(`    Caching Type:      ${modelConfig.autoCaching ? 'Automatic' : 'Manual (cache_control)'}`);
  }
  console.log('');
  
  console.log('  API Configuration:');
  console.log(`    API Key:           ${apiKeyStatus}`);
  console.log(`    Working Directory: ${context.workingDirectory}`);
  console.log('');
  
  console.log('  Project Context:');
  console.log(`    Files Loaded:      ${context.projectFiles?.length || 0}`);
  console.log('');
}

function displayAvailableModels(context, ui) {
  const models = context.getAvailableModels();
  const currentModel = context.currentModel;
  
  console.log('');
  ui.header('Available Models', '🤖');
  console.log('');
  
  models.forEach(modelName => {
    const config = context.getModelConfig.call({ model: modelName, getModelConfig: context.getModelConfig });
    const isCurrent = modelName === currentModel;
    const marker = isCurrent ? '→ ' : '  ';
    
    console.log(`${marker}${modelName}`);
    console.log(`    Max Tokens: ${config.maxInputTokens?.toLocaleString() || 'N/A'} input / ${config.maxOutputTokens?.toLocaleString() || 'N/A'} output`);
    console.log(`    Caching: ${config.supportsPromptCaching ? (config.autoCaching ? 'Auto' : 'Manual') : 'None'}`);
    console.log('');
  });
  
  console.log('  To change model: config set model <model_name>');
  console.log('');
}

module.exports = configCommand;


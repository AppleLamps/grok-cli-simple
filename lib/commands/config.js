async function configCommand(input, context) {
  // Parse subcommand
  const parts = input.slice(7).trim().split(/\s+/); // Remove "config "
  const subcommand = parts[0] || '';

  if (!subcommand) {
    // Display current configuration
    displayCurrentConfig(context);
    return;
  }

  if (subcommand === 'list' && parts[1] === 'models') {
    // List all available models
    displayAvailableModels(context);
    return;
  }

  if (subcommand === 'set' && parts[1] === 'model' && parts[2]) {
    // Set model for current session
    const modelName = parts.slice(2).join(' ');
    try {
      context.setModel(modelName);
      context.ui.success(`Model changed to: ${modelName}`);
      console.log('');
      context.ui.info('Note: This change is for the current session only.');
      context.ui.info('To make it permanent, update OPENROUTER_MODEL in your .env file.');
      console.log('');
    } catch (error) {
      context.ui.error(error.message);
      console.log('');
      context.ui.info('Use "config list models" to see available models.');
      console.log('');
    }
    return;
  }

  // Invalid subcommand
  console.log('');
  context.ui.info('Usage:');
  console.log('  config                  Display current configuration');
  console.log('  config list models      List all available models');
  console.log('  config set model <name> Change model for current session');
  console.log('');
}

function displayCurrentConfig(context) {
  const modelConfig = context.getModelConfig();
  const apiKeyStatus = process.env.OPENROUTER_API_KEY ? '✓ Set' : '✗ Not set';

  console.log('');
  context.ui.header('Current Configuration', '⚙️');
  context.ui.divider();

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
  context.ui.divider();
}

function displayAvailableModels(context) {
  const models = context.getAvailableModels();
  const currentModel = context.currentModel;

  console.log('');
  context.ui.header('Available Models', '🤖');
  context.ui.divider();

  models.forEach(modelName => {
    const config = context.getModelConfig.call({ model: modelName, getModelConfig: context.getModelConfig });
    const isCurrent = modelName === currentModel;
    const marker = isCurrent ? '→ ' : '  ';

    console.log(`${marker}${modelName}`);
    console.log(`    Max Tokens: ${config.maxInputTokens?.toLocaleString() || 'N/A'} input / ${config.maxOutputTokens?.toLocaleString() || 'N/A'} output`);
    console.log(`    Caching: ${config.supportsPromptCaching ? (config.autoCaching ? 'Auto' : 'Manual') : 'None'}`);
    console.log('');
  });

  context.ui.divider();
  context.ui.info('To change model: config set model <model_name>');
  console.log('');
}

module.exports = configCommand;


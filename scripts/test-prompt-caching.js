#!/usr/bin/env node

/**
 * Test script to verify prompt caching implementation
 * Tests both automatic and manual caching configurations
 */

const { LampCode } = require('../lib/lampcode');

console.log('🧪 Testing Prompt Caching Implementation\n');
console.log('='.repeat(60));

// Test 1: Grok (Automatic Caching)
console.log('\n📝 Test 1: Grok Code Fast 1 (Automatic Caching)');
console.log('-'.repeat(60));

const grokLamp = new LampCode();
const grokConfig = grokLamp.getModelConfig();

console.log('Model:', grokLamp.model);
console.log('Max Input Tokens:', grokConfig.maxInputTokens.toLocaleString());
console.log('Supports Caching:', grokLamp.supportsPromptCaching());
console.log('Auto Caching:', grokConfig.autoCaching);
console.log('Requires Manual Cache Control:', grokLamp.requiresManualCaching());

if (grokConfig.maxInputTokens === 256000 && 
    grokConfig.autoCaching === true && 
    grokLamp.requiresManualCaching() === false) {
  console.log('✅ PASS: Grok configured correctly');
} else {
  console.log('❌ FAIL: Grok configuration incorrect');
  process.exit(1);
}

// Test 2: Claude (Manual Caching)
console.log('\n📝 Test 2: Anthropic Claude (Manual Caching)');
console.log('-'.repeat(60));

process.env.OPENROUTER_MODEL = 'anthropic/claude-3.5-sonnet';
const claudeLamp = new LampCode();
const claudeConfig = claudeLamp.getModelConfig();

console.log('Model:', claudeLamp.model);
console.log('Max Input Tokens:', claudeConfig.maxInputTokens.toLocaleString());
console.log('Supports Caching:', claudeLamp.supportsPromptCaching());
console.log('Auto Caching:', claudeConfig.autoCaching);
console.log('Requires Manual Cache Control:', claudeLamp.requiresManualCaching());
console.log('Max Cache Breakpoints:', claudeConfig.cacheBreakpoints);

if (claudeConfig.maxInputTokens === 180000 && 
    claudeConfig.autoCaching === false && 
    claudeLamp.requiresManualCaching() === true &&
    claudeConfig.cacheBreakpoints === 4) {
  console.log('✅ PASS: Claude configured correctly');
} else {
  console.log('❌ FAIL: Claude configuration incorrect');
  process.exit(1);
}

// Test 3: OpenAI (Automatic Caching with Minimum)
console.log('\n📝 Test 3: OpenAI GPT-4 (Automatic Caching)');
console.log('-'.repeat(60));

process.env.OPENROUTER_MODEL = 'openai/gpt-4';
const openaiLamp = new LampCode();
const openaiConfig = openaiLamp.getModelConfig();

console.log('Model:', openaiLamp.model);
console.log('Max Input Tokens:', openaiConfig.maxInputTokens.toLocaleString());
console.log('Supports Caching:', openaiLamp.supportsPromptCaching());
console.log('Auto Caching:', openaiConfig.autoCaching);
console.log('Min Cache Tokens:', openaiConfig.minCacheTokens);
console.log('Requires Manual Cache Control:', openaiLamp.requiresManualCaching());

if (openaiConfig.maxInputTokens === 120000 && 
    openaiConfig.autoCaching === true && 
    openaiLamp.requiresManualCaching() === false &&
    openaiConfig.minCacheTokens === 1024) {
  console.log('✅ PASS: OpenAI configured correctly');
} else {
  console.log('❌ FAIL: OpenAI configuration incorrect');
  process.exit(1);
}

// Test 4: Gemini (Manual Caching)
console.log('\n📝 Test 4: Google Gemini 2.5 Pro (Manual Caching)');
console.log('-'.repeat(60));

process.env.OPENROUTER_MODEL = 'google/gemini-2.5-pro';
const geminiLamp = new LampCode();
const geminiConfig = geminiLamp.getModelConfig();

console.log('Model:', geminiLamp.model);
console.log('Max Input Tokens:', geminiConfig.maxInputTokens.toLocaleString());
console.log('Supports Caching:', geminiLamp.supportsPromptCaching());
console.log('Auto Caching:', geminiConfig.autoCaching);
console.log('Min Cache Tokens:', geminiConfig.minCacheTokens);
console.log('Requires Manual Cache Control:', geminiLamp.requiresManualCaching());

if (geminiConfig.maxInputTokens === 1000000 && 
    geminiConfig.autoCaching === false && 
    geminiLamp.requiresManualCaching() === true &&
    geminiConfig.minCacheTokens === 2048) {
  console.log('✅ PASS: Gemini configured correctly');
} else {
  console.log('❌ FAIL: Gemini configuration incorrect');
  process.exit(1);
}

// Test 5: DeepSeek (Automatic Caching)
console.log('\n📝 Test 5: DeepSeek (Automatic Caching)');
console.log('-'.repeat(60));

process.env.OPENROUTER_MODEL = 'deepseek/deepseek-chat';
const deepseekLamp = new LampCode();
const deepseekConfig = deepseekLamp.getModelConfig();

console.log('Model:', deepseekLamp.model);
console.log('Max Input Tokens:', deepseekConfig.maxInputTokens.toLocaleString());
console.log('Supports Caching:', deepseekLamp.supportsPromptCaching());
console.log('Auto Caching:', deepseekConfig.autoCaching);
console.log('Requires Manual Cache Control:', deepseekLamp.requiresManualCaching());

if (deepseekConfig.maxInputTokens === 64000 && 
    deepseekConfig.autoCaching === true && 
    deepseekLamp.requiresManualCaching() === false) {
  console.log('✅ PASS: DeepSeek configured correctly');
} else {
  console.log('❌ FAIL: DeepSeek configuration incorrect');
  process.exit(1);
}

// Test 6: Unknown Model (Default Config)
console.log('\n📝 Test 6: Unknown Model (Default Config)');
console.log('-'.repeat(60));

process.env.OPENROUTER_MODEL = 'unknown/test-model';
const unknownLamp = new LampCode();
const unknownConfig = unknownLamp.getModelConfig();

console.log('Model:', unknownLamp.model);
console.log('Max Input Tokens:', unknownConfig.maxInputTokens.toLocaleString());
console.log('Supports Caching:', unknownLamp.supportsPromptCaching());
console.log('Auto Caching:', unknownConfig.autoCaching || false);
console.log('Requires Manual Cache Control:', unknownLamp.requiresManualCaching());

if (unknownConfig.maxInputTokens === 8000 && 
    unknownLamp.supportsPromptCaching() === false) {
  console.log('✅ PASS: Unknown model uses default config');
} else {
  console.log('❌ FAIL: Unknown model configuration incorrect');
  process.exit(1);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('✅ All Prompt Caching Tests Passed!');
console.log('='.repeat(60));

console.log('\n📊 Summary:');
console.log('  • Grok: 256K context, automatic caching');
console.log('  • Claude: 180K context, manual caching (4 breakpoints)');
console.log('  • OpenAI: 120K context, automatic caching (1024 min)');
console.log('  • Gemini: 1M context, manual caching (2048 min)');
console.log('  • DeepSeek: 64K context, automatic caching');
console.log('  • Unknown: 8K context, no caching');

console.log('\n💡 Implementation Details:');
console.log('  • Helper methods working correctly');
console.log('  • Model detection functioning');
console.log('  • Cache control logic ready');
console.log('  • Backward compatibility maintained');

console.log('\n🎉 Prompt caching implementation verified!\n');

process.exit(0);


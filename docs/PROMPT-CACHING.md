# Prompt Caching in LampCode

## Overview

LampCode v1.3.0+ includes intelligent prompt caching support to reduce costs and improve response times. Prompt caching allows frequently-used content (like system prompts and project context) to be reused across multiple API calls, significantly reducing input token costs.

## How It Works

### Automatic Caching Models

These models automatically cache prompts without any configuration:

- **Grok (x-ai/grok-code-fast-1)** - Default model
  - 256K context window
  - Automatic caching enabled
  - No cache write fees
  - Reduced cost on cache reads
  
- **OpenAI (GPT-4, GPT-3.5)**
  - Automatic caching for prompts > 1024 tokens
  - Cache reads at 0.25x-0.5x cost (50-75% savings)
  - No cache write fees

- **DeepSeek**
  - Automatic caching enabled
  - Cache reads at 0.1x cost (90% savings)
  - Cache writes at normal input pricing

### Manual Caching Models

LampCode automatically inserts `cache_control` breakpoints for these models:

- **Anthropic Claude (3.5 Sonnet, Opus, Haiku)**
  - Cache writes at 1.25x cost
  - Cache reads at 0.1x cost (90% savings)
  - Maximum 4 cache breakpoints
  - 5-minute cache TTL

- **Google Gemini (2.5 Pro, 2.5 Flash)**
  - Cache writes include 5-minute storage cost
  - Cache reads at 0.25x cost (75% savings)
  - Minimum tokens: 2048 (Pro), 1028 (Flash)
  - 5-minute cache TTL

## What Gets Cached

LampCode automatically optimizes caching for:

1. **System Prompt** - Your AI instructions (cached separately)
2. **Project Context** - File contents and code snippets (cached separately)
3. **Conversation History** - Recent messages (included in requests)

### Cache Structure

For **automatic caching models** (Grok, OpenAI, DeepSeek):
```javascript
{
  role: 'system',
  content: 'System prompt + project context'
}
```

For **manual caching models** (Claude, Gemini):
```javascript
{
  role: 'system',
  content: [
    {
      type: 'text',
      text: 'System prompt',
      cache_control: { type: 'ephemeral' }
    },
    {
      type: 'text',
      text: 'Project context',
      cache_control: { type: 'ephemeral' }
    }
  ]
}
```

## Cost Savings Examples

### Example 1: Grok (Default Model)

**Scenario:** 10-message conversation with 5K token system prompt + context

- **Without Caching:**
  - 10 requests × 5K tokens = 50K input tokens
  - Cost: 50K tokens at full price

- **With Caching:**
  - First request: 5K tokens (cache write, no extra cost)
  - Next 9 requests: 5K tokens cached (reduced cost)
  - Savings: ~40-60% on input tokens

### Example 2: Claude 3.5 Sonnet

**Scenario:** 20-message conversation with 10K token system prompt + context

- **Without Caching:**
  - 20 requests × 10K tokens = 200K input tokens
  - Cost: 200K tokens at $3/M = $0.60

- **With Caching:**
  - First request: 10K tokens × 1.25 = 12.5K tokens (cache write)
  - Next 19 requests: 10K tokens × 0.1 = 1K tokens each (cache read)
  - Total: 12.5K + (19 × 1K) = 31.5K tokens
  - Cost: 31.5K tokens at $3/M = $0.09
  - **Savings: $0.51 (85%)**

### Example 3: OpenAI GPT-4

**Scenario:** 15-message conversation with 8K token system prompt + context

- **Without Caching:**
  - 15 requests × 8K tokens = 120K input tokens
  - Cost: 120K tokens at $2.50/M = $0.30

- **With Caching:**
  - First request: 8K tokens (cache write, no extra cost)
  - Next 14 requests: 8K tokens × 0.5 = 4K tokens each (cache read)
  - Total: 8K + (14 × 4K) = 64K tokens
  - Cost: 64K tokens at $2.50/M = $0.16
  - **Savings: $0.14 (47%)**

## Best Practices

### 1. Keep Conversations Going

Caches expire after a few minutes (typically 5 minutes). To maximize savings:
- Continue conversations instead of starting new sessions
- Ask follow-up questions in the same session
- Avoid long pauses between messages

### 2. Use Large Codebases

Caching benefits increase with larger context:
- Projects with many files benefit most
- Large system prompts are cached efficiently
- Repeated file reads are optimized

### 3. Choose the Right Model

For cost optimization:
- **Grok**: Best for frequent, long conversations (256K context, automatic caching)
- **Claude**: Best for complex reasoning with large context (90% cache savings)
- **GPT-4**: Good balance of quality and caching (50% cache savings)

### 4. Monitor Cache Usage

Check cache effectiveness:
1. Visit [OpenRouter Activity](https://openrouter.ai/activity)
2. Click detail button on any generation
3. Look for `cache_discount` field
4. Positive discount = savings from caching

## Technical Implementation

### Model Configuration

LampCode uses `MODEL_CONFIGS` to define caching behavior:

```javascript
const MODEL_CONFIGS = {
  'x-ai/grok-code-fast-1': {
    maxInputTokens: 256000,
    supportsPromptCaching: true,
    autoCaching: true
  },
  'anthropic/claude-3.5-sonnet': {
    maxInputTokens: 180000,
    supportsPromptCaching: true,
    autoCaching: false,
    cacheBreakpoints: 4
  }
};
```

### Helper Methods

```javascript
// Check if model supports caching
lamp.supportsPromptCaching() // true/false

// Check if model needs manual cache_control
lamp.requiresManualCaching() // true for Claude/Gemini, false for Grok/OpenAI
```

### Message Building

The `buildBaseMessages()` method automatically:
1. Detects model caching capabilities
2. Formats system messages appropriately
3. Inserts `cache_control` breakpoints for manual caching models
4. Optimizes context placement for maximum cache hits

## Limitations

### Cache Expiration

- **Anthropic/Gemini**: 5-minute TTL (fixed)
- **OpenAI/Grok**: Variable TTL (typically 5-10 minutes)
- **DeepSeek**: Variable TTL

### Minimum Token Requirements

- **OpenAI**: 1024 tokens minimum for caching
- **Gemini 2.5 Pro**: 2048 tokens minimum
- **Gemini 2.5 Flash**: 1028 tokens minimum
- **Grok/Claude/DeepSeek**: No minimum

### Cache Breakpoint Limits

- **Anthropic Claude**: Maximum 4 breakpoints
- **Google Gemini**: No limit (only last breakpoint used)
- **Others**: N/A (automatic caching)

## Provider Routing

OpenRouter automatically routes requests to the same provider to maximize cache hits:
- First request establishes cache with a provider
- Subsequent requests prefer the same provider
- If provider unavailable, falls back to next-best option
- Cache may be lost on provider switch

## Troubleshooting

### Cache Not Working

**Symptoms:** No cost savings, full input token charges

**Solutions:**
1. Ensure model supports caching (check `MODEL_CONFIGS`)
2. Verify prompt is large enough (>1024 tokens for OpenAI)
3. Check cache hasn't expired (5-minute TTL)
4. Confirm OpenRouter routed to same provider

### Unexpected Cache Costs

**Symptoms:** Higher costs than expected

**Solutions:**
1. Check if using Claude (1.25x cache write cost)
2. Verify cache is being reused (check activity page)
3. Ensure conversations aren't too short (cache overhead)
4. Consider switching to auto-caching model (Grok/OpenAI)

### Cache Misses

**Symptoms:** Cache not reused between requests

**Solutions:**
1. Keep system prompt consistent
2. Avoid modifying project context frequently
3. Continue conversations instead of restarting
4. Check provider routing (may have switched providers)

## Future Enhancements

Planned improvements for prompt caching:

- [ ] Cache usage statistics in CLI
- [ ] Configurable cache TTL (when supported by providers)
- [ ] Cache warming for frequently-used contexts
- [ ] Per-file caching for large codebases
- [ ] Cache hit/miss reporting in tool history

## References

- [OpenRouter Prompt Caching Docs](https://openrouter.ai/docs/features/prompt-caching)
- [Anthropic Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [OpenAI Prompt Caching](https://platform.openai.com/docs/guides/prompt-caching)
- [Google Gemini Caching](https://ai.google.dev/gemini-api/docs/caching)


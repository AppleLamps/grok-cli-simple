---
url: "https://openrouter.ai/docs/use-cases/usage-accounting"
title: "Usage Accounting | Track AI Model Usage with OpenRouter | OpenRouter | Documentation"
---

The OpenRouter API provides built-in **Usage Accounting** that allows you to track AI model usage without making additional API calls. This feature provides detailed information about token counts, costs, and caching status directly in your API responses.

## Usage Information

When enabled, the API will return detailed usage information including:

1. Prompt and completion token counts using the model’s native tokenizer
2. Cost in credits
3. Reasoning token counts (if applicable)
4. Cached token counts (if available)

This information is included in the last SSE message for streaming responses, or in the complete response for non-streaming requests.

## Enabling Usage Accounting

You can enable usage accounting in your requests by including the `usage` parameter:

```code-block text-sm

```

## Response Format

When usage accounting is enabled, the response will include a `usage` object with detailed token information:

```code-block text-sm

```

`cached_tokens` is the number of tokens that were _read_ from the cache. At this point in time, we do not support retrieving the number of tokens that were _written_ to the cache.

## Cost Breakdown

The usage response includes detailed cost information:

- `cost`: The total amount charged to your account
- `cost_details.upstream_inference_cost`: The actual cost charged by the upstream AI provider

**Note:** The `upstream_inference_cost` field only applies to BYOK (Bring Your Own Key) requests.

##### Performance Impact

Enabling usage accounting will add a few hundred milliseconds to the last
response as the API calculates token counts and costs. This only affects the
final message and does not impact overall streaming performance.

## Benefits

1. **Efficiency**: Get usage information without making separate API calls
2. **Accuracy**: Token counts are calculated using the model’s native tokenizer
3. **Transparency**: Track costs and cached token usage in real-time
4. **Detailed Breakdown**: Separate counts for prompt, completion, reasoning, and cached tokens

## Best Practices

1. Enable usage tracking when you need to monitor token consumption or costs
2. Account for the slight delay in the final response when usage accounting is enabled
3. Consider implementing usage tracking in development to optimize token usage before production
4. Use the cached token information to optimize your application’s performance

## Alternative: Getting Usage via Generation ID

You can also retrieve usage information asynchronously by using the generation ID returned from your API calls. This is particularly useful when you want to fetch usage statistics after the completion has finished or when you need to audit historical usage.

To use this method:

1. Make your chat completion request as normal
2. Note the `id` field in the response
3. Use that ID to fetch usage information via the `/generation` endpoint

For more details on this approach, see the [Get a Generation](https://openrouter.ai/docs/api-reference/get-a-generation) documentation.

## Examples

### Basic Usage with Token Tracking

PythonTypeScript

```code-block text-sm

```

### Streaming with Usage Information

This example shows how to handle usage information in streaming mode:

PythonTypeScript

```code-block text-sm

```

Ask AI

Assistant

Hi, I'm an AI assistant with access to documentation and other content.

Tip: you can toggle this pane with

`⌘`

+

`/`

Suggestions

How do I integrate OpenRouter with LangChain for Python applications?

What is prompt caching and how can I use it to reduce costs with OpenRouter?

How do I enable web search capabilities to ground my AI model responses with real-time information?

What file formats does OpenRouter support and how do I send PDF documents to models?

How do I implement streaming responses and structured outputs with OpenRouter's API?
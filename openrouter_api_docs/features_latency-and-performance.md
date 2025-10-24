---
url: "https://openrouter.ai/docs/features/latency-and-performance"
title: "Latency and Performance | Minimizing Gateway Latency | OpenRouter | Documentation"
---

OpenRouter is designed with performance as a top priority. OpenRouter is heavily optimized to add as little latency as possible to your requests.

## Base Latency

Under typical production conditions, OpenRouter adds approximately 40ms of latency to your requests. This minimal overhead is achieved through:

- Edge computing using Cloudflare Workers to stay as close as possible to your application
- Efficient caching of user and API key data at the edge
- Optimized routing logic that minimizes processing time

## Performance Considerations

### Cache Warming

When OpenRouter’s edge caches are cold (typically during the first 1-2 minutes of operation in a new region), you may experience slightly higher latency as the caches warm up. This normalizes once the caches are populated.

### Credit Balance Checks

To maintain accurate billing and prevent overages, OpenRouter performs additional database checks when:

- A user’s credit balance is low (single digit dollars)
- An API key is approaching its configured credit limit

OpenRouter expires caches more aggressively under these conditions to ensure proper billing, which increases latency until additional credits are added.

### Model Fallback

When using [model routing](https://openrouter.ai/docs/features/model-routing) or [provider routing](https://openrouter.ai/docs/features/provider-routing), if the primary model or provider fails, OpenRouter will automatically try the next option. A failed initial completion unsurprisingly adds latency to the specific request. OpenRouter tracks provider failures, and will attempt to intelligently route around unavailable providers so that this latency is not incurred on every request.

## Best Practices

To achieve optimal performance with OpenRouter:

1. **Maintain Healthy Credit Balance**
   - Set up auto-topup with a higher threshold and amount
   - This helps avoid forced credit checks and reduces the risk of hitting zero balance
   - Recommended minimum balance: $10-20 to ensure smooth operation
2. **Use Provider Preferences**
   - If you have specific latency requirements (whether time to first token, or time to last), there are [provider routing](https://openrouter.ai/docs/features/provider-routing) features to help you achieve your performance and cost goals.

Ask AI

Assistant

Hi, I'm an AI assistant with access to documentation and other content.

Tip: you can toggle this pane with

`⌘`

+

`/`

Suggestions

How do I set up prompt caching with OpenRouter to reduce costs across different providers like OpenAI and Anthropic?

What's the difference between using :online suffix and the web plugin for enabling web search in my model responses?

How can I send PDF documents to OpenRouter models using both URL and base64 encoding methods?

What provider routing options are available to optimize for cost, performance, or data privacy requirements?

How do I implement structured outputs with JSON Schema validation to get consistent, type-safe responses from models?
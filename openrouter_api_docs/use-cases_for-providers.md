---
url: "https://openrouter.ai/docs/use-cases/for-providers"
title: "Provider Integration | Add Your AI Models to OpenRouter | OpenRouter | Documentation"
---

## For Providers

If you’d like to be a model provider and sell inference on OpenRouter, [fill out our form](https://openrouter.ai/how-to-list) to get started.

To be eligible to provide inference on OpenRouter you must have the following:

### 1\. List Models Endpoint

You must implement an endpoint that returns all models that should be served by OpenRouter. At this endpoint, please return a list of all available models on your platform. Below is an example of the response format:

```code-block text-sm

```

NOTE: `pricing` fields are in string format to avoid floating point precision issues, and must be in USD.

Valid quantization values are: `int4`, `int8`, `fp4`, `fp6`, `fp8`, `fp16`, `bf16`, `fp32`.

Valid sampling parameters are: `temperature`, `top_p`, `top_k`, `repetition_penalty`, `frequency_penalty`, `presence_penalty`, `stop`, `seed`.

Valid features are: `tools`, `json_mode`, `structured_outputs`, `web_search`, `reasoning`.

### 2\. Auto Top Up or Invoicing

For OpenRouter to use the provider we must be able to pay for inference automatically. This can be done via auto top up or invoicing.

### 3\. Uptime Monitoring & Traffic Routing

OpenRouter automatically monitors provider reliability and adjusts traffic routing based on uptime metrics. Your endpoint’s uptime is calculated as: **successful requests ÷ total requests** (excluding user errors).

**Errors that affect your uptime:**

- Authentication issues (401)
- Payment failures (402)
- Model not found (404)
- All server errors (500+)
- Mid-stream errors
- Successful requests with error finish reasons

**Errors that DON’T affect uptime:**

- Bad requests (400) - user input errors
- Oversized payloads (413) - user input errors
- Rate limiting (429) - tracked separately
- Geographic restrictions (403) - tracked separately

**Traffic routing thresholds:**

- **Minimum data**: 100+ requests required before uptime calculation begins
- **Normal routing**: 95%+ uptime
- **Degraded status**: 80-94% uptime → receives lower priority
- **Down status**: <80% uptime → only used as fallback

This system ensures traffic automatically flows to the most reliable providers while giving temporary issues time to resolve.

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
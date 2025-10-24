---
url: "https://openrouter.ai/docs/api-reference/overview"
title: "OpenRouter API Reference | Complete API Documentation | OpenRouter | Documentation"
---

OpenRouter’s request and response schemas are very similar to the OpenAI Chat API, with a few small differences. At a high level, **OpenRouter normalizes the schema across models and providers** so you only need to learn one.

## Requests

### Completions Request Format

Here is the request schema as a TypeScript type. This will be the body of your `POST` request to the `/api/v1/chat/completions` endpoint (see the [quick start](https://openrouter.ai/docs/quick-start) above for an example).

For a complete list of parameters, see the [Parameters](https://openrouter.ai/docs/api-reference/parameters).

Request Schema

```code-block text-sm

```

The `response_format` parameter ensures you receive a structured response from the LLM. The parameter is only supported by OpenAI models, Nitro models, and some others - check the providers on the model page on openrouter.ai/models to see if it’s supported, and set `require_parameters` to true in your Provider Preferences. See [Provider Routing](https://openrouter.ai/docs/features/provider-routing)

### Headers

OpenRouter allows you to specify some optional headers to identify your app and make it discoverable to users on our site.

- `HTTP-Referer`: Identifies your app on openrouter.ai
- `X-Title`: Sets/modifies your app’s title

TypeScript

```code-block text-sm

```

##### Model routing

If the `model` parameter is omitted, the user or payer’s default is used.
Otherwise, remember to select a value for `model` from the [supported\\
models](https://openrouter.ai/models) or [API](https://openrouter.ai/api/v1/models), and include the organization
prefix. OpenRouter will select the least expensive and best GPUs available to
serve the request, and fall back to other providers or GPUs if it receives a
5xx response code or if you are rate-limited.

##### Streaming

[Server-Sent Events\\
(SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format)
are supported as well, to enable streaming _for all models_. Simply send
`stream: true` in your request body. The SSE stream will occasionally contain
a “comment” payload, which you should ignore (noted below).

##### Non-standard parameters

If the chosen model doesn’t support a request parameter (such as `logit_bias`
in non-OpenAI models, or `top_k` for OpenAI), then the parameter is ignored.
The rest are forwarded to the underlying model API.

### Assistant Prefill

OpenRouter supports asking models to complete a partial response. This can be useful for guiding models to respond in a certain way.

To use this features, simply include a message with `role: "assistant"` at the end of your `messages` array.

TypeScript

```code-block text-sm

```

## Responses

### CompletionsResponse Format

OpenRouter normalizes the schema across models and providers to comply with the [OpenAI Chat API](https://platform.openai.com/docs/api-reference/chat).

This means that `choices` is always an array, even if the model only returns one completion. Each choice will contain a `delta` property if a stream was requested and a `message` property otherwise. This makes it easier to use the same code for all models.

Here’s the response schema as a TypeScript type:

TypeScript

```code-block text-sm

```

```code-block text-sm

```

```code-block text-sm

```

Here’s an example:

```code-block text-sm

```

### Finish Reason

OpenRouter normalizes each model’s `finish_reason` to one of the following values: `tool_calls`, `stop`, `length`, `content_filter`, `error`.

Some models and providers may have additional finish reasons. The raw finish\_reason string returned by the model is available via the `native_finish_reason` property.

### Querying Cost and Stats

The token counts that are returned in the completions API response are **not** counted via the model’s native tokenizer. Instead it uses a normalized, model-agnostic count (accomplished via the GPT4o tokenizer). This is because some providers do not reliably return native token counts. This behavior is becoming more rare, however, and we may add native token counts to the response object in the future.

Credit usage and model pricing are based on the **native** token counts (not the ‘normalized’ token counts returned in the API response).

For precise token accounting using the model’s native tokenizer, you can retrieve the full generation information via the `/api/v1/generation` endpoint.

You can use the returned `id` to query for the generation stats (including token counts and cost) after the request is complete. This is how you can get the cost and tokens for _all models and requests_, streaming and non-streaming.

Query Generation Stats

```code-block text-sm

```

Please see the [Generation](https://openrouter.ai/docs/api-reference/get-a-generation) API reference for the full response shape.

Note that token counts are also available in the `usage` field of the response body for non-streaming completions.

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
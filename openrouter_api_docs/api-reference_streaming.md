---
url: "https://openrouter.ai/docs/api-reference/streaming"
title: "API Streaming | Real-time Model Responses in OpenRouter | OpenRouter | Documentation"
---

The OpenRouter API allows streaming responses from _any model_. This is useful for building chat interfaces or other applications where the UI should update as the model generates the response.

To enable streaming, you can set the `stream` parameter to `true` in your request. The model will then stream the response to the client in chunks, rather than returning the entire response at once.

Here is an example of how to stream a response, and process it:

PythonTypeScript

```code-block text-sm

```

### Additional Information

For SSE (Server-Sent Events) streams, OpenRouter occasionally sends comments to prevent connection timeouts. These comments look like:

```code-block text-sm

```

Comment payload can be safely ignored per the [SSE specs](https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation). However, you can leverage it to improve UX as needed, e.g. by showing a dynamic loading indicator.

Some SSE client implementations might not parse the payload according to spec, which leads to an uncaught error when you `JSON.stringify` the non-JSON payloads. We recommend the following clients:

- [eventsource-parser](https://github.com/rexxars/eventsource-parser)
- [OpenAI SDK](https://www.npmjs.com/package/openai)
- [Vercel AI SDK](https://www.npmjs.com/package/ai)

### Stream Cancellation

Streaming requests can be cancelled by aborting the connection. For supported providers, this immediately stops model processing and billing.

###### Provider Support

**Supported**

- OpenAI, Azure, Anthropic
- Fireworks, Mancer, Recursal
- AnyScale, Lepton, OctoAI
- Novita, DeepInfra, Together
- Cohere, Hyperbolic, Infermatic
- Avian, XAI, Cloudflare
- SFCompute, Nineteen, Liquid
- Friendli, Chutes, DeepSeek

**Not Currently Supported**

- AWS Bedrock, Groq, Modal
- Google, Google AI Studio, Minimax
- HuggingFace, Replicate, Perplexity
- Mistral, AI21, Featherless
- Lynn, Lambda, Reflection
- SambaNova, Inflection, ZeroOneAI
- AionLabs, Alibaba, Nebius
- Kluster, Targon, InferenceNet

To implement stream cancellation:

PythonTypeScript

```code-block text-sm

```

Cancellation only works for streaming requests with supported providers. For
non-streaming requests or unsupported providers, the model will continue
processing and you will be billed for the complete response.

### Handling Errors During Streaming

OpenRouter handles errors differently depending on when they occur during the streaming process:

#### Errors Before Any Tokens Are Sent

If an error occurs before any tokens have been streamed to the client, OpenRouter returns a standard JSON error response with the appropriate HTTP status code. This follows the standard error format:

```code-block text-sm

```

Common HTTP status codes include:

- **400**: Bad Request (invalid parameters)
- **401**: Unauthorized (invalid API key)
- **402**: Payment Required (insufficient credits)
- **429**: Too Many Requests (rate limited)
- **502**: Bad Gateway (provider error)
- **503**: Service Unavailable (no available providers)

#### Errors After Tokens Have Been Sent (Mid-Stream)

If an error occurs after some tokens have already been streamed to the client, OpenRouter cannot change the HTTP status code (which is already 200 OK). Instead, the error is sent as a Server-Sent Event (SSE) with a unified structure:

```code-block text-sm

```

Key characteristics of mid-stream errors:

- The error appears at the **top level** alongside standard response fields (id, object, created, etc.)
- A `choices` array is included with `finish_reason: "error"` to properly terminate the stream
- The HTTP status remains 200 OK since headers were already sent
- The stream is terminated after this unified error event

#### Code Examples

Here’s how to properly handle both types of errors in your streaming implementation:

PythonTypeScript

```code-block text-sm

```

#### API-Specific Behavior

Different API endpoints may handle streaming errors slightly differently:

- **OpenAI Chat Completions API**: Returns `ErrorResponse` directly if no chunks were processed, or includes error information in the response if some chunks were processed
- **OpenAI Responses API**: May transform certain error codes (like `context_length_exceeded`) into a successful response with `finish_reason: "length"` instead of treating them as errors

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
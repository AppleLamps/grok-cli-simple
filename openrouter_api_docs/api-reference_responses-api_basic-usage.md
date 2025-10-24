---
url: "https://openrouter.ai/docs/api-reference/responses-api/basic-usage"
title: "Responses API Beta Basic Usage | Simple Text Requests | OpenRouter | Documentation"
---

##### Beta API

This API is in **beta stage** and may have breaking changes.

The Responses API Beta supports both simple string input and structured message arrays, making it easy to get started with basic text generation.

## Simple String Input

The simplest way to use the API is with a string input:

TypeScriptPythoncURL

```code-block text-sm

```

## Structured Message Input

For more complex conversations, use the message array format:

TypeScriptPythoncURL

```code-block text-sm

```

## Response Format

The API returns a structured response with the generated content:

```code-block text-sm

```

## Streaming Responses

Enable streaming for real-time response generation:

TypeScriptPython

```code-block text-sm

```

### Example Streaming Output

The streaming response returns Server-Sent Events (SSE) chunks:

```code-block text-sm

```

## Common Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `model` | string | **Required.** Model to use (e.g., `openai/o4-mini`) |
| `input` | string or array | **Required.** Text or message array |
| `stream` | boolean | Enable streaming responses (default: false) |
| `max_output_tokens` | integer | Maximum tokens to generate |
| `temperature` | number | Sampling temperature (0-2) |
| `top_p` | number | Nucleus sampling parameter (0-1) |

## Error Handling

Handle common errors gracefully:

TypeScriptPython

```code-block text-sm

```

## Multiple Turn Conversations

Since the Responses API Beta is stateless, you must include the full conversation history in each request to maintain context:

TypeScriptPython

```code-block text-sm

```

##### Required Fields

The `id` and `status` fields are required for any `assistant` role messages included in the conversation history.

##### Conversation History

Always include the complete conversation history in each request. The API does not store previous messages, so context must be maintained client-side.

## Next Steps

- Learn about [Reasoning](https://openrouter.ai/docs/api-reference/responses-api/reasoning) capabilities
- Explore [Tool Calling](https://openrouter.ai/docs/api-reference/responses-api/tool-calling) functionality
- Try [Web Search](https://openrouter.ai/docs/api-reference/responses-api/web-search) integration

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
---
url: "https://openrouter.ai/docs/api-reference/errors"
title: "API Error Handling | OpenRouter Error Documentation | OpenRouter | Documentation"
---

For errors, OpenRouter returns a JSON response with the following shape:

```code-block text-sm

```

The HTTP Response will have the same status code as `error.code`, forming a request error if:

- Your original request is invalid
- Your API key/account is out of credits

Otherwise, the returned HTTP response status will be `200` and any error occurred while the LLM is producing the output will be emitted in the response body or as an SSE data event.

Example code for printing errors in JavaScript:

```code-block text-sm

```

## Error Codes

- **400**: Bad Request (invalid or missing params, CORS)
- **401**: Invalid credentials (OAuth session expired, disabled/invalid API key)
- **402**: Your account or API key has insufficient credits. Add more credits and retry the request.
- **403**: Your chosen model requires moderation and your input was flagged
- **408**: Your request timed out
- **429**: You are being rate limited
- **502**: Your chosen model is down or we received an invalid response from it
- **503**: There is no available model provider that meets your routing requirements

## Moderation Errors

If your input was flagged, the `error.metadata` will contain information about the issue. The shape of the metadata is as follows:

```code-block text-sm

```

## Provider Errors

If the model provider encounters an error, the `error.metadata` will contain information about the issue. The shape of the metadata is as follows:

```code-block text-sm

```

## When No Content is Generated

Occasionally, the model may not generate any content. This typically occurs when:

- The model is warming up from a cold start
- The system is scaling up to handle more requests

Warm-up times usually range from a few seconds to a few minutes, depending on the model and provider.

If you encounter persistent no-content issues, consider implementing a simple retry mechanism or trying again with a different provider or model that has more recent activity.

Additionally, be aware that in some cases, you may still be charged for the prompt processing cost by the upstream provider, even if no content is generated.

## Streaming Error Formats

When using streaming mode ( `stream: true`), errors are handled differently depending on when they occur:

### Pre-Stream Errors

Errors that occur before any tokens are sent follow the standard error format above, with appropriate HTTP status codes.

### Mid-Stream Errors

Errors that occur after streaming has begun are sent as Server-Sent Events (SSE) with a unified structure that includes both the error details and a completion choice:

```code-block text-sm

```

Example SSE data:

```code-block text-sm

```

Key characteristics:

- The error appears at the **top level** alongside standard response fields
- A `choices` array is included with `finish_reason: "error"` to properly terminate the stream
- The HTTP status remains 200 OK since headers were already sent
- The stream is terminated after this event

## OpenAI Responses API Error Events

The OpenAI Responses API ( `/api/alpha/responses`) uses specific event types for streaming errors:

### Error Event Types

1. **`response.failed`** \- Official failure event



```code-block text-sm


```

2. **`response.error`** \- Error during response generation



```code-block text-sm


```

3. **`error`** \- Plain error event (undocumented but sent by OpenAI)



```code-block text-sm


```


### Error Code Transformations

The Responses API transforms certain error codes into successful completions with specific finish reasons:

| Error Code | Transformed To | Finish Reason |
| --- | --- | --- |
| `context_length_exceeded` | Success | `length` |
| `max_tokens_exceeded` | Success | `length` |
| `token_limit_exceeded` | Success | `length` |
| `string_too_long` | Success | `length` |

This allows for graceful handling of limit-based errors without treating them as failures.

## API-Specific Error Handling

Different OpenRouter API endpoints handle errors in distinct ways:

### OpenAI Chat Completions API ( `/api/v1/chat/completions`)

- **No tokens sent**: Returns standalone `ErrorResponse`
- **Some tokens sent**: Embeds error information within the `choices` array of the final response
- **Streaming**: Errors sent as SSE events with top-level error field

### OpenAI Responses API ( `/api/alpha/responses`)

- **Error transformations**: Certain errors become successful responses with appropriate finish reasons
- **Streaming events**: Uses typed events ( `response.failed`, `response.error`, `error`)
- **Graceful degradation**: Handles provider-specific errors with fallback behavior

### Error Response Type Definitions

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
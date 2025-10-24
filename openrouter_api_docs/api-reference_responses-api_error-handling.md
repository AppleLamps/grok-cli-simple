---
url: "https://openrouter.ai/docs/api-reference/responses-api/error-handling"
title: "Responses API Beta Error Handling | Basic Error Guide | OpenRouter | Documentation"
---

##### Beta API

This API is in **beta stage** and may have breaking changes. Use with caution in production environments.

##### Stateless Only

This API is **stateless** \- each request is independent and no conversation state is persisted between requests. You must include the full conversation history in each request.

The Responses API Beta returns structured error responses that follow a consistent format.

## Error Response Format

All errors follow this structure:

```code-block text-sm

```

### Error Codes

The API uses the following error codes:

| Code | Description | Equivalent HTTP Status |
| --- | --- | --- |
| `invalid_prompt` | Request validation failed | 400 |
| `rate_limit_exceeded` | Too many requests | 429 |
| `server_error` | Internal server error | 500+ |

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
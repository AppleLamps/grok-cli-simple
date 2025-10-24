---
url: "https://openrouter.ai/docs/api-reference/responses-api/overview"
title: "OpenRouter Responses API Beta | OpenRouter | Documentation"
---

##### Beta API

This API is in **beta stage** and may have breaking changes. Use with caution in production environments.

##### Stateless Only

This API is **stateless** \- each request is independent and no conversation state is persisted between requests. You must include the full conversation history in each request.

OpenRouter’s Responses API Beta provides OpenAI-compatible access to multiple AI models through a unified interface, designed to be a drop-in replacement for OpenAI’s Responses API. This stateless API offers enhanced capabilities including reasoning, tool calling, and web search integration, with each request being independent and no server-side state persisted.

## Base URL

```code-block text-sm

```

## Authentication

All requests require authentication using your OpenRouter API key:

TypeScriptPythoncURL

```code-block text-sm

```

## Core Features

### [Basic Usage](https://openrouter.ai/docs/api-reference/responses-api/basic-usage)

Learn the fundamentals of making requests with simple text input and handling responses.

### [Reasoning](https://openrouter.ai/docs/api-reference/responses-api/reasoning)

Access advanced reasoning capabilities with configurable effort levels and encrypted reasoning chains.

### [Tool Calling](https://openrouter.ai/docs/api-reference/responses-api/tool-calling)

Integrate function calling with support for parallel execution and complex tool interactions.

### [Web Search](https://openrouter.ai/docs/api-reference/responses-api/web-search)

Enable web search capabilities with real-time information retrieval and citation annotations.

## Error Handling

The API returns structured error responses:

```code-block text-sm

```

For comprehensive error handling guidance, see [Error Handling](https://openrouter.ai/docs/api-reference/responses-api/error-handling).

## Rate Limits

Standard OpenRouter rate limits apply. See [API Limits](https://openrouter.ai/docs/api-reference/limits) for details.

Ask AI

Assistant

Hi, I'm an AI assistant with access to documentation and other content.

Tip: you can toggle this pane with

`⌘`

+

`/`

Suggestions

How do I integrate OpenRouter with LangChain in Python?

What is prompt caching and how can I use it to reduce costs?

How do I enable web search capabilities for my AI model responses?

What's the difference between streaming and non-streaming responses?

How do I send PDF documents to models through the OpenRouter API?
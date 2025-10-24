---
url: "https://openrouter.ai/docs/api-reference/responses-api/web-search"
title: "Responses API Beta Web Search | Real-time Information Retrieval | OpenRouter | Documentation"
---

##### Beta API

This API is in **beta stage** and may have breaking changes.

The Responses API Beta supports web search integration, allowing models to access real-time information from the internet and provide responses with proper citations and annotations.

## Web Search Plugin

Enable web search using the `plugins` parameter:

TypeScriptPythoncURL

```code-block text-sm

```

## Plugin Configuration

Configure web search behavior:

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | string | **Required.** Must be “web” |
| `max_results` | integer | Maximum search results to retrieve (1-10) |

## Structured Message with Web Search

Use structured messages for more complex queries:

TypeScriptPython

```code-block text-sm

```

## Online Model Variants

Some models have built-in web search capabilities using the `:online` variant:

TypeScriptPython

```code-block text-sm

```

## Response with Annotations

Web search responses include citation annotations:

```code-block text-sm

```

## Annotation Types

Web search responses can include different annotation types:

### URL Citation

```code-block text-sm

```

## Complex Search Queries

Handle multi-part search queries:

TypeScriptPython

```code-block text-sm

```

## Web Search in Conversation

Include web search in multi-turn conversations:

TypeScriptPython

```code-block text-sm

```

## Streaming Web Search

Monitor web search progress with streaming:

TypeScriptPython

```code-block text-sm

```

## Annotation Processing

Extract and process citation information:

TypeScriptPython

```code-block text-sm

```

## Best Practices

1. **Limit results**: Use appropriate `max_results` to balance quality and speed
2. **Handle annotations**: Process citation annotations for proper attribution
3. **Query specificity**: Make search queries specific for better results
4. **Error handling**: Handle cases where web search might fail
5. **Rate limits**: Be mindful of search rate limits

## Next Steps

- Learn about [Tool Calling](https://openrouter.ai/docs/api-reference/responses-api/tool-calling) integration
- Explore [Reasoning](https://openrouter.ai/docs/api-reference/responses-api/reasoning) capabilities
- Review [Basic Usage](https://openrouter.ai/docs/api-reference/responses-api/basic-usage) fundamentals

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
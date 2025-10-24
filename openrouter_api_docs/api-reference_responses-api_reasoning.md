---
url: "https://openrouter.ai/docs/api-reference/responses-api/reasoning"
title: "Responses API Beta Reasoning | Advanced AI Reasoning Capabilities | OpenRouter | Documentation"
---

##### Beta API

This API is in **beta stage** and may have breaking changes.

The Responses API Beta supports advanced reasoning capabilities, allowing models to show their internal reasoning process with configurable effort levels.

## Reasoning Configuration

Configure reasoning behavior using the `reasoning` parameter:

TypeScriptPythoncURL

```code-block text-sm

```

## Reasoning Effort Levels

The `effort` parameter controls how much computational effort the model puts into reasoning:

| Effort Level | Description |
| --- | --- |
| `minimal` | Basic reasoning with minimal computational effort |
| `low` | Light reasoning for simple problems |
| `medium` | Balanced reasoning for moderate complexity |
| `high` | Deep reasoning for complex problems |

## Complex Reasoning Example

For complex mathematical or logical problems:

TypeScriptPython

```code-block text-sm

```

## Reasoning in Conversation Context

Include reasoning in multi-turn conversations:

TypeScriptPython

```code-block text-sm

```

## Streaming Reasoning

Enable streaming to see reasoning develop in real-time:

TypeScriptPython

```code-block text-sm

```

## Response with Reasoning

When reasoning is enabled, the response includes reasoning information:

```code-block text-sm

```

## Best Practices

1. **Choose appropriate effort levels**: Use `high` for complex problems, `low` for simple tasks
2. **Consider token usage**: Reasoning increases token consumption
3. **Use streaming**: For long reasoning chains, streaming provides better user experience
4. **Include context**: Provide sufficient context for the model to reason effectively

## Next Steps

- Explore [Tool Calling](https://openrouter.ai/docs/api-reference/responses-api/tool-calling) with reasoning
- Learn about [Web Search](https://openrouter.ai/docs/api-reference/responses-api/web-search) integration
- Review [Basic Usage](https://openrouter.ai/docs/api-reference/responses-api/basic-usage) fundamentals

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
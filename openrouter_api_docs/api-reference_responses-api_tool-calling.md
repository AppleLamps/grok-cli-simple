---
url: "https://openrouter.ai/docs/api-reference/responses-api/tool-calling"
title: "Responses API Beta Tool Calling | Function Calling Integration | OpenRouter | Documentation"
---

##### Beta API

This API is in **beta stage** and may have breaking changes.

The Responses API Beta supports comprehensive tool calling capabilities, allowing models to call functions, execute tools in parallel, and handle complex multi-step workflows.

## Basic Tool Definition

Define tools using the OpenAI function calling format:

TypeScriptPythoncURL

```code-block text-sm

```

## Tool Choice Options

Control when and how tools are called:

| Tool Choice | Description |
| --- | --- |
| `auto` | Model decides whether to call tools |
| `none` | Model will not call any tools |
| `{type: 'function', name: 'tool_name'}` | Force specific tool call |

### Force Specific Tool

TypeScriptPython

```code-block text-sm

```

### Disable Tool Calling

TypeScriptPython

```code-block text-sm

```

## Multiple Tools

Define multiple tools for complex workflows:

TypeScriptPython

```code-block text-sm

```

## Parallel Tool Calls

The API supports parallel execution of multiple tools:

TypeScriptPython

```code-block text-sm

```

## Tool Call Response

When tools are called, the response includes function call information:

```code-block text-sm

```

## Tool Responses in Conversation

Include tool responses in follow-up requests:

TypeScriptPython

```code-block text-sm

```

##### Required Field

The `id` field is required for `function_call_output` objects when including tool responses in conversation history.

## Streaming Tool Calls

Monitor tool calls in real-time with streaming:

TypeScriptPython

```code-block text-sm

```

## Tool Validation

Ensure tool calls have proper structure:

```code-block text-sm

```

Required fields:

- `type`: Always “function\_call”
- `id`: Unique identifier for the function call object
- `name`: Function name matching tool definition
- `arguments`: Valid JSON string with function parameters
- `call_id`: Unique identifier for the call

## Best Practices

1. **Clear descriptions**: Provide detailed function descriptions and parameter explanations
2. **Proper schemas**: Use valid JSON Schema for parameters
3. **Error handling**: Handle cases where tools might not be called
4. **Parallel execution**: Design tools to work independently when possible
5. **Conversation flow**: Include tool responses in follow-up requests for context

## Next Steps

- Learn about [Web Search](https://openrouter.ai/docs/api-reference/responses-api/web-search) integration
- Explore [Reasoning](https://openrouter.ai/docs/api-reference/responses-api/reasoning) with tools
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
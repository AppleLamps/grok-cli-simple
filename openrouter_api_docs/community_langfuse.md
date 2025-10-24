---
url: "https://openrouter.ai/docs/community/langfuse"
title: "Langfuse Integration | OpenRouter SDK Support | OpenRouter | Documentation"
---

## Using Langfuse

[Langfuse](https://langfuse.com/) provides observability and analytics for LLM applications. Since OpenRouter uses the OpenAI API schema, you can utilize Langfuse’s native integration with the OpenAI SDK to automatically trace and monitor your OpenRouter API calls.

### Installation

```code-block text-sm

```

### Configuration

Set up your environment variables:

Environment Setup

```code-block text-sm

```

### Simple LLM Call

Since OpenRouter provides an OpenAI-compatible API, you can use the Langfuse OpenAI SDK wrapper to automatically log OpenRouter calls as generations in Langfuse:

Basic Integration

```code-block text-sm

```

### Advanced Tracing with Nested Calls

Use the `@observe()` decorator to capture execution details of functions with nested LLM calls:

Nested Function Tracing

```code-block text-sm

```

### Learn More

- **Langfuse OpenRouter Integration**: [https://langfuse.com/docs/integrations/other/openrouter](https://langfuse.com/docs/integrations/other/openrouter)
- **OpenRouter Quick Start Guide**: [https://openrouter.ai/docs/quickstart](https://openrouter.ai/docs/quickstart)
- **Langfuse `@observe()` Decorator**: [https://langfuse.com/docs/sdk/python/decorators](https://langfuse.com/docs/sdk/python/decorators)

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
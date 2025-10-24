---
url: "https://openrouter.ai/docs/features/presets"
title: "Presets | Configuration Management for AI Models | OpenRouter | Documentation"
---

[Presets](https://openrouter.ai/settings/presets) allow you to separate your LLM configuration from your code. Create and manage presets through the OpenRouter web application to control provider routing, model selection, system prompts, and other parameters, then reference them in OpenRouter API requests.

## What are Presets?

Presets are named configurations that encapsulate all the settings needed for a specific use case. For example, you might create:

- An “email-copywriter” preset for generating marketing copy
- An “inbound-classifier” preset for categorizing customer inquiries
- A “code-reviewer” preset for analyzing pull requests

Each preset can manage:

- Provider routing preferences (sort by price, latency, etc.)
- Model selection (specific model or array of models with fallbacks)
- System prompts
- Generation parameters (temperature, top\_p, etc.)
- Provider inclusion/exclusion rules

## Quick Start

1. [Create a preset](https://openrouter.ai/settings/presets). For example, select a model and restrict provider routing to just a few providers.
![Creating a new preset](https://files.buildwithfern.com/openrouter.docs.buildwithfern.com/docs/2025-10-22T14:23:37.386Z/content/assets/preset-example.png)

2. Make an API request to the preset:


```code-block text-sm

```

## Benefits

### Separation of Concerns

Presets help you maintain a clean separation between your application code and LLM configuration. This makes your code more semantic and easier to maintain.

### Rapid Iteration

Update your LLM configuration without deploying code changes:

- Switch to new model versions
- Adjust system prompts
- Modify parameters
- Change provider preferences

## Using Presets

There are three ways to use presets in your API requests.

1. **Direct Model Reference**

You can reference the preset as if it was a model by sending requests to `@preset/preset-slug`

```code-block text-sm

```

2. **Preset Field**

```code-block text-sm

```

3. **Combined Model and Preset**

```code-block text-sm

```

## Other Notes

1. If you’re using an organization account, all members can access organization presets. This is a great way to share best practices across teams.
2. Version history is kept in order to understand changes that were made, and to be able to roll back. However when addressing a preset through the API, the latest version is always used.
3. If you provide parameters in the request, they will be shallow-merged with the options configured in the preset.

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
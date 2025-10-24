---
url: "https://openrouter.ai/docs/features/web-search"
title: "Web Search | Add Real-time Web Data to AI Model Responses | OpenRouter | Documentation"
---

You can incorporate relevant web search results for _any_ model on OpenRouter by activating and customizing the `web` plugin, or by appending `:online` to the model slug:

```code-block text-sm

```

This is a shortcut for using the `web` plugin, and is exactly equivalent to:

```code-block text-sm

```

The web search plugin is powered by native search for Anthropic and OpenAI natively and by [Exa](https://exa.ai/) for other models. For Exa, it uses their [“auto”](https://docs.exa.ai/reference/how-exa-search-works#combining-neural-and-keyword-the-best-of-both-worlds-through-exa-auto-search) method (a combination of keyword search and embeddings-based web search) to find the most relevant results and augment/ground your prompt.

## Parsing web search results

Web search results for all models (including native-only models like Perplexity and OpenAI Online) are available in the API and standardized by OpenRouterto follow the same annotation schema in the [OpenAI Chat Completion Message type](https://platform.openai.com/docs/api-reference/chat/object):

```code-block text-sm

```

## Customizing the Web Plugin

The maximum results allowed by the web plugin and the prompt used to attach them to your message stream can be customized:

```code-block text-sm

```

By default, the web plugin uses the following search prompt, using the current date:

```code-block text-sm

```

## Engine Selection

The web search plugin supports the following options for the `engine` parameter:

- **`native`**: Always uses the model provider’s built-in web search capabilities
- **`exa`**: Uses Exa’s search API for web results
- **`undefined` (not specified)**: Uses native search if available for the provider, otherwise falls back to Exa

### Default Behavior

When the `engine` parameter is not specified:

- **Native search is used by default** for OpenAI and Anthropic models that support it
- **Exa search is used** for all other models or when native search is not supported

When you explicitly specify `"engine": "native"`, it will always attempt to use the provider’s native search, even if the model doesn’t support it (which may result in an error).

### Forcing Engine Selection

You can explicitly specify which engine to use:

```code-block text-sm

```

Or force Exa search even for models that support native search:

```code-block text-sm

```

### Engine-Specific Pricing

- **Native search**: Pricing is passed through directly from the provider (see provider-specific pricing sections below)
- **Exa search**: Uses OpenRouter credits at $4 per 1000 results (default 5 results = $0.02 per request)

## Pricing

### Exa Search Pricing

When using Exa search (either explicitly via `"engine": "exa"` or as fallback), the web plugin uses your OpenRouter credits and charges _$4 per 1000 results_. By default, `max_results` set to 5, this comes out to a maximum of $0.02 per request, in addition to the LLM usage for the search result prompt tokens.

### Native Search Pricing (Provider Passthrough)

Some models have built-in web search. These models charge a fee based on the search context size, which determines how much search data is retrieved and processed for a query.

### Search Context Size Thresholds

Search context can be ‘low’, ‘medium’, or ‘high’ and determines how much search context is retrieved for a query:

- **Low**: Minimal search context, suitable for basic queries
- **Medium**: Moderate search context, good for general queries
- **High**: Extensive search context, ideal for detailed research

### Specifying Search Context Size

You can specify the search context size in your API request using the `web_search_options` parameter:

```code-block text-sm

```

### OpenAI Model Pricing

For GPT-4.1, GPT-4o, and GPT-4o search preview Models:

| Search Context Size | Price per 1000 Requests |
| --- | --- |
| Low | $30.00 |
| Medium | $35.00 |
| High | $50.00 |

For GPT-4.1-Mini, GPT-4o-Mini, and GPT-4o-Mini-Search-Preview Models:

| Search Context Size | Price per 1000 Requests |
| --- | --- |
| Low | $25.00 |
| Medium | $27.50 |
| High | $30.00 |

### Perplexity Model Pricing

For Sonar and SonarReasoning:

| Search Context Size | Price per 1000 Requests |
| --- | --- |
| Low | $5.00 |
| Medium | $8.00 |
| High | $12.00 |

For SonarPro and SonarReasoningPro:

| Search Context Size | Price per 1000 Requests |
| --- | --- |
| Low | $6.00 |
| Medium | $10.00 |
| High | $14.00 |

##### Engine Parameter

The pricing above applies when using `"engine": "native"` or when native search is used by default for supported models. When using `"engine": "exa"`, the Exa search pricing ($4 per 1000 results) applies instead.

##### Pricing Documentation

For more detailed information about pricing models, refer to the official documentation:

- [OpenAI Pricing](https://platform.openai.com/docs/pricing#web-search)
- [Anthropic Pricing](https://docs.claude.com/en/docs/agents-and-tools/tool-use/web-search-tool#usage-and-pricing)
- [Perplexity Pricing](https://docs.perplexity.ai/guides/pricing)

Ask AI

Assistant

Hi, I'm an AI assistant with access to documentation and other content.

Tip: you can toggle this pane with

`⌘`

+

`/`

Suggestions

How do I integrate OpenRouter with LangChain for Python and JavaScript?

What is the difference between prompt caching and usage accounting in OpenRouter?

How can I enable web search capabilities in my AI model responses using OpenRouter?

What are the benefits of using BYOK (Bring Your Own Keys) with OpenRouter?

How do I implement streaming responses and structured outputs with OpenRouter's API?
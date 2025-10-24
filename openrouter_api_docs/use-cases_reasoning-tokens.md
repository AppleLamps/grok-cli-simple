---
url: "https://openrouter.ai/docs/use-cases/reasoning-tokens"
title: "Reasoning Tokens | Enhanced AI Model Reasoning with OpenRouter | OpenRouter | Documentation"
---

For models that support it, the OpenRouter API can return **Reasoning Tokens**, also known as thinking tokens. OpenRouter normalizes the different ways of customizing the amount of reasoning tokens that the model will use, providing a unified interface across different providers.

Reasoning tokens provide a transparent look into the reasoning steps taken by a model. Reasoning tokens are considered output tokens and charged accordingly.

Reasoning tokens are included in the response by default if the model decides to output them. Reasoning tokens will appear in the `reasoning` field of each message, unless you decide to exclude them.

##### Some reasoning models do not return their reasoning tokens

While most models and providers make reasoning tokens available in the
response, some (like the OpenAI o-series and Gemini Flash Thinking) do not.

## Controlling Reasoning Tokens

You can control reasoning tokens in your requests using the `reasoning` parameter:

```code-block text-sm

```

The `reasoning` config object consolidates settings for controlling reasoning strength across different models. See the Note for each option below to see which models are supported and how other models will behave.

### Max Tokens for Reasoning

##### Supported models

Currently supported by:

- Gemini thinking models
- Anthropic reasoning models (by using the `reasoning.max_tokens`
parameter)

- Some Alibaba Qwen thinking models (mapped to `thinking_budget`)

For Alibaba, support varies by model — please check the individual model descriptions to confirm
whether `reasoning.max_tokens` (via `thinking_budget`) is available.

For models that support reasoning token allocation, you can control it like this:

- `"max_tokens": 2000` \- Directly specifies the maximum number of tokens to use for reasoning

For models that only support `reasoning.effort` (see below), the `max_tokens` value will be used to determine the effort level.

### Reasoning Effort Level

##### Supported models

Currently supported by OpenAI reasoning models (o1 series, o3 series, GPT-5 series) and Grok models

- `"effort": "high"` \- Allocates a large portion of tokens for reasoning (approximately 80% of max\_tokens)
- `"effort": "medium"` \- Allocates a moderate portion of tokens (approximately 50% of max\_tokens)
- `"effort": "low"` \- Allocates a smaller portion of tokens (approximately 20% of max\_tokens)

For models that only support `reasoning.max_tokens`, the effort level will be set based on the percentages above.

### Excluding Reasoning Tokens

If you want the model to use reasoning internally but not include it in the response:

- `"exclude": true` \- The model will still use reasoning, but it won’t be returned in the response

Reasoning tokens will appear in the `reasoning` field of each message.

### Enable Reasoning with Default Config

To enable reasoning with the default parameters:

- `"enabled": true` \- Enables reasoning at the “medium” effort level with no exclusions.

## Legacy Parameters

For backward compatibility, OpenRouter still supports the following legacy parameters:

- `include_reasoning: true` \- Equivalent to `reasoning: {}`
- `include_reasoning: false` \- Equivalent to `reasoning: { exclude: true }`

However, we recommend using the new unified `reasoning` parameter for better control and future compatibility.

## Examples

### Basic Usage with Reasoning Tokens

PythonTypeScript

```code-block text-sm

```

### Using Max Tokens for Reasoning

For models that support direct token allocation (like Anthropic models), you can specify the exact number of tokens to use for reasoning:

PythonTypeScript

```code-block text-sm

```

### Excluding Reasoning Tokens from Response

If you want the model to use reasoning internally but not include it in the response:

PythonTypeScript

```code-block text-sm

```

### Advanced Usage: Reasoning Chain-of-Thought

This example shows how to use reasoning tokens in a more complex workflow. It injects one model’s reasoning into another model to improve its response quality:

PythonTypeScript

```code-block text-sm

```

## Provider-Specific Reasoning Implementation

### Anthropic Models with Reasoning Tokens

The latest Claude models, such as [anthropic/claude-3.7-sonnet](https://openrouter.ai/anthropic/claude-3.7-sonnet), support working with and returning reasoning tokens.

You can enable reasoning on Anthropic models **only** using the unified `reasoning` parameter with either `effort` or `max_tokens`.

**Note:** The `:thinking` variant is no longer supported for Anthropic models. Use the `reasoning` parameter instead.

#### Reasoning Max Tokens for Anthropic Models

When using Anthropic models with reasoning:

- When using the `reasoning.max_tokens` parameter, that value is used directly with a minimum of 1024 tokens.
- When using the `reasoning.effort` parameter, the budget\_tokens are calculated based on the `max_tokens` value.

The reasoning token allocation is capped at 32,000 tokens maximum and 1024 tokens minimum. The formula for calculating the budget\_tokens is: `budget_tokens = max(min(max_tokens * {effort_ratio}, 32000), 1024)`

effort\_ratio is 0.8 for high effort, 0.5 for medium effort, and 0.2 for low effort.

**Important**: `max_tokens` must be strictly higher than the reasoning budget to ensure there are tokens available for the final response after thinking.

##### Token Usage and Billing

Please note that reasoning tokens are counted as output tokens for billing
purposes. Using reasoning tokens will increase your token usage but can
significantly improve the quality of model responses.

### Examples with Anthropic Models

#### Example 1: Streaming mode with reasoning tokens

PythonTypeScript

```code-block text-sm

```

## Preserving Reasoning Blocks

##### Model Support

The reasoning\_details are currently returned by all OpenAI reasoning models
(o1 series, o3 series, GPT-5 series), all Anthropic reasoning models
(Claude 3.7, Claude 4, and Claude 4.1 series), and all xAI reasoning models.

The reasoning\_details functionality works identically across all supported reasoning models. You can easily switch between OpenAI reasoning models (like `openai/gpt-5-mini`) and Anthropic reasoning models (like `anthropic/claude-sonnet-4`) without changing your code structure.

If you want to pass reasoning back in context, you must pass reasoning blocks back to the API. This is useful for maintaining the model’s reasoning flow and conversation integrity.

Preserving reasoning blocks is useful specifically for tool calling. When models like Claude invoke tools, it is pausing its construction of a response to await external information. When tool results are returned, the model will continue building that existing response. This necessitates preserving reasoning blocks during tool use, for a couple of reasons:

**Reasoning continuity**: The reasoning blocks capture the model’s step-by-step reasoning that led to tool requests. When you post tool results, including the original reasoning ensures the model can continue its reasoning from where it left off.

**Context maintenance**: While tool results appear as user messages in the API structure, they’re part of a continuous reasoning flow. Preserving reasoning blocks maintains this conceptual flow across multiple API calls.

##### Important for Reasoning Models

When providing reasoning\_details blocks, the entire sequence of consecutive
reasoning blocks must match the outputs generated by the model during the
original request; you cannot rearrange or modify the sequence of these blocks.

## Responses API Shape

When reasoning models generate responses, the reasoning information is structured in a standardized format through the `reasoning_details` array. This section documents the API response structure for reasoning details in both streaming and non-streaming responses, based on the schema definitions in the `llm-interfaces` package.

### reasoning\_details Array Structure

The `reasoning_details` field contains an array of reasoning detail objects. Each object in the array represents a specific piece of reasoning information and follows one of three possible types. The location of this array differs between streaming and non-streaming responses:

- **Non-streaming responses**: `reasoning_details` appears in `choices[].message.reasoning_details`
- **Streaming responses**: `reasoning_details` appears in `choices[].delta.reasoning_details` for each chunk

#### Common Fields

All reasoning detail objects share these common fields:

- `id` (string \| null): Unique identifier for the reasoning detail
- `format` (string): The format of the reasoning detail, with possible values:
  - `"unknown"` \- Format is not specified
  - `"openai-responses-v1"` \- OpenAI responses format version 1
  - `"xai-responses-v1"` \- xAI responses format version 1
  - `"anthropic-claude-v1"` \- Anthropic Claude format version 1 (default)
- `index` (number, optional): Sequential index of the reasoning detail

#### Reasoning Detail Types

**1\. Summary Type ( `reasoning.summary`)**

Contains a high-level summary of the reasoning process:

```code-block text-sm

```

**2\. Encrypted Type ( `reasoning.encrypted`)**

Contains encrypted reasoning data that may be redacted or protected:

```code-block text-sm

```

**3\. Text Type ( `reasoning.text`)**

Contains raw text reasoning with optional signature verification:

```code-block text-sm

```

### Response Examples

#### Non-Streaming Response

In non-streaming responses, `reasoning_details` appears in the message:

```code-block text-sm

```

#### Streaming Response

In streaming responses, `reasoning_details` appears in delta chunks as the reasoning is generated:

```code-block text-sm

```

**Streaming Behavior Notes:**

- Each reasoning detail chunk is sent as it becomes available
- The `reasoning_details` array in each chunk may contain one or more reasoning objects
- For encrypted reasoning, the content may appear as `[REDACTED]` in streaming responses
- The complete reasoning sequence is built by concatenating all chunks in order

### Example: Preserving Reasoning Blocks with OpenRouter and Claude

PythonTypeScript

```code-block text-sm

```

For more detailed information about thinking encryption, redacted blocks, and advanced use cases, see [Anthropic’s documentation on extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/tool-use#extended-thinking).

For more information about OpenAI reasoning models, see [OpenAI’s reasoning documentation](https://platform.openai.com/docs/guides/reasoning#keeping-reasoning-items-in-context).

Ask AI

Assistant

Hi, I'm an AI assistant with access to documentation and other content.

Tip: you can toggle this pane with

`⌘`

+

`/`

Suggestions

How do I integrate OpenRouter with LangChain in Python?

What models support prompt caching and how can I enable it?

How do I send PDF files to OpenRouter models using the API?

What is the difference between streaming and non-streaming responses?

How can I track token usage and costs without making additional API calls?
---
url: "https://openrouter.ai/docs/features/zero-completion-insurance"
title: "Zero Completion Insurance | No Charge for Zero Token Responses | OpenRouter | Documentation"
---

OpenRouter provides zero completion insurance to protect users from being charged for failed or empty responses. When a response contains no output tokens and either has a blank finish reason or an error, you will not be charged for the request, even if the underlying provider charges for prompt processing.

Zero completion insurance is automatically enabled for all accounts and requires no configuration.

## How It Works

Zero completion insurance automatically applies to all requests across all models and providers. When a response meets either of these conditions, no credits will be deducted from your account:

- The response has zero completion tokens AND a blank/null finish reason
- The response has an error finish reason

## Viewing Protected Requests

On your activity page, requests that were protected by zero completion insurance will show zero credits deducted. This applies even in cases where OpenRouter may have been charged by the provider for prompt processing.

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
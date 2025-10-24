---
url: "https://openrouter.ai/docs/features/provisioning-api-keys"
title: "Provisioning API Keys | Programmatic Control of OpenRouter API Keys | OpenRouter | Documentation"
---

OpenRouter provides endpoints to programmatically manage your API keys, enabling key creation and management for applications that need to distribute or rotate keys automatically.

## Creating a Provisioning API Key

To use the key management API, you first need to create a Provisioning API key:

1. Go to the [Provisioning API Keys page](https://openrouter.ai/settings/provisioning-keys)
2. Click “Create New Key”
3. Complete the key creation process

Provisioning keys cannot be used to make API calls to OpenRouter’s completion endpoints - they are exclusively for key management operations.

## Use Cases

Common scenarios for programmatic key management include:

- **SaaS Applications**: Automatically create unique API keys for each customer instance
- **Key Rotation**: Regularly rotate API keys for security compliance
- **Usage Monitoring**: Track key usage and automatically disable keys that exceed limits (with optional daily/weekly/monthly limit resets)

## Example Usage

All key management endpoints are under `/api/v1/keys` and require a Provisioning API key in the Authorization header.

PythonTypeScript

```code-block text-sm

```

## Response Format

API responses return JSON objects containing key information:

```code-block text-sm

```

When creating a new key, the response will include the key string itself. Read more in the [API reference](https://openrouter.ai/docs/api-reference/api-keys/create-api-key).

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
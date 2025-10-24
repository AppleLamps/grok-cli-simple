---
url: "https://openrouter.ai/docs/api-reference/api-keys/create-keys"
title: "Create a new API key | OpenRouter | Documentation"
---

### Authentication

AuthorizationBearer

API key as bearer token in Authorization header

### Request

This endpoint expects an object.

namestringRequired `>=1 character`

Name for the new API key

limitdouble or nullOptional

Optional spending limit for the API key in USD

limit\_resetenum or nullOptional

Type of limit reset for the API key (daily, weekly, monthly, or null for no reset). Resets happen automatically at midnight UTC, and weeks are Monday through Sunday.

Allowed values:dailyweeklymonthly

include\_byok\_in\_limitbooleanOptional

Whether to include BYOK usage in the limit

### Response

API key created successfully

dataobject

The created API key information

Show 18 properties

keystring

The actual API key string (only shown once)

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
---
url: "https://openrouter.ai/docs/api-reference/api-keys/update-keys"
title: "Update an API key | OpenRouter | Documentation"
---

### Authentication

AuthorizationBearer

API key as bearer token in Authorization header

### Path parameters

hashstringRequired

The hash identifier of the API key to update

### Request

This endpoint expects an object.

namestringOptional

New name for the API key

disabledbooleanOptional

Whether to disable the API key

limitdouble or nullOptional

New spending limit for the API key in USD

limit\_resetenum or nullOptional

New limit reset type for the API key (daily, weekly, monthly, or null for no reset). Resets happen automatically at midnight UTC, and weeks are Monday through Sunday.

Allowed values:dailyweeklymonthly

include\_byok\_in\_limitbooleanOptional

Whether to include BYOK usage in the limit

### Response

API key updated successfully

dataobject

The updated API key information

Show 18 properties

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
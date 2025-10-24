---
url: "https://openrouter.ai/docs/api-reference/api-keys/update-keys?explorer=true"
title: "Update an API key | OpenRouter | Documentation"
---

### Authentication

AuthorizationBearer

API key as bearer token in Authorization header

### Path parameters

hashstringRequired

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

How do I integrate OpenRouter with LangChain for Python applications?

What is prompt caching and how can I use it to reduce costs with OpenRouter?

How do I enable web search capabilities to ground my AI model responses with real-time information?

What file formats does OpenRouter support and how do I send PDF documents to models?

How do I implement streaming responses and structured outputs with OpenRouter's API?

## API Explorer

Browse, explore, and try out API endpoints without leaving the documentation.

- beta.responses

  - [POSTCreate a response](https://openrouter.ai/docs/api-reference/beta-responses/create-api-alpha-responses?explorer=true)
- Analytics

  - [GETGet user activity grouped by endpoint](https://openrouter.ai/docs/api-reference/analytics/get-user-activity?explorer=true)
- Credits

  - [GETGet remaining credits](https://openrouter.ai/docs/api-reference/credits/get-credits?explorer=true)
  - [POSTCreate a Coinbase charge for crypto payment](https://openrouter.ai/docs/api-reference/credits/create-coinbase-charge?explorer=true)
- Generations

  - [GETGet request & usage metadata for a generation](https://openrouter.ai/docs/api-reference/generations/get-generation?explorer=true)
- Models

  - [GETGet total count of available models](https://openrouter.ai/docs/api-reference/models/list-models-count?explorer=true)
  - [GETList all models and their properties](https://openrouter.ai/docs/api-reference/models/get-models?explorer=true)
  - [GETList models filtered by user provider preferences](https://openrouter.ai/docs/api-reference/models/list-models-user?explorer=true)
- Endpoints

  - [GETList all endpoints for a model](https://openrouter.ai/docs/api-reference/endpoints/list-endpoints?explorer=true)
  - [GETPreview the impact of ZDR on the available endpoints](https://openrouter.ai/docs/api-reference/endpoints/list-endpoints-zdr?explorer=true)
- Parameters

  - [GETGet a model's supported parameters and data about which are most popular](https://openrouter.ai/docs/api-reference/parameters/get-parameters?explorer=true)
- Providers

  - [GETList all providers](https://openrouter.ai/docs/api-reference/providers/list-providers?explorer=true)
- API Keys

  - [GETList API keys](https://openrouter.ai/docs/api-reference/api-keys/list?explorer=true)
  - [POSTCreate a new API key](https://openrouter.ai/docs/api-reference/api-keys/create-keys?explorer=true)
  - [GETGet a single API key](https://openrouter.ai/docs/api-reference/api-keys/get-key?explorer=true)
  - [DELDelete an API key](https://openrouter.ai/docs/api-reference/api-keys/delete-keys?explorer=true)
  - [PATCHUpdate an API key](https://openrouter.ai/docs/api-reference/api-keys/update-keys?explorer=true)
  - [GETGet current API key](https://openrouter.ai/docs/api-reference/api-keys/get-current-key?explorer=true)
- Chat

  - [POSTCreate a chat completion](https://openrouter.ai/docs/api-reference/chat/send-chat-completion-request?explorer=true)
- Completions

  - [POSTCreate a completion](https://openrouter.ai/docs/api-reference/completions/create-completions?explorer=true)

[Built with](https://buildwithfern.com/?utm_campaign=buildWith&utm_medium=docs&utm_source=openrouter.ai)

PATCHhttps://openrouter.ai/api/v1/keys/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

Send Request

Enter your bearer tokenNot Authenticated

##### Path Parameters

- hashstringRequired


##### Body Parameters

- namestring

- disabledboolean

- limit
double or null

- limit\_reset
enum or null




daily

- include\_byok\_in\_limitboolean


Use exampleClear form [View in API Reference](https://openrouter.ai/docs/api-reference/api-keys/update-keys)

RequestcURLTypeScriptPython

```code-block text-xs

```

Response

Send Request
---
url: "https://openrouter.ai/docs/api-reference/endpoints/list-endpoints?explorer=true"
title: "List all endpoints for a model | OpenRouter | Documentation"
---

### Authentication

AuthorizationBearer

API key as bearer token in Authorization header

### Path parameters

authorstringRequired

slugstringRequired

### Response

Returns a list of endpoints

dataobject

List of available endpoints for a model

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

GEThttps://openrouter.ai/api/v1/models/author/slug/endpoints

Send Request

Enter your bearer tokenNot Authenticated

##### Path Parameters

- authorstringRequired

- slugstringRequired


Use exampleClear form [View in API Reference](https://openrouter.ai/docs/api-reference/endpoints/list-endpoints)

RequestcURLTypeScriptPython

```code-block text-xs

```

Response

Send Request
---
url: "https://openrouter.ai/docs/api-reference/chat/send-chat-completion-request?explorer=true"
title: "Create a chat completion | OpenRouter | Documentation"
---

Sends a request for a model response for the given chat conversation. Supports both streaming and non-streaming modes.

### Authentication

AuthorizationBearer

API key as bearer token in Authorization header

### Request

Chat completion request parameters

messageslist of objectsRequired

Show 5 variants

modelstringRequired

frequency\_penaltydouble or nullOptional `>=-2` `<=2`

logit\_biasmap from strings to doubles or nullOptional

logprobsboolean or nullOptional

top\_logprobsdouble or nullOptional `>=0` `<=20`

max\_completion\_tokensdouble or nullOptional `>=1`

max\_tokensdouble or nullOptional `>=1`

metadatamap from strings to stringsOptional

presence\_penaltydouble or nullOptional `>=-2` `<=2`

reasoningobjectOptional

Show 2 properties

response\_formatobjectOptional

Show 5 variants

seedinteger or nullOptional `>=-9007199254740991` `<=9007199254740991`

stopstring or list of strings or nullOptional

Show 2 variants

streamboolean or nullOptionalDefaults to `false`

stream\_optionsobject or nullOptional

Show 1 properties

temperaturedouble or nullOptional `>=0` `<=2` Defaults to `1`

tool\_choice"none" or "auto" or "required" or objectOptional

Show 4 variants

toolslist of objectsOptional

Show 2 properties

top\_pdouble or nullOptional `>=0` `<=1` Defaults to `1`

userstringOptional

### Response

Successful chat completion response

idstring

choiceslist of objects

Show 4 properties

createddouble

modelstring

object"chat.completion"

system\_fingerprintstring or null

usageobject or null

Show 5 properties

### Errors

400

Bad Request Error

401

Unauthorized Error

429

Too Many Requests Error

500

Internal Server Error

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

POSThttps://openrouter.ai/api/v1/chat/completions

Send Request

Enter your bearer tokenNot Authenticated

##### Body Parameters

- messageslist of objectsRequired(1 item)





- 1

object




- role"system"Required



`system`

- contentstring or list of objectsRequired








string



list of objects


1 more optional propertyname

- Add new item

- modelstringRequired


19 more optional propertiesfrequency\_penalty, logit\_bias, logprobs, top\_logprobs, max\_completion\_tokens, max\_tokens, metadata, presence\_penalty, reasoning, response\_format, seed, stop, stream, stream\_options, temperature, tool\_choice, tools, top\_p, user

Use exampleClear form [View in API Reference](https://openrouter.ai/docs/api-reference/chat/send-chat-completion-request)

RequestcURLTypeScriptPython

```code-block text-xs

```

Response

Send Request
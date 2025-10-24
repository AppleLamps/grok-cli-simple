---
url: "https://openrouter.ai/docs/api-reference/completions/create-completions?explorer=true"
title: "Create a completion | OpenRouter | Documentation"
---

Creates a completion for the provided prompt and parameters. Supports both streaming and non-streaming modes.

### Authentication

AuthorizationBearer

API key as bearer token in Authorization header

### Request

Completion request parameters

modelstringRequired

promptstring or list of strings or list of doubles or list of lists of doublesRequired

Show 4 variants

best\_ofinteger or nullOptional `>=1` `<=20`

echoboolean or nullOptional

frequency\_penaltydouble or nullOptional `>=-2` `<=2`

logit\_biasmap from strings to doubles or nullOptional

logprobsinteger or nullOptional `>=0` `<=5`

max\_tokensinteger or nullOptional `>=1`

ninteger or nullOptional `>=1` `<=128`

presence\_penaltydouble or nullOptional `>=-2` `<=2`

seedinteger or nullOptional

stopstring or list of strings or nullOptional

Show 2 variants

streamboolean or nullOptional

stream\_optionsobject or nullOptional

Show 1 properties

suffixstring or nullOptional

temperaturedouble or nullOptional `>=0` `<=2`

top\_pdouble or nullOptional `>=0` `<=1`

userstringOptional

metadatamap from strings to strings or nullOptional

response\_formatobject or nullOptional

Show 5 variants

### Response

Successful completion response

idstring

object"text\_completion"

createddouble

modelstring

choiceslist of objects

Show 4 properties

system\_fingerprintstring or null

usageobject or null

Show 3 properties

### Errors

400

Bad Request Error

401

Unauthorized Error

429

Too Many Requests Error

500

Internal Server Error

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

POSThttps://openrouter.ai/api/v1/completions

Send Request

Enter your bearer tokenNot Authenticated

##### Body Parameters

- modelstringRequired

- promptstring or list of strings or list of doubles or list of lists of doublesRequired








string



list of strings



list of doubles



list of lists of doubles


18 more optional propertiesbest\_of, echo, frequency\_penalty, logit\_bias, logprobs, max\_tokens, n, presence\_penalty, seed, stop, stream, stream\_options, suffix, temperature, top\_p, user, metadata, response\_format

Use exampleClear form [View in API Reference](https://openrouter.ai/docs/api-reference/completions/create-completions)

RequestcURLTypeScriptPython

```code-block text-xs

```

Response

Send Request

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
---
url: "https://openrouter.ai/docs/api-reference/beta-responses/create-api-alpha-responses?explorer=true"
title: "Create a response | OpenRouter | Documentation"
---

Creates a streaming or non-streaming response using OpenResponses API format

### Authentication

AuthorizationBearer

API key as bearer token in Authorization header

### Request

This endpoint expects an object.

inputobjectOptional

instructionsstring or nullOptional

metadatamap from strings to stringsOptional

Metadata key-value pairs for the request. Keys must be ≤64 characters and cannot contain brackets. Values must be ≤512 characters. Maximum 16 pairs allowed.

toolslist of maps from strings to any or objectsOptional

Show 5 variants

tool\_choiceenum or object or map from strings to anyOptional

Controls which tool the model should call

Show 5 variants

parallel\_tool\_callsboolean or nullOptional

modelstringOptional

modelslist of stringsOptional

textobjectOptional

Text output configuration including format and verbosity

Show 2 properties

reasoningobjectOptional

Configuration for reasoning mode in the response

Show 4 properties

max\_output\_tokensdouble or nullOptional

temperaturedouble or nullOptional `>=0` `<=2`

top\_pdouble or nullOptional `>=0`

top\_kdoubleOptional

prompt\_cache\_keystring or nullOptional

previous\_response\_idstring or nullOptional

promptobjectOptional

Prompt template with variables for the response

Show 2 properties

includelist of enums or nullOptional

Allowed values:file\_search\_call.resultsmessage.input\_image.image\_urlcomputer\_call\_output.output.image\_urlreasoning.encrypted\_contentcode\_interpreter\_call.outputs

backgroundboolean or nullOptional

safety\_identifierstring or nullOptional

storeboolean or nullOptional

service\_tierenumOptional

Allowed values:autodefaultflexpriorityscale

truncationenumOptional

Allowed values:autodisabled

streamboolean or nullOptional

providerobject or nullOptional

When multiple model providers are available, optionally indicate your routing preference.

Show 11 properties

pluginslist of objectsOptional

Plugins you want to enable for this request, including their settings.

Show 3 variants

userstringOptional `<=128 characters`

A unique identifier representing your end-user, which helps distinguish between different users of your app. This allows your app to identify specific users in case of abuse reports, preventing your entire app from being affected by the actions of individual users. Maximum of 128 characters.

### Response

Successful response

objectenum

Allowed values:response

created\_atdouble

modelstring

outputlist of maps from strings to any

Show 6 variants

errorobject

Error information returned from the API

Show 2 properties

incomplete\_detailsobject or null

Show 1 properties

temperaturedouble or null

top\_pdouble or null

instructionsstring or list of objects or maps from strings to any or any

Input for a response request - can be a string or array of items

Show 3 variants

metadatamap from strings to strings

Metadata key-value pairs for the request. Keys must be ≤64 characters and cannot contain brackets. Values must be ≤512 characters. Maximum 16 pairs allowed.

toolslist of maps from strings to any or objects

Show 5 variants

tool\_choiceenum or object or map from strings to any

Controls which tool the model should call

Show 5 variants

parallel\_tool\_callsboolean

idstring or null

statusenum or null

Show 6 enum values

userstring or null

output\_textstring or null

prompt\_cache\_keystring or null

safety\_identifierstring or null

usageobject or null

Token usage information for the response

Show 8 properties

max\_tool\_callsdouble or null

top\_logprobsdouble or null

max\_output\_tokensdouble or null

promptobject or null

Prompt template with variables for the response

Show 2 properties

backgroundboolean or null

previous\_response\_idstring or null

reasoningobject or null

Configuration for reasoning mode in the response

Show 4 properties

service\_tierenum or null

Allowed values:autodefaultflexpriorityscale

storeboolean or null

truncationenum or null

Allowed values:autodisabled

textobject or null

Text output configuration including format and verbosity

Show 2 properties

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

POSThttps://openrouter.ai/api/v1/api/alpha/responses

Send Request

Enter your bearer tokenNot Authenticated

##### Body Parameters

- inputobject

- toolslist of maps from strings to any or objects(1 item)





- 1

map from strings to any



- key



value
function

- key



value
get\_current\_weather

- key



value
Get the current weather in a given location

- key



value

- Add new item

- Add new item

- modelstring

- temperature
double or null
`>=0` `<=2`

- top\_p
double or null
`>=0`


22 more optional propertiesinstructions, metadata, tool\_choice, parallel\_tool\_calls, models, text, reasoning, max\_output\_tokens, top\_k, prompt\_cache\_key, previous\_response\_id, prompt, include, background, safety\_identifier, store, service\_tier, truncation, stream, provider, plugins, user

Use exampleClear form [View in API Reference](https://openrouter.ai/docs/api-reference/beta-responses/create-api-alpha-responses)

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
---
url: "https://openrouter.ai/docs/api-reference/beta-responses/create-api-alpha-responses"
title: "Create a response | OpenRouter | Documentation"
---

Creates a streaming or non-streaming response using OpenResponses API format

### Authentication

AuthorizationBearer

API key as bearer token in Authorization header

### Request

This endpoint expects an object.

### Response

Successful response

objectenum

Allowed values:response

created\_atdouble

modelstring

outputlist of maps from strings to any or objects

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
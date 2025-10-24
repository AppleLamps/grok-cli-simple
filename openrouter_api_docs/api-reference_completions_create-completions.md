---
url: "https://openrouter.ai/docs/api-reference/completions/create-completions"
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
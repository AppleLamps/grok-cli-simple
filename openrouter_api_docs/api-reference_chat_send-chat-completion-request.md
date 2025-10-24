---
url: "https://openrouter.ai/docs/api-reference/chat/send-chat-completion-request"
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

seedinteger or nullOptional

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

How do I integrate OpenRouter with LangChain for Python applications?

What is prompt caching and how can I use it to reduce costs with OpenRouter?

How do I enable web search capabilities to ground my AI model responses with real-time information?

What file formats does OpenRouter support and how do I send PDF documents to models?

How do I implement streaming responses and structured outputs with OpenRouter's API?

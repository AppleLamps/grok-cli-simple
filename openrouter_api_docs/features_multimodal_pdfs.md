---
url: "https://openrouter.ai/docs/features/multimodal/pdfs"
title: "OpenRouter PDF Inputs | Complete Documentation | OpenRouter | Documentation"
---

OpenRouter supports PDF processing through the `/api/v1/chat/completions` API. PDFs can be sent as **direct URLs** or **base64-encoded data URLs** in the messages array, via the file content type. This feature works on **any** model on OpenRouter.

**URL support**: Send publicly accessible PDFs directly without downloading or encoding

**Base64 support**: Required for local files or private documents that aren’t publicly accessible

PDFs also work in the chat room for interactive testing.

When a model supports file input natively, the PDF is passed directly to the
model. When the model does not support file input natively, OpenRouter will
parse the file and pass the parsed results to the requested model.

You can send both PDFs and other file types in the same request.

## Plugin Configuration

To configure PDF processing, use the `plugins` parameter in your request. OpenRouter provides several PDF processing engines with different capabilities and pricing:

```code-block text-sm

```

## Pricing

OpenRouter provides several PDF processing engines:

1. `"mistral-ocr"`: Best for scanned documents or
PDFs with images ($2 per 1,000 pages).
2. `"pdf-text"`: Best for well-structured PDFs with
clear text content (Free).
3. `"native"`: Only available for models that
support file input natively (charged as input tokens).

If you don’t explicitly specify an engine, OpenRouter will default first to the model’s native file processing capabilities, and if that’s not available, we will use the `"mistral-ocr"` engine.

## Using PDF URLs

For publicly accessible PDFs, you can send the URL directly without needing to download and encode the file:

PythonTypeScript

```code-block text-sm

```

PDF URLs work with all processing engines. For Mistral OCR, the URL is passed directly to the service. For other engines, OpenRouter fetches the PDF and processes it internally.

## Using Base64 Encoded PDFs

For local PDF files or when you need to send PDF content directly, you can base64 encode the file:

PythonTypeScript

```code-block text-sm

```

## Skip Parsing Costs

When you send a PDF to the API, the response may include file annotations in the assistant’s message. These annotations contain structured information about the PDF document that was parsed. By sending these annotations back in subsequent requests, you can avoid re-parsing the same PDF document multiple times, which saves both processing time and costs.

Here’s how to reuse file annotations:

PythonTypeScript

```code-block text-sm

```

When you include the file annotations from a previous response in your
subsequent requests, OpenRouter will use this pre-parsed information instead
of re-parsing the PDF, which saves processing time and costs. This is
especially beneficial for large documents or when using the `mistral-ocr`
engine which incurs additional costs.

## Response Format

The API will return a response in the following format:

```code-block text-sm

```

Ask AI

Assistant

Hi, I'm an AI assistant with access to documentation and other content.

Tip: you can toggle this pane with

`⌘`

+

`/`

Suggestions

How do I use OpenRouter's prompt caching to reduce costs?

What are the steps to integrate OpenRouter with LangChain in Python?

How can I send a PDF document to an AI model through OpenRouter?

How do I enable web search capabilities in my model responses?

How do I implement streaming responses with OpenRouter's API?
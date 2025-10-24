---
url: "https://openrouter.ai/docs/features/multimodal/images"
title: "OpenRouter Image Inputs | Complete Documentation | OpenRouter | Documentation"
---

Requests with images, to multimodel models, are available via the `/api/v1/chat/completions` API with a multi-part `messages` parameter. The `image_url` can either be a URL or a base64-encoded image. Note that multiple images can be sent in separate content array entries. The number of images you can send in a single request varies per provider and per model. Due to how the content is parsed, we recommend sending the text prompt first, then the images. If the images must come first, we recommend putting it in the system prompt.

OpenRouter supports both **direct URLs** and **base64-encoded data** for images:

- **URLs**: More efficient for publicly accessible images as they don’t require local encoding
- **Base64**: Required for local files or private images that aren’t publicly accessible

### Using Image URLs

Here’s how to send an image using a URL:

PythonTypeScript

```code-block text-sm

```

### Using Base64 Encoded Images

For locally stored images, you can send them using base64 encoding. Here’s how to do it:

PythonTypeScript

```code-block text-sm

```

Supported image content types are:

- `image/png`
- `image/jpeg`
- `image/webp`
- `image/gif`

Ask AI

Assistant

Hi, I'm an AI assistant with access to documentation and other content.

Tip: you can toggle this pane with

`⌘`

+

`/`

Suggestions

How do I integrate OpenRouter with LangChain for Python and JavaScript?

What is prompt caching and which models support it on OpenRouter?

How can I send PDF documents to OpenRouter models using the API?

What is the web search feature and how do I enable it for model responses?

How do I implement structured outputs with JSON Schema validation?
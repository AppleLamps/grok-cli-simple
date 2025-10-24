---
url: "https://openrouter.ai/docs/features/multimodal/audio"
title: "OpenRouter Audio Inputs | Complete Documentation | OpenRouter | Documentation"
---

OpenRouter supports sending audio files to compatible models via the API. This guide will show you how to work with audio using our API.

**Note**: Audio files must be **base64-encoded** \- direct URLs are not supported for audio content.

## Audio Inputs

Requests with audio files to compatible models are available via the `/api/v1/chat/completions` API with the `input_audio` content type. Audio files must be base64-encoded and include the format specification. Note that only models with audio processing capabilities will handle these requests.

You can search for models that support audio by filtering to audio input modality on our [Models page](https://openrouter.ai/models?fmt=cards&input_modalities=audio).

### Sending Audio Files

Here’s how to send an audio file for processing:

PythonTypeScript

```code-block text-sm

```

Supported audio formats are:

- `wav`
- `mp3`

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
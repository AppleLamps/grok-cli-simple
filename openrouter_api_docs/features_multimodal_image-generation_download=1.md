---
url: "https://openrouter.ai/docs/features/multimodal/image-generation?download=1"
title: "OpenRouter Image Generation | Complete Documentation | OpenRouter | Documentation"
---

OpenRouter supports image generation through models that have `"image"` in their `output_modalities`. These models can create images from text prompts when you specify the appropriate modalities in your request.

## Model Discovery

You can find image generation models in several ways:

### On the Models Page

Visit the [Models page](https://openrouter.ai/models) and filter by output modalities to find models capable of image generation. Look for models that list `"image"` in their output modalities.

### In the Chatroom

When using the [Chatroom](https://openrouter.ai/chat), click the **Image** button to automatically filter and select models with image generation capabilities. If no image-capable model is active, you’ll be prompted to add one.

## API Usage

To generate images, send a request to the `/api/v1/chat/completions` endpoint with the `modalities` parameter set to include both `"image"` and `"text"`.

### Basic Image Generation

PythonTypeScript

```code-block text-sm

```

### Image Aspect Ratio Configuration

Gemini image-generation models let you request specific aspect ratios by setting `image_config.aspect_ratio`. Read more about using Gemini Image Gen models here: [https://ai.google.dev/gemini-api/docs/image-generation](https://ai.google.dev/gemini-api/docs/image-generation)

**Supported aspect ratios:**

- `1:1` → 1024×1024 (default)
- `2:3` → 832×1248
- `3:2` → 1248×832
- `3:4` → 864×1184
- `4:3` → 1184×864
- `4:5` → 896×1152
- `5:4` → 1152×896
- `9:16` → 768×1344
- `16:9` → 1344×768
- `21:9` → 1536×672

PythonTypeScript

```code-block text-sm

```

### Streaming Image Generation

Image generation also works with streaming responses:

PythonTypeScript

```code-block text-sm

```

## Response Format

When generating images, the assistant message includes an `images` field containing the generated images:

```code-block text-sm

```

### Image Format

- **Format**: Images are returned as base64-encoded data URLs
- **Types**: Typically PNG format ( `data:image/png;base64,`)
- **Multiple Images**: Some models can generate multiple images in a single response
- **Size**: Image dimensions vary by model capabilities

## Model Compatibility

Not all models support image generation. To use this feature:

1. **Check Output Modalities**: Ensure the model has `"image"` in its `output_modalities`
2. **Set Modalities Parameter**: Include `"modalities": ["image", "text"]` in your request
3. **Use Compatible Models**: Examples include:
   - `google/gemini-2.5-flash-image-preview`
   - Other models with image generation capabilities

## Best Practices

- **Clear Prompts**: Provide detailed descriptions for better image quality
- **Model Selection**: Choose models specifically designed for image generation
- **Error Handling**: Check for the `images` field in responses before processing
- **Rate Limits**: Image generation may have different rate limits than text generation
- **Storage**: Consider how you’ll handle and store the base64 image data

## Troubleshooting

**No images in response?**

- Verify the model supports image generation ( `output_modalities` includes `"image"`)
- Ensure you’ve included `"modalities": ["image", "text"]` in your request
- Check that your prompt is requesting image generation

**Model not found?**

- Use the [Models page](https://openrouter.ai/models) to find available image generation models
- Filter by output modalities to see compatible models

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
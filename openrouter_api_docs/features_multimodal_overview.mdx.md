---
url: "https://openrouter.ai/docs/features/multimodal/overview.mdx"
title: undefined
---

```
# Multimodal Capabilities

> Send images, PDFs, and audio to OpenRouter models through our unified API.

OpenRouter supports multiple input modalities beyond text, allowing you to send images, PDFs, and audio files to compatible models through our unified API. This enables rich multimodal interactions for a wide variety of use cases.

## Supported Modalities

### Images

Send images to vision-capable models for analysis, description, OCR, and more. OpenRouter supports multiple image formats and both URL-based and base64-encoded images.

[Learn more about image inputs →](/docs/features/multimodal/images)

### Image Generation

Generate images from text prompts using AI models with image output capabilities. OpenRouter supports various image generation models that can create high-quality images based on your descriptions.

[Learn more about image generation →](/docs/features/multimodal/image-generation)

### PDFs

Process PDF documents with any model on OpenRouter. Our intelligent PDF parsing system extracts text and handles both text-based and scanned documents.

[Learn more about PDF processing →](/docs/features/multimodal/pdfs)

### Audio

Send audio files to speech-capable models for transcription, analysis, and processing. OpenRouter supports common audio formats with automatic routing to compatible models.

[Learn more about audio inputs →](/docs/features/multimodal/audio)

## Getting Started

All multimodal inputs use the same `/api/v1/chat/completions` endpoint with the `messages` parameter. Different content types are specified in the message content array:

* **Images**: Use `image_url` content type
* **PDFs**: Use `file` content type with PDF data
* **Audio**: Use `input_audio` content type

You can combine multiple modalities in a single request, and the number of files you can send varies by provider and model.

## Model Compatibility

Not all models support every modality. OpenRouter automatically filters available models based on your request content:

* **Vision models**: Required for image processing
* **File-compatible models**: Can process PDFs natively or through our parsing system
* **Audio-capable models**: Required for audio input processing

Use our [Models page](https://openrouter.ai/models) to find models that support your desired input modalities.

## Input Format Support

OpenRouter supports both **direct URLs** and **base64-encoded data** for multimodal inputs:

### URLs (Recommended for public content)

* **Images**: `https://example.com/image.jpg`
* **PDFs**: `https://example.com/document.pdf`
* **Audio**: Not supported via URL (base64 only)

### Base64 Encoding (Required for local files)

* **Images**: `data:image/jpeg;base64,{base64_data}`
* **PDFs**: `data:application/pdf;base64,{base64_data}`
* **Audio**: Raw base64 string with format specification

<Info>
  URLs are more efficient for large files as they don't require local encoding and reduce request payload size. Base64 encoding is required for local files or when the content is not publicly accessible.
</Info>

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="Can I mix different modalities in one request?">
    Yes! You can send text, images, PDFs, and audio in the same request. The model will process all inputs together.
  </Accordion>

  <Accordion title="How is multimodal content priced?">
    * **Images**: Typically priced per image or as input tokens
    * **PDFs**: Free text extraction, paid OCR processing, or native model pricing
    * **Audio**: Priced as input tokens based on duration
  </Accordion>

  <Accordion title="What about video support?">
    Video modality support is coming soon! We're working on adding video processing capabilities to expand our multimodal offerings.
  </Accordion>
</AccordionGroup>

```
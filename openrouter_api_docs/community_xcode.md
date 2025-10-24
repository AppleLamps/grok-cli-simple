---
url: "https://openrouter.ai/docs/community/xcode"
title: "Xcode Integration | OpenRouter Apple Intelligence Support | OpenRouter | Documentation"
---

## Using Xcode with Apple Intelligence

[Apple Intelligence](https://developer.apple.com/apple-intelligence/) in Xcode 26 provides built-in AI assistance for coding. By integrating OpenRouter, you can access hundreds of AI models directly in your Xcode development environment, going far beyond the default ChatGPT integration.

This integration allows you to use models from Anthropic, Google, Meta, and many other providers without leaving your development environment.

### Prerequisites

Apple Intelligence on Xcode is currently in Beta and requires:

- **macOS Tahoe 26.0 Beta** or later
- **[Xcode 26 beta 4](https://developer.apple.com/download/applications/)** or later

### Setup Instructions

#### Step 1: Access Intelligence Settings

Navigate to **Settings > Intelligence > Add a Model Provider** in your macOS system preferences.

![Xcode Intelligence Settings](https://files.buildwithfern.com/openrouter.docs.buildwithfern.com/docs/2025-10-23T05:01:21.355Z/content/pages/community/xcode-setup-1.png)

#### Step 2: Configure OpenRouter Provider

In the “Add a Model Provider” dialog, enter the following details:

- **URL**: `https://openrouter.ai/api`
  - **Important**: Do not add `/v1` at the end of the endpoint like you typically would for direct API calls
- **API Key Header**: `api_key`
- **API Key**: Your OpenRouter API key (starts with `sk-or-v1-`)
- **Description**: `OpenRouter` (or any name you prefer)

Click **Add** to save the configuration.

![OpenRouter Configuration](https://files.buildwithfern.com/openrouter.docs.buildwithfern.com/docs/2025-10-23T05:01:21.355Z/content/pages/community/xcode-setup-2.png)

#### Step 3: Browse Available Models

Once configured, click on **OpenRouter** to see all available models. Since OpenRouter offers hundreds of models, you should bookmark your favorite models for quick access. Bookmarked models will appear at the top of the list, making them easily accessible from within the pane whenever you need them.

![Available Models](https://files.buildwithfern.com/openrouter.docs.buildwithfern.com/docs/2025-10-23T05:01:21.355Z/content/pages/community/xcode-setup-3.png)

You’ll have access to models from various providers including:

- Anthropic Claude models
- Google Gemini models
- Meta Llama models
- OpenAI GPT models
- And hundreds more

![Extended Model List](https://files.buildwithfern.com/openrouter.docs.buildwithfern.com/docs/2025-10-23T05:01:21.355Z/content/pages/community/xcode-setup-4.png)

#### Step 4: Start Using AI in Xcode

Head back to the chat interface (icon at the top) and start chatting with your selected models directly in Xcode.

![Xcode Chat Interface](https://files.buildwithfern.com/openrouter.docs.buildwithfern.com/docs/2025-10-23T05:01:21.355Z/content/pages/community/xcode-setup-5.png)

### Using Apple Intelligence Features

Once configured, you can use Apple Intelligence features in Xcode with OpenRouter models:

- **Code Completion**: Get intelligent code suggestions
- **Code Explanation**: Ask questions about your code
- **Refactoring Assistance**: Get help improving your code structure
- **Documentation Generation**: Generate comments and documentation

![Apple Intelligence Interface](https://files.buildwithfern.com/openrouter.docs.buildwithfern.com/docs/2025-10-23T05:01:21.355Z/content/pages/community/xcode-setup-6.png)

_Image credit: [Apple Developer Documentation](https://developer.apple.com/documentation/Xcode/writing-code-with-intelligence-in-xcode)_

### Learn More

- **Apple Intelligence Documentation**: [Writing Code with Intelligence in Xcode](https://developer.apple.com/documentation/Xcode/writing-code-with-intelligence-in-xcode)
- **OpenRouter Quick Start**: [Getting Started with OpenRouter](https://openrouter.ai/docs/quickstart)
- **Available Models**: [Browse OpenRouter Models](https://openrouter.ai/models)

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
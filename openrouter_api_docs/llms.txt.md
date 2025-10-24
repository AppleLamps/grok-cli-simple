---
url: "https://openrouter.ai/docs/llms.txt"
title: undefined
---

```
# OpenRouter | Documentation

## Docs

- [Quickstart](https://openrouter.ai/docs/quickstart.mdx): Get started with OpenRouter's unified API for hundreds of AI models. Learn how to integrate using OpenAI SDK, direct API calls, or third-party frameworks.
- [Frequently Asked Questions](https://openrouter.ai/docs/faq.mdx): Find answers to commonly asked questions about OpenRouter's unified API, model access, pricing, and integration.
- [Principles](https://openrouter.ai/docs/overview/principles.mdx): Learn about OpenRouter's guiding principles and mission. Understand our commitment to price optimization, standardized APIs, and high availability in AI model deployment.
- [Models](https://openrouter.ai/docs/overview/models.mdx): Access all major language models (LLMs) through OpenRouter's unified API. Browse available models, compare capabilities, and integrate with your preferred provider.
- [Privacy, Logging, and Data Collection](https://openrouter.ai/docs/features/privacy-and-logging.mdx): Learn how OpenRouter & its providers handle your data, including logging and data collection.
- [Zero Data Retention](https://openrouter.ai/docs/features/zdr.mdx): Learn how OpenRouter gives you control over your data
- [Model Routing](https://openrouter.ai/docs/features/model-routing.mdx): Route requests dynamically between AI models. Learn how to use OpenRouter's Auto Router and model fallback features for optimal performance and reliability.
- [Provider Routing](https://openrouter.ai/docs/features/provider-routing.mdx): Route AI model requests across multiple providers intelligently. Learn how to optimize for cost, performance, and reliability with OpenRouter's provider routing.
- [Latency and Performance](https://openrouter.ai/docs/features/latency-and-performance.mdx): Learn about OpenRouter's performance characteristics, latency optimizations, and best practices for achieving optimal response times.
- [Presets](https://openrouter.ai/docs/features/presets.mdx): Learn how to use OpenRouter's presets to manage model configurations, system prompts, and parameters across your applications.
- [Prompt Caching](https://openrouter.ai/docs/features/prompt-caching.mdx): Reduce your AI model costs with OpenRouter's prompt caching feature. Learn how to cache and reuse responses across OpenAI, Anthropic Claude, and DeepSeek models.
- [Structured Outputs](https://openrouter.ai/docs/features/structured-outputs.mdx): Enforce JSON Schema validation on AI model responses. Get consistent, type-safe outputs and avoid parsing errors with OpenRouter's structured output feature.
- [Tool & Function Calling](https://openrouter.ai/docs/features/tool-calling.mdx): Use tools (or functions) in your prompts with OpenRouter. Learn how to use tools with OpenAI, Anthropic, and other models that support tool calling.
- [Multimodal Capabilities](https://openrouter.ai/docs/features/multimodal/overview.mdx): Send images, PDFs, and audio to OpenRouter models through our unified API.
- [Image Inputs](https://openrouter.ai/docs/features/multimodal/images.mdx): Send images to vision models through the OpenRouter API.
- [Image Generation](https://openrouter.ai/docs/features/multimodal/image-generation.mdx): Generate images using AI models through the OpenRouter API.
- [PDF Inputs](https://openrouter.ai/docs/features/multimodal/pdfs.mdx): Send PDF documents to any model on OpenRouter.
- [Audio Inputs](https://openrouter.ai/docs/features/multimodal/audio.mdx): Send audio files to speech-capable models through the OpenRouter API.
- [Message Transforms](https://openrouter.ai/docs/features/message-transforms.mdx): Transform and optimize messages before sending them to AI models. Learn about middle-out compression and context window optimization with OpenRouter.
- [Uptime Optimization](https://openrouter.ai/docs/features/uptime-optimization.mdx): Learn how OpenRouter maximizes AI model uptime through real-time monitoring, intelligent routing, and automatic fallbacks across multiple providers.
- [Web Search](https://openrouter.ai/docs/features/web-search.mdx): Enable real-time web search capabilities in your AI model responses. Add factual, up-to-date information to any model's output with OpenRouter's web search feature.
- [Zero Completion Insurance](https://openrouter.ai/docs/features/zero-completion-insurance.mdx): Learn how OpenRouter protects users from being charged for failed or empty AI responses with zero completion insurance.
- [Provisioning API Keys](https://openrouter.ai/docs/features/provisioning-api-keys.mdx): Manage OpenRouter API keys programmatically through dedicated management endpoints. Create, read, update, and delete API keys for automated key distribution and control.
- [App Attribution](https://openrouter.ai/docs/app-attribution.mdx): Learn how to attribute your API usage to your app and appear in OpenRouter's app rankings and model analytics.
- [API Reference](https://openrouter.ai/docs/api-reference/overview.mdx): Comprehensive guide to OpenRouter's API. Learn about request/response schemas, authentication, parameters, and integration with multiple AI model providers.
- [Streaming](https://openrouter.ai/docs/api-reference/streaming.mdx): Learn how to implement streaming responses with OpenRouter's API. Complete guide to Server-Sent Events (SSE) and real-time model outputs.
- [Limits](https://openrouter.ai/docs/api-reference/limits.mdx): Learn about OpenRouter's API rate limits, credit-based quotas, and DDoS protection. Configure and monitor your model usage limits effectively.
- [Authentication](https://openrouter.ai/docs/api-reference/authentication.mdx): Learn how to authenticate with OpenRouter using API keys and Bearer tokens. Complete guide to secure authentication methods and best practices.
- [Parameters](https://openrouter.ai/docs/api-reference/parameters.mdx): Learn about all available parameters for OpenRouter API requests. Configure temperature, max tokens, top_p, and other model-specific settings.
- [Errors](https://openrouter.ai/docs/api-reference/errors.mdx): Learn how to handle errors in OpenRouter API interactions. Comprehensive guide to error codes, messages, and best practices for error handling.
- [Responses API Beta](https://openrouter.ai/docs/api-reference/responses-api/overview.mdx): Beta version of OpenRouter's OpenAI-compatible Responses API. Stateless transformation layer with support for reasoning, tool calling, and web search.
- [Basic Usage](https://openrouter.ai/docs/api-reference/responses-api/basic-usage.mdx): Learn the basics of OpenRouter's Responses API Beta with simple text input examples and response handling.
- [Reasoning](https://openrouter.ai/docs/api-reference/responses-api/reasoning.mdx): Access advanced reasoning capabilities with configurable effort levels and encrypted reasoning chains using OpenRouter's Responses API Beta.
- [Tool Calling](https://openrouter.ai/docs/api-reference/responses-api/tool-calling.mdx): Integrate function calling with support for parallel execution and complex tool interactions using OpenRouter's Responses API Beta.
- [Web Search](https://openrouter.ai/docs/api-reference/responses-api/web-search.mdx): Enable web search capabilities with real-time information retrieval and citation annotations using OpenRouter's Responses API Beta.
- [Error Handling](https://openrouter.ai/docs/api-reference/responses-api/error-handling.mdx): Learn how to handle errors in OpenRouter's Responses API Beta with the basic error response format.
- [BYOK](https://openrouter.ai/docs/use-cases/byok.mdx): Learn how to use your existing AI provider keys with OpenRouter. Integrate your own API keys while leveraging OpenRouter's unified interface and features.
- [Crypto API](https://openrouter.ai/docs/use-cases/crypto-api.mdx): Learn how to purchase OpenRouter credits using cryptocurrency. Complete guide to Coinbase integration, supported chains, and automated credit purchases.
- [OAuth PKCE](https://openrouter.ai/docs/use-cases/oauth-pkce.mdx): Implement secure user authentication with OpenRouter using OAuth PKCE. Complete guide to setting up and managing OAuth authentication flows.
- [Using MCP Servers with OpenRouter](https://openrouter.ai/docs/use-cases/mcp-servers.mdx): Learn how to use MCP Servers with OpenRouter
- [Organization Management](https://openrouter.ai/docs/use-cases/organization-management.mdx): Learn how to create and manage organizations on OpenRouter for team collaboration, shared credits, and centralized API management.
- [Provider Integration](https://openrouter.ai/docs/use-cases/for-providers.mdx): Learn how to integrate your AI models with OpenRouter. Complete guide for providers to make their models available through OpenRouter's unified API.
- [Reasoning Tokens](https://openrouter.ai/docs/use-cases/reasoning-tokens.mdx): Learn how to use reasoning tokens to enhance AI model outputs. Implement step-by-step reasoning traces for better decision making and transparency.
- [Usage Accounting](https://openrouter.ai/docs/use-cases/usage-accounting.mdx): Learn how to track AI model usage including prompt tokens, completion tokens, and cached tokens without additional API calls.
- [User Tracking](https://openrouter.ai/docs/use-cases/user-tracking.mdx): Learn how to use the user parameter to track your own user IDs with OpenRouter. Improve caching performance and get detailed reporting on your sub-users.
- [Frameworks and Integrations Overview](https://openrouter.ai/docs/community/frameworks-and-integrations-overview.mdx): Integrate OpenRouter using popular frameworks and SDKs. Complete guides for OpenAI SDK, LangChain, PydanticAI, and Vercel AI SDK integration.
- [Effect AI SDK](https://openrouter.ai/docs/community/effect-ai-sdk.mdx): Integrate OpenRouter using the Effect AI SDK. Complete guide for integrating the Effect AI SDK with OpenRouter.
- [LangChain](https://openrouter.ai/docs/community/lang-chain.mdx): Integrate OpenRouter using LangChain framework. Complete guide for LangChain integration with OpenRouter for Python and JavaScript.
- [Langfuse](https://openrouter.ai/docs/community/langfuse.mdx): Integrate OpenRouter using Langfuse for observability and tracing. Complete guide for Langfuse integration with OpenRouter for Python applications.
- [Mastra](https://openrouter.ai/docs/community/mastra.mdx): Integrate OpenRouter using Mastra framework. Complete guide for Mastra integration with OpenRouter for unified AI model access.
- [OpenAI SDK](https://openrouter.ai/docs/community/open-ai-sdk.mdx): Integrate OpenRouter using the official OpenAI SDK. Complete guide for OpenAI SDK integration with OpenRouter for Python and TypeScript.
- [PydanticAI](https://openrouter.ai/docs/community/pydantic-ai.mdx): Integrate OpenRouter using PydanticAI framework. Complete guide for PydanticAI integration with OpenRouter for Python applications.
- [Vercel AI SDK](https://openrouter.ai/docs/community/vercel-ai-sdk.mdx): Integrate OpenRouter using Vercel AI SDK. Complete guide for Vercel AI SDK integration with OpenRouter for Next.js applications.
- [Xcode](https://openrouter.ai/docs/community/xcode.mdx): Integrate OpenRouter with Apple Intelligence in Xcode 26. Complete setup guide for accessing hundreds of AI models directly in your Xcode development environment.
- [Zapier](https://openrouter.ai/docs/community/zapier.mdx): Build powerful AI automations by connecting OpenRouter with 8000+ apps through Zapier. Access 500+ AI models in your workflows.

## API Docs

- API Reference > beta.responses [Create a response](https://openrouter.ai/docs/api-reference/beta-responses/create-api-alpha-responses.mdx)
- API Reference > Analytics [Get user activity grouped by endpoint](https://openrouter.ai/docs/api-reference/analytics/get-user-activity.mdx)
- API Reference > Credits [Get remaining credits](https://openrouter.ai/docs/api-reference/credits/get-credits.mdx)
- API Reference > Credits [Create a Coinbase charge for crypto payment](https://openrouter.ai/docs/api-reference/credits/create-coinbase-charge.mdx)
- API Reference > Generations [Get request & usage metadata for a generation](https://openrouter.ai/docs/api-reference/generations/get-generation.mdx)
- API Reference > Models [Get total count of available models](https://openrouter.ai/docs/api-reference/models/list-models-count.mdx)
- API Reference > Models [List all models and their properties](https://openrouter.ai/docs/api-reference/models/get-models.mdx)
- API Reference > Models [List models filtered by user provider preferences](https://openrouter.ai/docs/api-reference/models/list-models-user.mdx)
- API Reference > Endpoints [List all endpoints for a model](https://openrouter.ai/docs/api-reference/endpoints/list-endpoints.mdx)
- API Reference > Endpoints [Preview the impact of ZDR on the available endpoints](https://openrouter.ai/docs/api-reference/endpoints/list-endpoints-zdr.mdx)
- API Reference > Parameters [Get a model's supported parameters and data about which are most popular](https://openrouter.ai/docs/api-reference/parameters/get-parameters.mdx)
- API Reference > Providers [List all providers](https://openrouter.ai/docs/api-reference/providers/list-providers.mdx)
- API Reference > API Keys [List API keys](https://openrouter.ai/docs/api-reference/api-keys/list.mdx)
- API Reference > API Keys [Create a new API key](https://openrouter.ai/docs/api-reference/api-keys/create-keys.mdx)
- API Reference > API Keys [Get a single API key](https://openrouter.ai/docs/api-reference/api-keys/get-key.mdx)
- API Reference > API Keys [Delete an API key](https://openrouter.ai/docs/api-reference/api-keys/delete-keys.mdx)
- API Reference > API Keys [Update an API key](https://openrouter.ai/docs/api-reference/api-keys/update-keys.mdx)
- API Reference > API Keys [Get current API key](https://openrouter.ai/docs/api-reference/api-keys/get-current-key.mdx)
- API Reference > Chat [Create a chat completion](https://openrouter.ai/docs/api-reference/chat/send-chat-completion-request.mdx)
- API Reference > Completions [Create a completion](https://openrouter.ai/docs/api-reference/completions/create-completions.mdx)
```
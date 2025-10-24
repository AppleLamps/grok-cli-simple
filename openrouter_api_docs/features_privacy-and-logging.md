---
url: "https://openrouter.ai/docs/features/privacy-and-logging"
title: "Privacy, Logging, and Data Collection | Keeping your data safe | OpenRouter | Documentation"
---

When using AI through OpenRouter, whether via the chat interface or the API, your prompts and responses go through multiple touchpoints. You have control over how your data is handled at each step.

This page is designed to give a practical overview of how your data is handled, stored, and used. More information is available in the [privacy policy](https://openrouter.ai/privacy) and [terms of service](https://openrouter.ai/terms).

## Within OpenRouter

OpenRouter does not store your prompts or responses, _unless_ you have explicitly opted in to prompt logging in your account settings. It’s as simple as that.

OpenRouter samples a small number of prompts for categorization to power our reporting and model ranking. If you are not opted in to prompt logging, any categorization of your prompts is stored completely anonymously and never associated with your account or user ID. The categorization is done by model with a zero-data-retention policy.

OpenRouter does store metadata (e.g. number of prompt and completion tokens, latency, etc) for each request. This is used to power our reporting and model ranking, and your [activity feed](https://openrouter.ai/activity).

## Provider Policies

### Training on Prompts

Each provider on OpenRouter has its own data handling policies. We reflect those policies in structured data on each AI endpoint that we offer.

On your account settings page, you can set whether you would like to allow routing to providers that may train on your data (according to their own policies). There are separate settings for paid and free models.

Wherever possible, OpenRouter works with providers to ensure that prompts will not be trained on, but there are exceptions. If you opt out of training in your account settings, OpenRouter will not route to providers that train. This setting has no bearing on OpenRouter’s own policies and what we do with your prompts.

##### Data Policy Filtering

You can [restrict individual requests](https://openrouter.ai/docs/features/provider-routing#requiring-providers-to-comply-with-data-policies)
to only use providers with a certain data policy.

This is also available as an account-wide setting in [your privacy settings](https://openrouter.ai/settings/privacy).

### Data Retention & Logging

Providers also have their own data retention policies, often for compliance reasons. OpenRouter does not have routing rules that change based on data retention policies of providers, but the retention policies as reflected in each provider’s terms are shown below. Any user of OpenRouter can ignore providers that don’t meet their own data retention requirements.

The full terms of service for each provider are linked from the provider’s page, and aggregated in the [documentation](https://openrouter.ai/docs/features/provider-routing#terms-of-service).

| Provider | Data Retention | Train on Prompts |
| --- | --- | --- |
| AI21 | Prompts are retained for unknown period | ✓ Does not train |
| AionLabs | Prompts are retained for unknown period | ✓ Does not train |
| Alibaba Cloud Int. | Prompts are retained for unknown period | ✓ Does not train |
| Amazon Bedrock | Zero retention | ✓ Does not train |
| Anthropic | Retained for 30 days | ✓ Does not train |
| AtlasCloud | Zero retention | ✓ Does not train |
| Atoma | Zero retention | ✓ Does not train |
| Avian.io | Prompts are retained for unknown period | ✓ Does not train |
| Azure | Retained for 30 days | ✓ Does not train |
| Baseten | Zero retention | ✓ Does not train |
| Cerebras | Zero retention | ✓ Does not train |
| Chutes | Prompts are retained for unknown period | ✕ May train |
| Cirrascale | Prompts are retained for unknown period | ✕ May train |
| Clarifai | Zero retention | ✓ Does not train |
| Cloudflare | Prompts are retained for unknown period | ✓ Does not train |
| Cohere | Retained for 30 days | ✓ Does not train |
| CrofAI | Prompts are retained for unknown period | ✓ Does not train |
| Crusoe | Prompts are retained for unknown period | ✓ Does not train |
| DeepInfra | Zero retention | ✓ Does not train |
| DeepSeek | Prompts are retained for unknown period | ✕ May train |
| Enfer | Prompts are retained for unknown period | ✓ Does not train |
| FakeProvider | Zero retention | ✓ Does not train |
| Featherless | Zero retention | ✓ Does not train |
| Fireworks | Zero retention | ✓ Does not train |
| Friendli | Prompts are retained for unknown period | ✓ Does not train |
| GMICloud | Prompts are retained for unknown period | ✓ Does not train |
| Google AI Studio | Retained for 55 days | ✓ Does not train |
| Google Vertex | Zero retention | ✓ Does not train |
| Groq | Zero retention | ✓ Does not train |
| Hyperbolic | Zero retention | ✓ Does not train |
| Inception | Zero retention | ✓ Does not train |
| inference.net | Prompts are retained for unknown period | ✓ Does not train |
| Infermatic | Zero retention | ✓ Does not train |
| Inflection | Retained for 30 days | ✓ Does not train |
| kluster.ai | Zero retention | ✓ Does not train |
| Lambda | Prompts are retained for unknown period | ✓ Does not train |
| Liquid | Prompts are retained for unknown period | ✓ Does not train |
| Mancer (private) | Zero retention | ✓ Does not train |
| Meta | Retained for 30 days | ✓ Does not train |
| Minimax | Prompts are retained for unknown period | ✓ Does not train |
| Mistral | Retained for 30 days | ✓ Does not train |
| Modular | Zero retention | ✓ Does not train |
| Moonshot AI | Zero retention | ✓ Does not train |
| Morph | Zero retention | ✓ Does not train |
| nCompass | Prompts are retained for unknown period | ✓ Does not train |
| Nebius AI Studio | Zero retention | ✓ Does not train |
| NextBit | Zero retention | ✓ Does not train |
| Nineteen | Prompts are retained for unknown period | ✕ May train |
| NovitaAI | Prompts are retained for unknown period | ✓ Does not train |
| NVIDIA | Zero retention | ✓ Does not train |
| OpenAI | Prompts are retained for unknown period | ✓ Does not train |
| OpenInference | Prompts are retained for unknown period | ✕ May train |
| Parasail | Zero retention | ✓ Does not train |
| Perplexity | Zero retention | ✓ Does not train |
| Phala | Zero retention | ✓ Does not train |
| Relace | Zero retention | ✓ Does not train |
| SambaNova | Zero retention | ✓ Does not train |
| SiliconFlow | Zero retention | ✓ Does not train |
| Stealth | Prompts are retained for unknown period | ✕ May train |
| Switchpoint | Prompts are retained for unknown period | ✓ Does not train |
| Targon | Prompts are retained for unknown period | ✕ May train |
| Together | Zero retention | ✓ Does not train |
| Ubicloud | Prompts are retained for unknown period | ✓ Does not train |
| Venice | Zero retention | ✓ Does not train |
| Weights & Biases | Prompts are retained for unknown period | ✓ Does not train |
| xAI | Retained for 30 days | ✓ Does not train |
| Z.AI | Zero retention | ✓ Does not train |

## Enterprise EU in-region routing

For enterprise customers, OpenRouter supports EU in-region routing. When enabled for your account, your prompts and completions are processed within the European Union and do not leave the EU. Use the base URL [http://eu.openrouter.ai](http://eu.openrouter.ai/) for API requests to keep traffic and data within Europe. This feature is only enabled for enterprise customers by request.

If you’re interested, please contact our enterprise team at [https://openrouter.ai/enterprise/form](https://openrouter.ai/enterprise/form).

Ask AI

Assistant

Hi, I'm an AI assistant with access to documentation and other content.

Tip: you can toggle this pane with

`⌘`

+

`/`

Suggestions

How can I integrate OpenRouter with LangChain for Python and JavaScript development?

What is prompt caching and how can I use it to reduce costs with OpenAI and Anthropic models?

How do I enable web search capabilities to add real-time information to my AI model responses?

What are the different provider routing options and how can I optimize for cost and performance?

How can I send PDF documents to models through OpenRouter's API using URLs or base64 encoding?
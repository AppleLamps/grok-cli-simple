---
url: "https://openrouter.ai/docs/features/zdr"
title: "Zero Data Retention | How OpenRouter gives you control over your data | OpenRouter | Documentation"
---

Zero Data Retention (ZDR) means that a provider will not store your data for any period of time.

OpenRouter has a [setting](https://openrouter.ai/settings/privacy) that, when enabled, only allows you to route to endpoints that have a Zero Data Retention policy.

Providers that do not retain your data are also unable to train on your data. However we do have some endpoints & providers who do not train on your data but _do_ retain it (e.g. to scan for abuse or for legal reasons). OpenRouter gives you controls over both of these policies.

## How OpenRouter Manages Data Policies

OpenRouter works with providers to understand each of their data policies and structures the policy data in a way that gives you control over which providers you want to route to.

Note that a provider’s general policy may differ from the specific policy for a given endpoint. OpenRouter keeps track of the specific policy for each endpoint, works with providers to keep these policies up to date, and in some cases creates special agreements with providers to ensure data retention or training policies that are more privacy-focused than their default policies.

If OpenRouter is not able to establish or ascertain a clear policy for a provider or endpoint, we take a conservative stance and assume that the endpoint both retains and trains on data and mark it as such.

A full list of providers and their data policies can be found [here](https://openrouter.ai/docs/features/privacy-and-logging#data-retention--logging). Note that this list shows the default policy for each provider; if there is a particular endpoint that has a policy that differs from the provider default, it may not be available if “ZDR Only” is enabled.

## Per-Request ZDR Enforcement

In addition to the global ZDR setting in your [privacy settings](https://openrouter.ai/settings/privacy), you can enforce Zero Data Retention on a per-request basis using the `zdr` parameter in your API calls.

The request-level `zdr` parameter operates as an “OR” with your account-wide ZDR setting - if either is enabled, ZDR enforcement will be applied. This means the per-request parameter can only be used to ensure ZDR is enabled for a specific request, not to override or disable account-wide ZDR enforcement.

This is useful for customers who don’t want to globally enforce ZDR but need to ensure specific requests only route to ZDR endpoints.

### Usage

Include the `zdr` parameter in your provider preferences:

```code-block text-sm

```

When `zdr` is set to `true`, the request will only be routed to endpoints that have a Zero Data Retention policy. When `zdr` is `false` or not provided, ZDR enforcement will still apply if enabled in your account settings.

## Caching

Some endpoints/models provide implicit caching of prompts. This keeps repeated prompt data in an in-memory cache in the provider’s datacenter, so that the repeated part of the prompt does not need to be re-processed. This can lead to considerable cost savings.

OpenRouter has taken the stance that in-memory caching of prompts is _not_ considered “retaining” data, and we therefore allow endpoints/models with implicit caching to be hit when a ZDR routing policy is in effect.

## OpenRouter’s Retention Policy

OpenRouter itself has a ZDR policy; your prompts are not retained unless you specifically opt in to prompt logging.

## Zero Retention Endpoints

The following endpoints have a ZDR policy. Note that this list is also available progammatically via [https://openrouter.ai/api/v1/endpoints/zdr](https://openrouter.ai/api/v1/endpoints/zdr). It is automatically updated when there are changes to a provider’s data policy.:

| Model | Provider | Implicit Caching |
| --- | --- | --- |
| AlfredPros: CodeLLaMa 7B Instruct Solidity | Featherless | No |
| AllenAI: Olmo 2 32B Instruct | Parasail | No |
| Amazon: Nova Lite 1.0 | Amazon Bedrock | No |
| Amazon: Nova Micro 1.0 | Amazon Bedrock | No |
| Amazon: Nova Pro 1.0 | Amazon Bedrock | No |
| Anthropic: Claude 3 Haiku | Google | No |
| Anthropic: Claude 3 Opus | Google | No |
| Anthropic: Claude 3.5 Haiku | Amazon Bedrock | No |
| Anthropic: Claude 3.5 Haiku | Amazon Bedrock | No |
| Anthropic: Claude 3.5 Haiku | Google | No |
| Anthropic: Claude 3.5 Haiku (2024-10-22) | Google | No |
| Anthropic: Claude 3.5 Sonnet | Amazon Bedrock | No |
| Anthropic: Claude 3.5 Sonnet | Google | No |
| Anthropic: Claude 3.5 Sonnet | Amazon Bedrock | No |
| Anthropic: Claude 3.5 Sonnet | Google | No |
| Anthropic: Claude 3.5 Sonnet (2024-06-20) | Google | No |
| Anthropic: Claude 3.7 Sonnet | Google | No |
| Anthropic: Claude 3.7 Sonnet | Google | No |
| Anthropic: Claude 3.7 Sonnet | Google | No |
| Anthropic: Claude 3.7 Sonnet | Google | No |
| Anthropic: Claude 3.7 Sonnet | Amazon Bedrock | No |
| Anthropic: Claude Haiku 4.5 | Google | No |
| Anthropic: Claude Haiku 4.5 | Amazon Bedrock | No |
| Anthropic: Claude Opus 4 | Google | No |
| Anthropic: Claude Opus 4 | Google | No |
| Anthropic: Claude Opus 4 | Amazon Bedrock | No |
| Anthropic: Claude Opus 4.1 | Google | No |
| Anthropic: Claude Opus 4.1 | Amazon Bedrock | No |
| Anthropic: Claude Opus 4.1 | Google | No |
| Anthropic: Claude Opus 4.1 | Google | No |
| Anthropic: Claude Sonnet 4 | Google | No |
| Anthropic: Claude Sonnet 4 | Google | No |
| Anthropic: Claude Sonnet 4 | Google | No |
| Anthropic: Claude Sonnet 4 | Amazon Bedrock | No |
| Anthropic: Claude Sonnet 4.5 | Google | No |
| Anthropic: Claude Sonnet 4.5 | Google | No |
| Anthropic: Claude Sonnet 4.5 | Amazon Bedrock | No |
| Arcee AI: AFM 4.5B | Together | No |
| Arcee AI: Coder Large | Together | No |
| Arcee AI: Maestro Reasoning | Together | No |
| Arcee AI: Spotlight | Together | No |
| Arcee AI: Virtuoso Large | Together | No |
| Baidu: ERNIE 4.5 300B A47B | SiliconFlow | No |
| ByteDance: UI-TARS 7B | Parasail | No |
| Cogito V2 Preview Llama 109B | Together | No |
| Deep Cogito: Cogito V2 Preview Deepseek 671B | Together | No |
| Deep Cogito: Cogito V2 Preview Llama 405B | Together | No |
| Deep Cogito: Cogito V2 Preview Llama 70B | Together | No |
| DeepSeek: DeepSeek Prover V2 | DeepInfra | No |
| DeepSeek: DeepSeek R1 0528 Qwen3 8B | Parasail | No |
| DeepSeek: DeepSeek V3 | DeepInfra | No |
| DeepSeek: DeepSeek V3 | Nebius | No |
| DeepSeek: DeepSeek V3 0324 | Phala | No |
| DeepSeek: DeepSeek V3 0324 | BaseTen | No |
| DeepSeek: DeepSeek V3 0324 | Parasail | No |
| DeepSeek: DeepSeek V3 0324 | SambaNova | No |
| DeepSeek: DeepSeek V3 0324 | Hyperbolic | No |
| DeepSeek: DeepSeek V3 0324 | Nebius | No |
| DeepSeek: DeepSeek V3 0324 | DeepInfra | No |
| DeepSeek: DeepSeek V3 0324 | Nebius | No |
| DeepSeek: DeepSeek V3 0324 | AtlasCloud | No |
| DeepSeek: DeepSeek V3 0324 | Fireworks | No |
| DeepSeek: DeepSeek V3 0324 | SiliconFlow | No |
| DeepSeek: DeepSeek V3 0324 | Together | No |
| DeepSeek: DeepSeek V3.1 | AtlasCloud | No |
| DeepSeek: DeepSeek V3.1 | Parasail | No |
| DeepSeek: DeepSeek V3.1 | SiliconFlow | No |
| DeepSeek: DeepSeek V3.1 | DeepInfra | No |
| DeepSeek: DeepSeek V3.1 | SambaNova | No |
| DeepSeek: DeepSeek V3.1 | Google | No |
| DeepSeek: DeepSeek V3.1 | Fireworks | No |
| DeepSeek: DeepSeek V3.1 Terminus | SambaNova | No |
| DeepSeek: DeepSeek V3.1 Terminus | DeepInfra | No |
| DeepSeek: DeepSeek V3.1 Terminus | AtlasCloud | No |
| DeepSeek: DeepSeek V3.1 Terminus | DeepInfra | No |
| DeepSeek: DeepSeek V3.1 Terminus | AtlasCloud | No |
| DeepSeek: DeepSeek V3.1 Terminus | SiliconFlow | No |
| DeepSeek: DeepSeek V3.2 Exp | SiliconFlow | No |
| DeepSeek: DeepSeek V3.2 Exp | DeepInfra | No |
| DeepSeek: DeepSeek V3.2 Exp | AtlasCloud | No |
| DeepSeek: R1 | DeepInfra | No |
| DeepSeek: R1 | DeepInfra | No |
| DeepSeek: R1 0528 | Together | No |
| DeepSeek: R1 0528 | SambaNova | No |
| DeepSeek: R1 0528 | Parasail | No |
| DeepSeek: R1 0528 | Google | No |
| DeepSeek: R1 0528 | Nebius | No |
| DeepSeek: R1 0528 | DeepInfra | No |
| DeepSeek: R1 0528 | BaseTen | No |
| DeepSeek: R1 0528 | Nebius | No |
| DeepSeek: R1 0528 | Fireworks | No |
| DeepSeek: R1 0528 | SiliconFlow | No |
| DeepSeek: R1 0528 | Hyperbolic | No |
| DeepSeek: R1 Distill Llama 70B | SambaNova | No |
| DeepSeek: R1 Distill Llama 70B | Together | No |
| DeepSeek: R1 Distill Llama 70B | Together | No |
| DeepSeek: R1 Distill Llama 70B | DeepInfra | No |
| DeepSeek: R1 Distill Qwen 14B | Together | No |
| DeepSeek: R1 Distill Qwen 32B | DeepInfra | No |
| DeepSeek: R1 Distill Qwen 32B | NextBit | No |
| EleutherAI: Llemma 7b | Featherless | No |
| Goliath 120B | NextBit | No |
| Goliath 120B | Mancer 2 | No |
| Google: Gemini 2.0 Flash | Google | No |
| Google: Gemini 2.0 Flash Lite | Google | No |
| Google: Gemini 2.5 Flash | Google | No |
| Google: Gemini 2.5 Flash | Google | No |
| Google: Gemini 2.5 Flash Image (Nano Banana) | Google | No |
| Google: Gemini 2.5 Flash Image Preview (Nano Banana) | Google | No |
| Google: Gemini 2.5 Flash Lite | Google | No |
| Google: Gemini 2.5 Flash Lite Preview 09-2025 | Google | No |
| Google: Gemini 2.5 Flash Preview 09-2025 | Google | No |
| Google: Gemini 2.5 Pro | Google | No |
| Google: Gemini 2.5 Pro | Google | No |
| Google: Gemini 2.5 Pro Preview 05-06 | Google | No |
| Google: Gemini 2.5 Pro Preview 06-05 | Google | No |
| Google: Gemma 2 27B | NextBit | No |
| Google: Gemma 2 9B | Nebius | No |
| Google: Gemma 3 12B | DeepInfra | No |
| Google: Gemma 3 27B | DeepInfra | No |
| Google: Gemma 3 27B | Phala | No |
| Google: Gemma 3 27B | Nebius | No |
| Google: Gemma 3 27B | Parasail | No |
| Google: Gemma 3 4B | DeepInfra | No |
| Google: Gemma 3n 4B | Together | No |
| Inception: Mercury | Inception | No |
| Inception: Mercury Coder | Inception | No |
| inclusionAI: Ling-1T | SiliconFlow | No |
| inclusionAI: Ring 1T | SiliconFlow | No |
| Llama Guard 3 8B | Together | No |
| Llama Guard 3 8B | DeepInfra | No |
| Llama Guard 3 8B | Nebius | No |
| Magnum v2 72B | Infermatic | No |
| Magnum v4 72B | Mancer 2 | No |
| Mancer: Weaver (alpha) | Mancer 2 | No |
| Meituan: LongCat Flash Chat | AtlasCloud | No |
| Meta: Llama 3 70B Instruct | Together | No |
| Meta: Llama 3 70B Instruct | Hyperbolic | No |
| Meta: Llama 3 70B Instruct | DeepInfra | No |
| Meta: Llama 3 8B Instruct | Together | No |
| Meta: Llama 3 8B Instruct | DeepInfra | No |
| Meta: Llama 3.1 405B (base) | Hyperbolic | No |
| Meta: Llama 3.1 405B Instruct | DeepInfra | No |
| Meta: Llama 3.1 405B Instruct | Nebius | No |
| Meta: Llama 3.1 405B Instruct | Hyperbolic | No |
| Meta: Llama 3.1 405B Instruct | Google | No |
| Meta: Llama 3.1 405B Instruct | Together | No |
| Meta: Llama 3.1 70B Instruct | Together | No |
| Meta: Llama 3.1 70B Instruct | Hyperbolic | No |
| Meta: Llama 3.1 70B Instruct | DeepInfra | No |
| Meta: Llama 3.1 70B Instruct | DeepInfra | No |
| Meta: Llama 3.1 70B Instruct | Fireworks | No |
| Meta: Llama 3.1 8B Instruct | Nebius | No |
| Meta: Llama 3.1 8B Instruct | SiliconFlow | No |
| Meta: Llama 3.1 8B Instruct | Fireworks | No |
| Meta: Llama 3.1 8B Instruct | Hyperbolic | No |
| Meta: Llama 3.1 8B Instruct | SambaNova | No |
| Meta: Llama 3.1 8B Instruct | Nebius | No |
| Meta: Llama 3.1 8B Instruct | DeepInfra | No |
| Meta: Llama 3.1 8B Instruct | DeepInfra | No |
| Meta: Llama 3.1 8B Instruct | Groq | No |
| Meta: Llama 3.1 8B Instruct | Cerebras | No |
| Meta: Llama 3.2 11B Vision Instruct | Together | No |
| Meta: Llama 3.2 11B Vision Instruct | DeepInfra | No |
| Meta: Llama 3.2 1B Instruct | DeepInfra | No |
| Meta: Llama 3.2 3B Instruct | Venice | No |
| Meta: Llama 3.2 3B Instruct | Hyperbolic | No |
| Meta: Llama 3.2 3B Instruct | Together | No |
| Meta: Llama 3.2 3B Instruct | DeepInfra | No |
| Meta: Llama 3.2 90B Vision Instruct | DeepInfra | No |
| Meta: Llama 3.3 70B Instruct | Nebius | No |
| Meta: Llama 3.3 70B Instruct | SambaNova | No |
| Meta: Llama 3.3 70B Instruct | Together | No |
| Meta: Llama 3.3 70B Instruct | SambaNova | No |
| Meta: Llama 3.3 70B Instruct | Parasail | No |
| Meta: Llama 3.3 70B Instruct | Fireworks | No |
| Meta: Llama 3.3 70B Instruct | Hyperbolic | No |
| Meta: Llama 3.3 70B Instruct | Google | No |
| Meta: Llama 3.3 70B Instruct | Nebius | No |
| Meta: Llama 3.3 70B Instruct | DeepInfra | No |
| Meta: Llama 3.3 70B Instruct | Venice | No |
| Meta: Llama 3.3 70B Instruct | Google | No |
| Meta: Llama 3.3 70B Instruct | Together | No |
| Meta: Llama 3.3 70B Instruct | Groq | No |
| Meta: Llama 3.3 70B Instruct | Cerebras | No |
| Meta: Llama 3.3 70B Instruct | DeepInfra | No |
| Meta: Llama 4 Maverick | DeepInfra | No |
| Meta: Llama 4 Maverick | Groq | No |
| Meta: Llama 4 Maverick | DeepInfra | No |
| Meta: Llama 4 Maverick | SambaNova | No |
| Meta: Llama 4 Maverick | Google | No |
| Meta: Llama 4 Maverick | Parasail | No |
| Meta: Llama 4 Maverick | Google | No |
| Meta: Llama 4 Maverick | Together | No |
| Meta: Llama 4 Maverick | Fireworks | No |
| Meta: Llama 4 Scout | DeepInfra | No |
| Meta: Llama 4 Scout | Google | No |
| Meta: Llama 4 Scout | Groq | No |
| Meta: Llama 4 Scout | Google | No |
| Meta: Llama 4 Scout | Together | No |
| Meta: Llama 4 Scout | Fireworks | No |
| Meta: Llama 4 Scout | Cerebras | No |
| Meta: Llama Guard 4 12B | DeepInfra | No |
| Meta: Llama Guard 4 12B | Groq | No |
| Meta: LlamaGuard 2 8B | Together | No |
| Microsoft: Phi 4 | NextBit | No |
| Microsoft: Phi 4 | DeepInfra | No |
| Microsoft: Phi 4 Multimodal Instruct | DeepInfra | No |
| Microsoft: Phi 4 Reasoning Plus | DeepInfra | No |
| MiniMax: MiniMax M1 | SiliconFlow | No |
| Mistral: Devstral Small 1.1 | DeepInfra | No |
| Mistral: Devstral Small 2505 | DeepInfra | No |
| Mistral: Devstral Small 2505 | Nebius | No |
| Mistral: Mistral 7B Instruct | Together | No |
| Mistral: Mistral 7B Instruct | DeepInfra | No |
| Mistral: Mistral 7B Instruct | DeepInfra | No |
| Mistral: Mistral 7B Instruct v0.1 | Together | No |
| Mistral: Mistral 7B Instruct v0.2 | Together | No |
| Mistral: Mistral 7B Instruct v0.3 | Together | No |
| Mistral: Mistral 7B Instruct v0.3 | DeepInfra | No |
| Mistral: Mistral Nemo | DeepInfra | No |
| Mistral: Mistral Nemo | Parasail | No |
| Mistral: Mistral Small 3 | DeepInfra | No |
| Mistral: Mistral Small 3 | Together | No |
| Mistral: Mistral Small 3.1 24B | DeepInfra | No |
| Mistral: Mistral Small 3.1 24B | Venice | No |
| Mistral: Mistral Small 3.2 24B | Parasail | No |
| Mistral: Mistral Small 3.2 24B | DeepInfra | No |
| Mistral: Mixtral 8x7B Instruct | Together | No |
| Mistral: Mixtral 8x7B Instruct | DeepInfra | No |
| Mistral: Pixtral 12B | Hyperbolic | No |
| MoonshotAI: Kimi Dev 72B | SiliconFlow | No |
| MoonshotAI: Kimi K2 0711 | Nebius | No |
| MoonshotAI: Kimi K2 0711 | Fireworks | No |
| MoonshotAI: Kimi K2 0711 | DeepInfra | No |
| MoonshotAI: Kimi K2 0711 | Together | No |
| MoonshotAI: Kimi K2 0711 | Moonshot AI | No |
| MoonshotAI: Kimi K2 0711 | AtlasCloud | No |
| MoonshotAI: Kimi K2 0905 | Groq | Yes |
| MoonshotAI: Kimi K2 0905 | Moonshot AI | Yes |
| MoonshotAI: Kimi K2 0905 | Moonshot AI | No |
| MoonshotAI: Kimi K2 0905 | Fireworks | No |
| MoonshotAI: Kimi K2 0905 | Moonshot AI | No |
| MoonshotAI: Kimi K2 0905 | Together | No |
| MoonshotAI: Kimi K2 0905 | Moonshot AI | Yes |
| MoonshotAI: Kimi K2 0905 | DeepInfra | No |
| MoonshotAI: Kimi K2 0905 | Groq | Yes |
| MoonshotAI: Kimi K2 0905 | AtlasCloud | No |
| MoonshotAI: Kimi K2 0905 | BaseTen | No |
| MoonshotAI: Kimi K2 0905 | Parasail | No |
| MoonshotAI: Kimi K2 0905 | SiliconFlow | No |
| Morph: Morph V3 Fast | Morph | No |
| Morph: Morph V3 Large | Morph | No |
| MythoMax 13B | DeepInfra | No |
| MythoMax 13B | NextBit | No |
| MythoMax 13B | Mancer 2 | No |
| NeverSleep: Lumimaid v0.2 8B | NextBit | No |
| NeverSleep: Lumimaid v0.2 8B | Mancer 2 | No |
| Noromaid 20B | Mancer 2 | No |
| Noromaid 20B | NextBit | No |
| Nous: Hermes 3 405B Instruct | Venice | No |
| Nous: Hermes 3 405B Instruct | Nebius | No |
| Nous: Hermes 3 405B Instruct | DeepInfra | No |
| Nous: Hermes 3 70B Instruct | NextBit | No |
| Nous: Hermes 3 70B Instruct | DeepInfra | No |
| Nous: Hermes 3 70B Instruct | Hyperbolic | No |
| Nous: Hermes 4 405B | Nebius | No |
| Nous: Hermes 4 70B | Nebius | No |
| NousResearch: Hermes 2 Pro - Llama-3 8B | NextBit | No |
| NVIDIA: Llama 3.1 Nemotron 70B Instruct | Infermatic | No |
| NVIDIA: Llama 3.1 Nemotron 70B Instruct | DeepInfra | No |
| NVIDIA: Llama 3.1 Nemotron Ultra 253B v1 | Nebius | No |
| NVIDIA: Llama 3.3 Nemotron Super 49B V1.5 | DeepInfra | No |
| NVIDIA: Nemotron Nano 9B V2 | DeepInfra | No |
| NVIDIA: Nemotron Nano 9B V2 | Nvidia | No |
| NVIDIA: Nemotron Nano 9B V2 | Together | No |
| OpenAI: gpt-oss-120b | Fireworks | No |
| OpenAI: gpt-oss-120b | Phala | No |
| OpenAI: gpt-oss-120b | Groq | No |
| OpenAI: gpt-oss-120b | DeepInfra | No |
| OpenAI: gpt-oss-120b | Google | No |
| OpenAI: gpt-oss-120b | Parasail | No |
| OpenAI: gpt-oss-120b | AtlasCloud | No |
| OpenAI: gpt-oss-120b | Nebius | No |
| OpenAI: gpt-oss-120b | BaseTen | No |
| OpenAI: gpt-oss-120b | SiliconFlow | No |
| OpenAI: gpt-oss-120b | SambaNova | No |
| OpenAI: gpt-oss-120b | Groq | No |
| OpenAI: gpt-oss-120b | Together | No |
| OpenAI: gpt-oss-120b | DeepInfra | No |
| OpenAI: gpt-oss-120b | Cerebras | No |
| OpenAI: gpt-oss-120b | DeepInfra | No |
| OpenAI: gpt-oss-20b | Fireworks | No |
| OpenAI: gpt-oss-20b | Parasail | No |
| OpenAI: gpt-oss-20b | Together | No |
| OpenAI: gpt-oss-20b | NextBit | No |
| OpenAI: gpt-oss-20b | Google | No |
| OpenAI: gpt-oss-20b | Hyperbolic | No |
| OpenAI: gpt-oss-20b | AtlasCloud | No |
| OpenAI: gpt-oss-20b | Nebius | No |
| OpenAI: gpt-oss-20b | SiliconFlow | No |
| OpenAI: gpt-oss-20b | Groq | No |
| OpenAI: gpt-oss-20b | Phala | No |
| OpenAI: gpt-oss-20b | DeepInfra | No |
| Perplexity: Sonar | Perplexity | No |
| Perplexity: Sonar Deep Research | Perplexity | No |
| Perplexity: Sonar Pro | Perplexity | No |
| Perplexity: Sonar Reasoning | Perplexity | No |
| Perplexity: Sonar Reasoning Pro | Perplexity | No |
| Qwen: Qwen2.5 7B Instruct | Together | No |
| Qwen: Qwen2.5 7B Instruct | DeepInfra | No |
| Qwen: Qwen2.5 7B Instruct | Phala | No |
| Qwen: Qwen2.5 Coder 7B Instruct | Nebius | No |
| Qwen: Qwen2.5 VL 32B Instruct | DeepInfra | No |
| Qwen: Qwen2.5 VL 32B Instruct | Fireworks | No |
| Qwen: Qwen2.5 VL 72B Instruct | Phala | No |
| Qwen: Qwen2.5 VL 72B Instruct | Together | No |
| Qwen: Qwen2.5 VL 72B Instruct | Parasail | No |
| Qwen: Qwen2.5 VL 72B Instruct | Nebius | No |
| Qwen: Qwen2.5 VL 72B Instruct | Hyperbolic | No |
| Qwen: Qwen2.5-VL 7B Instruct | Hyperbolic | No |
| Qwen: Qwen3 14B | Parasail | No |
| Qwen: Qwen3 14B | NextBit | No |
| Qwen: Qwen3 14B | Nebius | No |
| Qwen: Qwen3 14B | DeepInfra | No |
| Qwen: Qwen3 235B A22B | Together | No |
| Qwen: Qwen3 235B A22B | Venice | No |
| Qwen: Qwen3 235B A22B | Fireworks | No |
| Qwen: Qwen3 235B A22B | DeepInfra | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | Google | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | Nebius | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | Hyperbolic | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | BaseTen | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | SiliconFlow | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | Together | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | Cerebras | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | Google | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | Parasail | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | DeepInfra | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | Fireworks | No |
| Qwen: Qwen3 235B A22B Instruct 2507 | AtlasCloud | No |
| Qwen: Qwen3 235B A22B Thinking 2507 | DeepInfra | No |
| Qwen: Qwen3 235B A22B Thinking 2507 | SiliconFlow | No |
| Qwen: Qwen3 235B A22B Thinking 2507 | Together | No |
| Qwen: Qwen3 235B A22B Thinking 2507 | Cerebras | No |
| Qwen: Qwen3 30B A3B | NextBit | No |
| Qwen: Qwen3 30B A3B | Nebius | No |
| Qwen: Qwen3 30B A3B | Parasail | No |
| Qwen: Qwen3 30B A3B | DeepInfra | No |
| Qwen: Qwen3 30B A3B | SiliconFlow | No |
| Qwen: Qwen3 30B A3B Instruct 2507 | Nebius | No |
| Qwen: Qwen3 30B A3B Instruct 2507 | AtlasCloud | No |
| Qwen: Qwen3 30B A3B Instruct 2507 | SiliconFlow | No |
| Qwen: Qwen3 30B A3B Thinking 2507 | Nebius | No |
| Qwen: Qwen3 30B A3B Thinking 2507 | SiliconFlow | No |
| Qwen: Qwen3 32B | Groq | No |
| Qwen: Qwen3 32B | Nebius | No |
| Qwen: Qwen3 32B | Nebius | No |
| Qwen: Qwen3 32B | SambaNova | No |
| Qwen: Qwen3 32B | DeepInfra | No |
| Qwen: Qwen3 32B | SiliconFlow | No |
| Qwen: Qwen3 32B | Cerebras | No |
| Qwen: Qwen3 4B | Venice | No |
| Qwen: Qwen3 Coder 30B A3B Instruct | Nebius | No |
| Qwen: Qwen3 Coder 30B A3B Instruct | SiliconFlow | No |
| Qwen: Qwen3 Coder 30B A3B Instruct | DeepInfra | No |
| Qwen: Qwen3 Coder 480B A35B | Venice | No |
| Qwen: Qwen3 Coder 480B A35B | Hyperbolic | No |
| Qwen: Qwen3 Coder 480B A35B | AtlasCloud | No |
| Qwen: Qwen3 Coder 480B A35B | Cerebras | No |
| Qwen: Qwen3 Coder 480B A35B | BaseTen | No |
| Qwen: Qwen3 Coder 480B A35B | BaseTen | No |
| Qwen: Qwen3 Coder 480B A35B | Google | No |
| Qwen: Qwen3 Coder 480B A35B | Nebius | No |
| Qwen: Qwen3 Coder 480B A35B | Together | No |
| Qwen: Qwen3 Coder 480B A35B | Cerebras | No |
| Qwen: Qwen3 Coder 480B A35B | Fireworks | No |
| Qwen: Qwen3 Coder 480B A35B | SiliconFlow | No |
| Qwen: Qwen3 Coder 480B A35B | DeepInfra | No |
| Qwen: Qwen3 Coder 480B A35B | DeepInfra | No |
| Qwen: Qwen3 Coder 480B A35B | Google | No |
| Qwen: Qwen3 Next 80B A3B Instruct | Parasail | No |
| Qwen: Qwen3 Next 80B A3B Instruct | DeepInfra | No |
| Qwen: Qwen3 Next 80B A3B Instruct | Hyperbolic | No |
| Qwen: Qwen3 Next 80B A3B Instruct | Google | No |
| Qwen: Qwen3 Next 80B A3B Instruct | AtlasCloud | No |
| Qwen: Qwen3 Next 80B A3B Instruct | SiliconFlow | No |
| Qwen: Qwen3 Next 80B A3B Thinking | DeepInfra | No |
| Qwen: Qwen3 Next 80B A3B Thinking | Together | No |
| Qwen: Qwen3 Next 80B A3B Thinking | AtlasCloud | No |
| Qwen: Qwen3 Next 80B A3B Thinking | Hyperbolic | No |
| Qwen: Qwen3 Next 80B A3B Thinking | Parasail | No |
| Qwen: Qwen3 Next 80B A3B Thinking | Google | No |
| Qwen: Qwen3 VL 235B A22B Instruct | DeepInfra | No |
| Qwen: Qwen3 VL 235B A22B Instruct | Parasail | No |
| Qwen: Qwen3 VL 235B A22B Instruct | SiliconFlow | No |
| Qwen: Qwen3 VL 235B A22B Thinking | Parasail | No |
| Qwen: Qwen3 VL 235B A22B Thinking | SiliconFlow | No |
| Qwen: Qwen3 VL 30B A3B Instruct | DeepInfra | No |
| Qwen: Qwen3 VL 30B A3B Instruct | Parasail | No |
| Qwen: Qwen3 VL 30B A3B Instruct | SiliconFlow | No |
| Qwen: Qwen3 VL 30B A3B Thinking | SiliconFlow | No |
| Qwen: Qwen3 VL 4B Instruct | DeepInfra | No |
| Qwen: Qwen3 VL 8B Instruct | DeepInfra | No |
| Qwen: QwQ 32B | NextBit | No |
| Qwen: QwQ 32B | Together | No |
| Qwen: QwQ 32B | Hyperbolic | No |
| Qwen: QwQ 32B | DeepInfra | No |
| Qwen: QwQ 32B | Nebius | No |
| Qwen: QwQ 32B | Nebius | No |
| Qwen: QwQ 32B | SiliconFlow | No |
| Qwen2.5 72B Instruct | Together | No |
| Qwen2.5 72B Instruct | Hyperbolic | No |
| Qwen2.5 72B Instruct | Nebius | No |
| Qwen2.5 72B Instruct | DeepInfra | No |
| Qwen2.5 Coder 32B Instruct | Together | No |
| Qwen2.5 Coder 32B Instruct | Hyperbolic | No |
| Qwen2.5 Coder 32B Instruct | DeepInfra | No |
| Relace: Relace Apply 3 | Relace | No |
| ReMM SLERP 13B | NextBit | No |
| ReMM SLERP 13B | Mancer 2 | No |
| Sao10K: Llama 3 8B Lunaris | DeepInfra | No |
| Sao10K: Llama 3.1 70B Hanami x1 | Infermatic | No |
| Sao10K: Llama 3.1 Euryale 70B v2.2 | NextBit | No |
| Sao10K: Llama 3.1 Euryale 70B v2.2 | DeepInfra | No |
| Sao10K: Llama 3.3 Euryale 70B | NextBit | No |
| Sao10K: Llama 3.3 Euryale 70B | DeepInfra | No |
| SorcererLM 8x22B | Infermatic | No |
| StepFun: Step3 | SiliconFlow | No |
| Tencent: Hunyuan A13B Instruct | SiliconFlow | No |
| TheDrummer: Anubis 70B V1.1 | Parasail | No |
| TheDrummer: Cydonia 24B V4.1 | Parasail | No |
| TheDrummer: Rocinante 12B | Infermatic | No |
| TheDrummer: Rocinante 12B | NextBit | No |
| TheDrummer: Skyfall 36B V2 | Parasail | No |
| TheDrummer: UnslopNemo 12B | NextBit | No |
| Tongyi DeepResearch 30B A3B | AtlasCloud | No |
| Venice: Uncensored | Venice | No |
| WizardLM-2 8x22B | DeepInfra | No |
| Z.AI: GLM 4 32B | Z.AI | No |
| Z.AI: GLM 4.5 | Z.AI | No |
| Z.AI: GLM 4.5 | DeepInfra | No |
| Z.AI: GLM 4.5 | Nebius | No |
| Z.AI: GLM 4.5 | Mancer 2 | No |
| Z.AI: GLM 4.5 Air | SiliconFlow | No |
| Z.AI: GLM 4.5 Air | Nebius | No |
| Z.AI: GLM 4.5 Air | Z.AI | No |
| Z.AI: GLM 4.5 Air | Z.AI | No |
| Z.AI: GLM 4.5 Air | AtlasCloud | No |
| Z.AI: GLM 4.5V | Parasail | No |
| Z.AI: GLM 4.5V | Z.AI | Yes |
| Z.AI: GLM 4.6 | Mancer 2 | No |
| Z.AI: GLM 4.6 | Z.AI | No |
| Z.AI: GLM 4.6 | DeepInfra | No |
| Z.AI: GLM 4.6 | Parasail | No |
| Z.AI: GLM 4.6 | BaseTen | No |
| Z.AI: GLM 4.6 | SiliconFlow | No |
| Z.AI: GLM 4.6 | AtlasCloud | No |
| Z.AI: GLM 4.6 | Z.AI | No |
| Z.AI: GLM 4.6 | DeepInfra | No |

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
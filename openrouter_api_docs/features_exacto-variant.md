---
url: "https://openrouter.ai/docs/features/exacto-variant"
title: "Exacto Variant | Curated provider routing for consistent quality | OpenRouter | Documentation"
---

Introducing a new set of endpoints, `:exacto`, focused on higher tool‑calling accuracy by routing to a sub‑group of providers with measurably better tool‑use success rates. It uses the same request payloads as any other variant, but filters endpoints so that only vetted providers for the chosen model are considered. To learn more, read our [blog post](https://openrouter.ai/announcements/provider-variance-introducing-exacto).

## Using the Exacto Variant

Add `:exacto` to the end of any supported model slug. The curated allowlist is enforced before provider sorting, fallback, or load balancing — no extra provider preference config is required.

TypeScript (OpenAI SDK)cURL

```code-block text-sm

```

You can still supply fallback models with the `models` array. Any model that
carries the `:exacto` suffix will enforce the curated provider list when it is
selected.

## What Is the Exacto Variant?

Exacto is a curated routing variant specifically focused on tool‑calling accuracy. Unlike standard routing, which considers all available providers for a model, Exacto restricts routing to providers that demonstrate higher tool‑use accuracy and normal tool‑use propensity on real workloads.

## Why Use Exacto?

### Why We Built It

Providers running the same model can differ in accuracy due to implementation details in production inference. OpenRouter sees billions of requests monthly, giving us a unique vantage point to observe these differences and minimize surprises for users. Exacto combines benchmark results with real‑world tool‑calling telemetry to select the best‑performing providers.

### Recommended Use Cases

Exacto is optimized for quality‑sensitive, agentic workflows where tool‑calling accuracy and reliability are critical.

## Supported Models

Exacto endpoints are available for:

- Kimi K2 ( `moonshotai/kimi-k2-0905:exacto`)
- DeepSeek v3.1 Terminus ( `deepseek/deepseek-v3.1-terminus:exacto`)
- GLM 4.6 ( `z-ai/glm-4.6:exacto`)
- GPT‑OSS 120B ( `openai/gpt-oss-120b:exacto`)
- Qwen3 Coder ( `qwen/qwen3-coder:exacto`)

## How We Select Providers

We use three inputs:

- Tool‑calling accuracy from real traffic across billions of calls
- Real‑time provider preferences (pins/ignores) from users making tool calls
- Benchmarking (internal eval suites, Groq OpenBench running LiveMCPBench, official tau2bench, and similar)

You will be routed only to providers that:

1. Are top‑tier on tool‑calling accuracy
2. Fall within a normal range of tool‑calling propensity
3. Are not frequently ignored or blacklisted by users when tools are provided

In our evaluations and open‑source benchmarks (e.g., tau2‑Bench, LiveMCPBench), Exacto shows materially fewer tool‑calling failures and more reliable tool use.

We will continue working with providers not currently in the Exacto pool to help them improve and be included. Exacto targets tool‑calling specifically and is not a broad statement on overall provider quality.

If you have feedback on the Exacto variant, please fill out this form:
[https://openrouter.notion.site/2932fd57c4dc8097ba74ffb6d27f39d1?pvs=105](https://openrouter.notion.site/2932fd57c4dc8097ba74ffb6d27f39d1?pvs=105)

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
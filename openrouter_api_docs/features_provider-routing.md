---
url: "https://openrouter.ai/docs/features/provider-routing"
title: "Provider Routing | Intelligent Multi-Provider Request Routing | OpenRouter | Documentation"
---

OpenRouter routes requests to the best available providers for your model. By default, [requests are load balanced](https://openrouter.ai/docs/features/provider-routing#price-based-load-balancing-default-strategy) across the top providers to maximize uptime.

You can customize how your requests are routed using the `provider` object in the request body for [Chat Completions](https://openrouter.ai/docs/api-reference/chat-completion) and [Completions](https://openrouter.ai/docs/api-reference/completion).

For a complete list of valid provider names to use in the API, see the [full\\
provider schema](https://openrouter.ai/docs/features/provider-routing#json-schema-for-provider-preferences).

The `provider` object can contain the following fields:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `order` | string\[\] | - | List of provider slugs to try in order (e.g. `["anthropic", "openai"]`). [Learn more](https://openrouter.ai/docs/features/provider-routing#ordering-specific-providers) |
| `allow_fallbacks` | boolean | `true` | Whether to allow backup providers when the primary is unavailable. [Learn more](https://openrouter.ai/docs/features/provider-routing#disabling-fallbacks) |
| `require_parameters` | boolean | `false` | Only use providers that support all parameters in your request. [Learn more](https://openrouter.ai/docs/features/provider-routing#requiring-providers-to-support-all-parameters-beta) |
| `data_collection` | ”allow” \| “deny" | "allow” | Control whether to use providers that may store data. [Learn more](https://openrouter.ai/docs/features/provider-routing#requiring-providers-to-comply-with-data-policies) |
| `zdr` | boolean | - | Restrict routing to only ZDR (Zero Data Retention) endpoints. [Learn more](https://openrouter.ai/docs/features/provider-routing#zero-data-retention-enforcement) |
| `only` | string\[\] | - | List of provider slugs to allow for this request. [Learn more](https://openrouter.ai/docs/features/provider-routing#allowing-only-specific-providers) |
| `ignore` | string\[\] | - | List of provider slugs to skip for this request. [Learn more](https://openrouter.ai/docs/features/provider-routing#ignoring-providers) |
| `quantizations` | string\[\] | - | List of quantization levels to filter by (e.g. `["int4", "int8"]`). [Learn more](https://openrouter.ai/docs/features/provider-routing#quantization) |
| `sort` | string | - | Sort providers by price or throughput. (e.g. `"price"` or `"throughput"`). [Learn more](https://openrouter.ai/docs/features/provider-routing#provider-sorting) |
| `max_price` | object | - | The maximum pricing you want to pay for this request. [Learn more](https://openrouter.ai/docs/features/provider-routing#maximum-price) |

##### EU data residency (Enterprise)

OpenRouter supports EU in-region routing for enterprise customers. When enabled, prompts and completions are processed entirely within the EU. Learn more in our [Privacy docs here](https://openrouter.ai/docs/features/privacy-and-logging#enterprise-eu-in-region-routing). To contact our enterprise team, [fill out this form](https://openrouter.ai/enterprise/form).

## Price-Based Load Balancing (Default Strategy)

For each model in your request, OpenRouter’s default behavior is to load balance requests across providers, prioritizing price.

If you are more sensitive to throughput than price, you can use the `sort` field to explicitly prioritize throughput.

When you send a request with `tools` or `tool_choice`, OpenRouter will only
route to providers that support tool use. Similarly, if you set a
`max_tokens`, then OpenRouter will only route to providers that support a
response of that length.

Here is OpenRouter’s default load balancing strategy:

1. Prioritize providers that have not seen significant outages in the last 30 seconds.
2. For the stable providers, look at the lowest-cost candidates and select one weighted by inverse square of the price (example below).
3. Use the remaining providers as fallbacks.

##### A Load Balancing Example

If Provider A costs $1 per million tokens, Provider B costs $2, and Provider C costs $3, and Provider B recently saw a few outages.

- Your request is routed to Provider A. Provider A is 9x more likely to be first routed to Provider A than Provider C because (1/32=1/9)(1 / 3^2 = 1/9)(1/32=1/9) (inverse square of the price).
- If Provider A fails, then Provider C will be tried next.
- If Provider C also fails, Provider B will be tried last.

If you have `sort` or `order` set in your provider preferences, load balancing will be disabled.

## Provider Sorting

As described above, OpenRouter load balances based on price, while taking uptime into account.

If you instead want to _explicitly_ prioritize a particular provider attribute, you can include the `sort` field in the `provider` preferences. Load balancing will be disabled, and the router will try providers in order.

The three sort options are:

- `"price"`: prioritize lowest price
- `"throughput"`: prioritize highest throughput
- `"latency"`: prioritize lowest latency

TypeScript Example with Fallbacks EnabledPython Example with Fallbacks Enabled

```code-block text-sm

```

To _always_ prioritize low prices, and not apply any load balancing, set `sort` to `"price"`.

To _always_ prioritize low latency, and not apply any load balancing, set `sort` to `"latency"`.

## Nitro Shortcut

You can append `:nitro` to any model slug as a shortcut to sort by throughput. This is exactly equivalent to setting `provider.sort` to `"throughput"`.

TypeScript Example using Nitro shortcutPython Example using Nitro shortcut

```code-block text-sm

```

## Floor Price Shortcut

You can append `:floor` to any model slug as a shortcut to sort by price. This is exactly equivalent to setting `provider.sort` to `"price"`.

TypeScript Example using Floor shortcutPython Example using Floor shortcut

```code-block text-sm

```

## Ordering Specific Providers

You can set the providers that OpenRouter will prioritize for your request using the `order` field.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `order` | string\[\] | - | List of provider slugs to try in order (e.g. `["anthropic", "openai"]`). |

The router will prioritize providers in this list, and in this order, for the model you’re using. If you don’t set this field, the router will [load balance](https://openrouter.ai/docs/features/provider-routing#price-based-load-balancing-default-strategy) across the top providers to maximize uptime.

You can use the copy button next to provider names on model pages to get the exact provider slug,
including any variants like “/turbo”. See [Targeting Specific Provider Endpoints](https://openrouter.ai/docs/features/provider-routing#targeting-specific-provider-endpoints) for details.

OpenRouter will try them one at a time and proceed to other providers if none are operational. If you don’t want to allow any other providers, you should [disable fallbacks](https://openrouter.ai/docs/features/provider-routing#disabling-fallbacks) as well.

### Example: Specifying providers with fallbacks

This example skips over OpenAI (which doesn’t host Mixtral), tries Together, and then falls back to the normal list of providers on OpenRouter:

TypeScript Example with Fallbacks EnabledPython Example with Fallbacks Enabled

```code-block text-sm

```

### Example: Specifying providers with fallbacks disabled

Here’s an example with `allow_fallbacks` set to `false` that skips over OpenAI (which doesn’t host Mixtral), tries Together, and then fails if Together fails:

TypeScript Example with Fallbacks DisabledPython Example with Fallbacks Disabled

```code-block text-sm

```

## Targeting Specific Provider Endpoints

Each provider on OpenRouter may host multiple endpoints for the same model, such as a default endpoint and a specialized “turbo” endpoint. To target a specific endpoint, you can use the copy button next to the provider name on the model detail page to obtain the exact provider slug.

For example, DeepInfra offers DeepSeek R1 through multiple endpoints:

- Default endpoint with slug `deepinfra`
- Turbo endpoint with slug `deepinfra/turbo`

By copying the exact provider slug and using it in your request’s `order` array, you can ensure your request is routed to the specific endpoint you want:

TypeScript Example targeting DeepInfra Turbo endpointPython Example targeting DeepInfra Turbo endpoint

```code-block text-sm

```

This approach is especially useful when you want to consistently use a specific variant of a model from a particular provider.

## Requiring Providers to Support All Parameters

You can restrict requests only to providers that support all parameters in your request using the `require_parameters` field.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `require_parameters` | boolean | `false` | Only use providers that support all parameters in your request. |

With the default routing strategy, providers that don’t support all the [LLM parameters](https://openrouter.ai/docs/api-reference/parameters) specified in your request can still receive the request, but will ignore unknown parameters. When you set `require_parameters` to `true`, the request won’t even be routed to that provider.

### Example: Excluding providers that don’t support JSON formatting

For example, to only use providers that support JSON formatting:

TypeScript Python

```code-block text-sm

```

## Requiring Providers to Comply with Data Policies

You can restrict requests only to providers that comply with your data policies using the `data_collection` field.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `data_collection` | ”allow” \| “deny" | "allow” | Control whether to use providers that may store data. |

- `allow`: (default) allow providers which store user data non-transiently and may train on it
- `deny`: use only providers which do not collect user data

Some model providers may log prompts, so we display them with a **Data Policy** tag on model pages. This is not a definitive source of third party data policies, but represents our best knowledge.

##### Account-Wide Data Policy Filtering

This is also available as an account-wide setting in [your privacy\\
settings](https://openrouter.ai/settings/privacy). You can disable third party
model providers that store inputs for training.

### Example: Excluding providers that don’t comply with data policies

To exclude providers that don’t comply with your data policies, set `data_collection` to `deny`:

TypeScript Python

```code-block text-sm

```

## Zero Data Retention Enforcement

You can enforce Zero Data Retention (ZDR) on a per-request basis using the `zdr` parameter, ensuring your request only routes to endpoints that do not retain prompts.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `zdr` | boolean | - | Restrict routing to only ZDR (Zero Data Retention) endpoints. |

When `zdr` is set to `true`, the request will only be routed to endpoints that have a Zero Data Retention policy. When `zdr` is `false` or not provided, it has no effect on routing.

##### Account-Wide ZDR Setting

This is also available as an account-wide setting in [your privacy\\
settings](https://openrouter.ai/settings/privacy). The per-request `zdr` parameter
operates as an “OR” with your account-wide ZDR setting - if either is enabled, ZDR enforcement will be applied. The request-level parameter can only ensure ZDR is enabled, not override account-wide enforcement.

### Example: Enforcing ZDR for a specific request

To ensure a request only uses ZDR endpoints, set `zdr` to `true`:

TypeScript Python

```code-block text-sm

```

This is useful for customers who don’t want to globally enforce ZDR but need to ensure specific requests only route to ZDR endpoints.

## Disabling Fallbacks

To guarantee that your request is only served by the top (lowest-cost) provider, you can disable fallbacks.

This is combined with the `order` field from [Ordering Specific Providers](https://openrouter.ai/docs/features/provider-routing#ordering-specific-providers) to restrict the providers that OpenRouter will prioritize to just your chosen list.

TypeScript Python

```code-block text-sm

```

## Allowing Only Specific Providers

You can allow only specific providers for a request by setting the `only` field in the `provider` object.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `only` | string\[\] | - | List of provider slugs to allow for this request. |

Only allowing some providers may significantly reduce fallback options and
limit request recovery.

##### Account-Wide Allowed Providers

You can allow providers for all account requests by configuring your [preferences](https://openrouter.ai/settings/preferences). This configuration applies to all API requests and chatroom messages.

Note that when you allow providers for a specific request, the list of allowed providers is merged with your account-wide allowed providers.

### Example: Allowing Azure for a request calling GPT-4 Omni

Here’s an example that will only use Azure for a request calling GPT-4 Omni:

TypeScript Python

```code-block text-sm

```

## Ignoring Providers

You can ignore providers for a request by setting the `ignore` field in the `provider` object.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `ignore` | string\[\] | - | List of provider slugs to skip for this request. |

Ignoring multiple providers may significantly reduce fallback options and
limit request recovery.

##### Account-Wide Ignored Providers

You can ignore providers for all account requests by configuring your [preferences](https://openrouter.ai/settings/preferences). This configuration applies to all API requests and chatroom messages.

Note that when you ignore providers for a specific request, the list of ignored providers is merged with your account-wide ignored providers.

### Example: Ignoring DeepInfra for a request calling Llama 3.3 70b

Here’s an example that will ignore DeepInfra for a request calling Llama 3.3 70b:

TypeScript Python

```code-block text-sm

```

## Quantization

Quantization reduces model size and computational requirements while aiming to preserve performance. Most LLMs today use FP16 or BF16 for training and inference, cutting memory requirements in half compared to FP32. Some optimizations use FP8 or quantization to reduce size further (e.g., INT8, INT4).

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `quantizations` | string\[\] | - | List of quantization levels to filter by (e.g. `["int4", "int8"]`). [Learn more](https://openrouter.ai/docs/features/provider-routing#quantization) |

Quantized models may exhibit degraded performance for certain prompts,
depending on the method used.

Providers can support various quantization levels for open-weight models.

### Quantization Levels

By default, requests are load-balanced across all available providers, ordered by price. To filter providers by quantization level, specify the `quantizations` field in the `provider` parameter with the following values:

- `int4`: Integer (4 bit)
- `int8`: Integer (8 bit)
- `fp4`: Floating point (4 bit)
- `fp6`: Floating point (6 bit)
- `fp8`: Floating point (8 bit)
- `fp16`: Floating point (16 bit)
- `bf16`: Brain floating point (16 bit)
- `fp32`: Floating point (32 bit)
- `unknown`: Unknown

### Example: Requesting FP8 Quantization

Here’s an example that will only use providers that support FP8 quantization:

TypeScript Python

```code-block text-sm

```

### Max Price

To filter providers by price, specify the `max_price` field in the `provider` parameter with a JSON object specifying the highest provider pricing you will accept.

For example, the value `{"prompt": 1, "completion": 2}` will route to any provider with a price of `<= $1/m` prompt tokens, and `<= $2/m` completion tokens or less.

Some providers support per request pricing, in which case you can use the `request` attribute of max\_price. Lastly, `image` is also available, which specifies the max price per image you will accept.

Practically, this field is often combined with a provider `sort` to express, for example, “Use the provider with the highest throughput, as long as it doesn’t cost more than `$x/m` tokens.”

## Terms of Service

You can view the terms of service for each provider below. You may not violate the terms of service or policies of third-party providers that power the models on OpenRouter.

\- `Weights & Biases`: [https://site.wandb.ai/terms/](https://site.wandb.ai/terms/)

\- `Cerebras`: [https://www.cerebras.ai/terms-of-service](https://www.cerebras.ai/terms-of-service)

\- `Morph`: [https://morphllm.com/privacy](https://morphllm.com/privacy)

\- `SambaNova`: [https://sambanova.ai/terms-and-conditions](https://sambanova.ai/terms-and-conditions)

\- `kluster.ai`: [https://www.kluster.ai/terms-of-use](https://www.kluster.ai/terms-of-use)

\- `OpenAI`: [https://openai.com/policies/row-terms-of-use/](https://openai.com/policies/row-terms-of-use/)

\- `Moonshot AI`: [https://platform.moonshot.ai/docs/agreement/modeluse](https://platform.moonshot.ai/docs/agreement/modeluse)

\- `Venice`: [https://venice.ai/legal/tos](https://venice.ai/legal/tos)

\- `Amazon Bedrock`: [https://aws.amazon.com/service-terms/](https://aws.amazon.com/service-terms/)

\- `Groq`: [https://groq.com/terms-of-use/](https://groq.com/terms-of-use/)

\- `Mistral`: [https://mistral.ai/terms/#terms-of-use](https://mistral.ai/terms/#terms-of-use)

\- `NextBit`: [https://www.nextbit256.com/docs/terms-of-service](https://www.nextbit256.com/docs/terms-of-service)

\- `Atoma`: [https://atoma.network/terms\_of\_service](https://atoma.network/terms_of_service)

\- `AI21`: [https://www.ai21.com/terms-of-service/](https://www.ai21.com/terms-of-service/)

\- `Minimax`: [https://www.minimax.io/platform/protocol/terms-of-service](https://www.minimax.io/platform/protocol/terms-of-service)

\- `Baseten`: [https://www.baseten.co/terms-and-conditions](https://www.baseten.co/terms-and-conditions)

\- `Anthropic`: [https://www.anthropic.com/legal/commercial-terms](https://www.anthropic.com/legal/commercial-terms)

\- `Featherless`: [https://featherless.ai/terms](https://featherless.ai/terms)

\- `Azure`: [https://www.microsoft.com/en-us/legal/terms-of-use?oneroute=true](https://www.microsoft.com/en-us/legal/terms-of-use?oneroute=true)

\- `Lambda`: [https://lambda.ai/legal/terms-of-service](https://lambda.ai/legal/terms-of-service)

\- `Hyperbolic`: [https://hyperbolic.xyz/terms](https://hyperbolic.xyz/terms)

\- `nCompass`: [https://ncompass.tech/terms](https://ncompass.tech/terms)

\- `Mancer (private)`: [https://mancer.tech/terms](https://mancer.tech/terms)

\- `Crusoe`: [https://legal.crusoe.ai/open-router#managed-inference-tos-open-router](https://legal.crusoe.ai/open-router#managed-inference-tos-open-router)

\- `Cohere`: [https://cohere.com/terms-of-use](https://cohere.com/terms-of-use)

\- `DeepSeek`: [https://chat.deepseek.com/downloads/DeepSeek%20Terms%20of%20Use.html](https://chat.deepseek.com/downloads/DeepSeek%20Terms%20of%20Use.html)

\- `NovitaAI`: [https://novita.ai/legal/terms-of-service](https://novita.ai/legal/terms-of-service)

\- `Avian.io`: [https://avian.io/terms](https://avian.io/terms)

\- `SiliconFlow`: [https://docs.siliconflow.com/en/legals/privacy-policy](https://docs.siliconflow.com/en/legals/privacy-policy)

\- `Perplexity`: [https://www.perplexity.ai/hub/legal/perplexity-api-terms-of-service](https://www.perplexity.ai/hub/legal/perplexity-api-terms-of-service)

\- `xAI`: [https://x.ai/legal/terms-of-service-enterprise](https://x.ai/legal/terms-of-service-enterprise)

\- `Inflection`: [https://developers.inflection.ai/tos](https://developers.inflection.ai/tos)

\- `Fireworks`: [https://fireworks.ai/terms-of-service](https://fireworks.ai/terms-of-service)

\- `DeepInfra`: [https://deepinfra.com/terms](https://deepinfra.com/terms)

\- `inference.net`: [https://inference.net/terms-of-service](https://inference.net/terms-of-service)

\- `Inception`: [https://www.inceptionlabs.ai/terms](https://www.inceptionlabs.ai/terms)

\- `NVIDIA`: [https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf)

\- `Alibaba Cloud Int.`: [https://www.alibabacloud.com/help/en/legal/latest/alibaba-cloud-international-website-product-terms-of-service-v-3-8-0](https://www.alibabacloud.com/help/en/legal/latest/alibaba-cloud-international-website-product-terms-of-service-v-3-8-0)

\- `Friendli`: [https://friendli.ai/terms-of-service](https://friendli.ai/terms-of-service)

\- `Targon`: [https://targon.com/terms](https://targon.com/terms)

\- `Ubicloud`: [https://www.ubicloud.com/docs/about/terms-of-service](https://www.ubicloud.com/docs/about/terms-of-service)

\- `Infermatic`: [https://infermatic.ai/terms-and-conditions/](https://infermatic.ai/terms-and-conditions/)

\- `AionLabs`: [https://www.aionlabs.ai/terms/](https://www.aionlabs.ai/terms/)

\- `Cloudflare`: [https://www.cloudflare.com/service-specific-terms-developer-platform/#developer-platform-terms](https://www.cloudflare.com/service-specific-terms-developer-platform/#developer-platform-terms)

\- `Nineteen`: [https://nineteen.ai/tos](https://nineteen.ai/tos)

\- `Liquid`: [https://www.liquid.ai/terms-conditions](https://www.liquid.ai/terms-conditions)

\- `Nebius AI Studio`: [https://docs.nebius.com/legal/studio/terms-of-use/](https://docs.nebius.com/legal/studio/terms-of-use/)

\- `Chutes`: [https://chutes.ai/tos](https://chutes.ai/tos)

\- `Enfer`: [https://enfer.ai/privacy-policy](https://enfer.ai/privacy-policy)

\- `CrofAI`: [https://ai.nahcrof.com/privacy](https://ai.nahcrof.com/privacy)

\- `Relace`: [https://www.relace.ai/privacy-policy](https://www.relace.ai/privacy-policy)

\- `GMICloud`: [https://docs.gmicloud.ai/privacy](https://docs.gmicloud.ai/privacy)

\- `Phala`: [https://red-pill.ai/terms](https://red-pill.ai/terms)

\- `Meta`: [https://llama.developer.meta.com/legal/terms-of-service](https://llama.developer.meta.com/legal/terms-of-service)

\- `Parasail`: [https://www.parasail.io/legal/terms](https://www.parasail.io/legal/terms)

\- `OpenInference`: [https://www.openinference.xyz/terms](https://www.openinference.xyz/terms)

\- `Clarifai`: [https://www.clarifai.com/company/terms](https://www.clarifai.com/company/terms)

\- `Modular`: [https://www.runmodelrun.com/TOS.html](https://www.runmodelrun.com/TOS.html)

\- `Google Vertex`: [https://cloud.google.com/terms/](https://cloud.google.com/terms/)

\- `AtlasCloud`: [https://www.atlascloud.ai/privacy](https://www.atlascloud.ai/privacy)

\- `Google AI Studio`: [https://cloud.google.com/terms/](https://cloud.google.com/terms/)

\- `Together`: [https://www.together.ai/terms-of-service](https://www.together.ai/terms-of-service)

## JSON Schema for Provider Preferences

For a complete list of options, see this JSON schema:

Provider Preferences Schema

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

How can I integrate OpenRouter with LangChain for Python and JavaScript development?

What is prompt caching and how can I use it to reduce costs with OpenAI and Anthropic models?

How do I enable web search capabilities to add real-time information to my AI model responses?

What are the different provider routing options and how can I optimize for cost and performance?

How can I send PDF documents to models through OpenRouter's API using URLs or base64 encoding?
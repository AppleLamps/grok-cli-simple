---
url: "https://openrouter.ai/docs/app-attribution"
title: "App Attribution | OpenRouter Documentation | OpenRouter | Documentation"
---

App attribution allows developers to associate their API usage with their application, enabling visibility in OpenRouter’s public rankings and detailed analytics. By including simple headers in your requests, your app can appear in our leaderboards and gain insights into your model usage patterns.

## Benefits of App Attribution

When you properly attribute your app usage, you gain access to:

- **Public App Rankings**: Your app appears in OpenRouter’s [public rankings](https://openrouter.ai/rankings) with daily, weekly, and monthly leaderboards
- **Model Apps Tabs**: Your app is featured on individual model pages showing which apps use each model most
- **Detailed Analytics**: Access comprehensive analytics showing your app’s model usage over time, token consumption, and usage patterns
- **Professional Visibility**: Showcase your app to the OpenRouter developer community

## Attribution Headers

OpenRouter tracks app attribution through two optional HTTP headers:

### HTTP-Referer

The `HTTP-Referer` header identifies your app’s URL and is used as the primary identifier for rankings.

### X-Title

The `X-Title` header sets or modifies your app’s display name in rankings and analytics.

Both headers are optional, but including them enables all attribution features. Apps using localhost URLs must include a title to be tracked.

## Implementation Examples

Python (OpenAI SDK)TypeScript (OpenAI SDK)Python (Direct API)TypeScript (Fetch)cURL

```code-block text-sm

```

## Where Your App Appears

### App Rankings

Your attributed app will appear in OpenRouter’s main rankings page at [openrouter.ai/rankings](https://openrouter.ai/rankings). The rankings show:

- **Top Apps**: Largest public apps by token usage
- **Time Periods**: Daily, weekly, and monthly views
- **Usage Metrics**: Total token consumption across all models

### Model Apps Tabs

On individual model pages (e.g., [GPT-4o](https://openrouter.ai/models/openai/gpt-4o)), your app will be featured in the “Apps” tab showing:

- **Top Apps**: Apps using that specific model most
- **Weekly Rankings**: Updated weekly based on usage
- **Usage Context**: How your app compares to others using the same model

### Individual App Analytics

Once your app is tracked, you can access detailed analytics at `openrouter.ai/apps?url=<your-app-url>` including:

- **Model Usage Over Time**: Charts showing which models your app uses
- **Token Consumption**: Detailed breakdown of prompt and completion tokens
- **Usage Patterns**: Historical data to understand your app’s AI usage trends

## Best Practices

### URL Requirements

- Use your app’s primary domain (e.g., `https://myapp.com`)
- Avoid using subdomains unless they represent distinct apps
- For localhost development, always include a title header

### Title Guidelines

- Keep titles concise and descriptive
- Use your app’s actual name as users know it
- Avoid generic names like “AI App” or “Chatbot”

### Privacy Considerations

- Only public apps, meaning those that send headers, are included in rankings
- Attribution headers don’t expose sensitive information about your requests

## Related Documentation

- [Quickstart Guide](https://openrouter.ai/docs/quickstart) \- Basic setup with attribution headers
- [API Reference](https://openrouter.ai/docs/api-reference/overview) \- Complete header documentation
- [Usage Accounting](https://openrouter.ai/docs/use-cases/usage-accounting) \- Understanding your API usage

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
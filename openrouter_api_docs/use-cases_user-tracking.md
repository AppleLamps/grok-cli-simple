---
url: "https://openrouter.ai/docs/use-cases/user-tracking"
title: "User Tracking | Track Your Users with OpenRouter | OpenRouter | Documentation"
---

The OpenRouter API supports **User Tracking** through the optional `user` parameter, allowing you to track your own user IDs and improve your application’s performance and reporting capabilities.

## What is User Tracking?

User tracking enables you to specify an arbitrary string identifier for your end-users in API requests. This optional metadata helps OpenRouter understand your sub-users, leading to several benefits:

1. **Improved Caching**: OpenRouter can make caches sticky to your individual users, improving load-balancing and throughput
2. **Enhanced Reporting**: View detailed analytics and activity feeds broken down by your user IDs

## How It Works

Simply include a `user` parameter in your API requests with any string identifier that represents your end-user. This could be a user ID, email hash, session identifier, or any other stable identifier you use in your application.

```code-block text-sm

```

## Benefits

### Improved Caching Performance

When you consistently use the same user identifier for a specific user, OpenRouter can optimize caching to be “sticky” to that user. This means:

- A given user of your application (assuming you are using caching) will always get routed to the same provider and the cache will stay warm
- But separate users can be spread over different providers, improving load-balancing and throughput

### Enhanced Reporting and Analytics

The user parameter is available in the /activity page, in the exports from that page, and in the /generations API.

- **Activity Feed**: View requests broken down by user ID in your OpenRouter dashboard
- **Usage Analytics**: Understand which users are making the most requests
- **Export Data**: Get detailed exports that include user-level breakdowns

## Implementation Example

Python (OpenAI SDK)TypeScript

```code-block text-sm

```

## Best Practices

### Choose Stable Identifiers

Use consistent, stable identifiers for the same user across requests:

- **Good**: `user_12345`, `customer_abc123`, `account_xyz789`
- **Avoid**: Random strings that change between requests

### Consider Privacy

When using user identifiers, consider privacy implications:

- Use internal user IDs rather than exposing personal information
- Avoid including personally identifiable information in user identifiers
- Consider using anonymized identifiers for better privacy protection

### Be Consistent

Use the same user identifier format throughout your application:

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

How do I integrate OpenRouter with LangChain in Python?

What is prompt caching and how can I use it to reduce costs?

How do I enable web search capabilities for my AI model responses?

What's the difference between streaming and non-streaming responses?

How do I send PDF documents to models through the OpenRouter API?
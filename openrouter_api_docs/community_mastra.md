---
url: "https://openrouter.ai/docs/community/mastra"
title: "Mastra Integration | OpenRouter SDK Support | OpenRouter | Documentation"
---

## Mastra

Integrate OpenRouter with Mastra to access a variety of AI models through a unified interface. This guide provides complete examples from basic setup to advanced configurations.

### Step 1: Initialize a new Mastra project

The simplest way to start is using the automatic project creation:

```code-block text-sm

```

You’ll be guided through prompts to set up your project. For this example, select:

- Name your project: my-mastra-openrouter-app
- Components: Agents (recommended)
- For default provider, select OpenAI (recommended) - we’ll configure OpenRouter manually later
- Optionally include example code

For detailed instructions on setting up a Mastra project manually or adding Mastra to an existing project, refer to the [official Mastra documentation](https://mastra.ai/en/docs/getting-started/installation).

### Step 2: Configure your environment variables

After creating your project with `create-mastra`, you’ll find a `.env.development` file in your project root. Since we selected OpenAI during setup but will be using OpenRouter instead:

1. Open the `.env.development` file
2. Remove or comment out the `OPENAI_API_KEY` line
3. Add your OpenRouter API key:

```code-block text-sm

```

You can also remove the `@ai-sdk/openai` package since we’ll be using OpenRouter instead:

```code-block text-sm

```

```code-block text-sm

```

### Step 3: Configure your agent to use OpenRouter

After setting up your Mastra project, you’ll need to modify the agent files to use OpenRouter instead of the default OpenAI provider.

If you used `create-mastra`, you’ll likely have a file at `src/mastra/agents/agent.ts` or similar. Replace its contents with:

```code-block text-sm

```

Also make sure to update your Mastra entry point at `src/mastra/index.ts` to use your renamed agent:

```code-block text-sm

```

### Step 4: Running the Application

Once you’ve configured your agent to use OpenRouter, you can run the Mastra development server:

```code-block text-sm

```

This will start the Mastra development server and make your agent available at:

- REST API endpoint: `http://localhost:4111/api/agents/assistant/generate`
- Interactive playground: `http://localhost:4111`

The Mastra playground provides a user-friendly interface where you can interact with your agent and test its capabilities without writing any additional code.

You can also test the API endpoint using curl if needed:

```code-block text-sm

```

### Basic Integration with Mastra

The simplest way to integrate OpenRouter with Mastra is by using the OpenRouter AI provider with Mastra’s Agent system:

```code-block text-sm

```

### Advanced Configuration

For more control over your OpenRouter requests, you can pass additional configuration options:

```code-block text-sm

```

### Provider-Specific Options

You can also pass provider-specific options in your requests:

```code-block text-sm

```

### Using Multiple Models with OpenRouter

OpenRouter gives you access to various models from different providers. Here’s how to use multiple models:

```code-block text-sm

```

### Resources

For more information and detailed documentation, check out these resources:

- [OpenRouter Documentation](https://openrouter.ai/docs) \- Learn about OpenRouter’s capabilities and available models
- [Mastra Documentation](https://mastra.ai/docs) \- Comprehensive documentation for the Mastra framework
- [AI SDK Documentation](https://sdk.vercel.ai/docs) \- Detailed information about the AI SDK that powers Mastra’s model interactions

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
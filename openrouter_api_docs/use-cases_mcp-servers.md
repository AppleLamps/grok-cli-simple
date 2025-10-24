---
url: "https://openrouter.ai/docs/use-cases/mcp-servers"
title: "Using MCP Servers with OpenRouter | OpenRouter | Documentation"
---

MCP servers are a popular way of providing LLMs with tool calling abilities, and are an alternative to using OpenAI-compatible tool calling.

By converting MCP (Anthropic) tool definitions to OpenAI-compatible tool definitions, you can use MCP servers with OpenRouter.

In this example, we’ll use [Anthropic’s MCP client SDK](https://github.com/modelcontextprotocol/python-sdk?tab=readme-ov-file#writing-mcp-clients) to interact with the File System MCP, all with OpenRouter under the hood.

Note that interacting with MCP servers is more complex than calling a REST
endpoint. The MCP protocol is stateful and requires session management. The
example below uses the MCP client SDK, but is still somewhat complex.

First, some setup. In order to run this you will need to pip install the packages, and create a `.env` file with OPENAI\_API\_KEY set. This example also assumes the directory `/Applications` exists.

```code-block text-sm

```

Next, our helper function to convert MCP tool definitions to OpenAI tool definitions:

```code-block text-sm

```

And, the MCP client itself; a regrettable ~100 lines of code. Note that the SERVER\_CONFIG is hard-coded into the client, but of course could be parameterized for other MCP servers.

```code-block text-sm

```

Assembling all of the above code into mcp-client.py, you get a client that behaves as follows (some outputs truncated for brevity):

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

How do I integrate OpenRouter with LangChain for Python applications?

What is prompt caching and how can I use it to reduce costs with OpenRouter?

How do I enable web search capabilities to ground my AI model responses with real-time information?

What file formats does OpenRouter support and how do I send PDF documents to models?

How do I implement streaming responses and structured outputs with OpenRouter's API?
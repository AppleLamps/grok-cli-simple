---
url: "https://openrouter.ai/docs/features/tool-calling"
title: "Tool & Function Calling | Use Tools with OpenRouter | OpenRouter | Documentation"
---

Tool calls (also known as function calls) give an LLM access to external tools. The LLM does not call the tools directly. Instead, it suggests the tool to call. The user then calls the tool separately and provides the results back to the LLM. Finally, the LLM formats the response into an answer to the user’s original question.

OpenRouter standardizes the tool calling interface across models and providers, making it easy to integrate external tools with any supported model.

**Supported Models**: You can find models that support tool calling by filtering on [openrouter.ai/models?supported\_parameters=tools](https://openrouter.ai/models?supported_parameters=tools).

If you prefer to learn from a full end-to-end example, keep reading.

## Request Body Examples

Tool calling with OpenRouter involves three key steps. Here are the essential request body formats for each step:

### Step 1: Inference Request with Tools

```code-block text-sm

```

### Step 2: Tool Execution (Client-Side)

After receiving the model’s response with `tool_calls`, execute the requested tool locally and prepare the result:

```code-block text-sm

```

### Step 3: Inference Request with Tool Results

```code-block text-sm

```

**Note**: The `tools` parameter must be included in every request (Steps 1 and 3) so the router can validate the tool schema on each call.

### Tool Calling Example

Here is Python code that gives LLMs the ability to call an external API — in this case Project Gutenberg, to search for books.

First, let’s do some basic setup:

PythonTypeScript

```code-block text-sm

```

### Define the Tool

Next, we define the tool that we want to call. Remember, the tool is going to get _requested_ by the LLM, but the code we are writing here is ultimately responsible for executing the call and returning the results to the LLM.

PythonTypeScript

```code-block text-sm

```

Note that the “tool” is just a normal function. We then write a JSON “spec” compatible with the OpenAI function calling parameter. We’ll pass that spec to the LLM so that it knows this tool is available and how to use it. It will request the tool when needed, along with any arguments. We’ll then marshal the tool call locally, make the function call, and return the results to the LLM.

### Tool use and tool results

Let’s make the first OpenRouter API call to the model:

PythonTypeScript

```code-block text-sm

```

The LLM responds with a finish reason of `tool_calls`, and a `tool_calls` array. In a generic LLM response-handler, you would want to check the `finish_reason` before processing tool calls, but here we will assume it’s the case. Let’s keep going, by processing the tool call:

PythonTypeScript

```code-block text-sm

```

The messages array now has:

1. Our original request
2. The LLM’s response (containing a tool call request)
3. The result of the tool call (a json object returned from the Project Gutenberg API)

Now, we can make a second OpenRouter API call, and hopefully get our result!

PythonTypeScript

```code-block text-sm

```

The output will be something like:

```code-block text-sm

```

We did it! We’ve successfully used a tool in a prompt.

## Interleaved Thinking

Interleaved thinking allows models to reason between tool calls, enabling more sophisticated decision-making after receiving tool results. This feature helps models chain multiple tool calls with reasoning steps in between and make nuanced decisions based on intermediate results.

**Important**: Interleaved thinking increases token usage and response latency. Consider your budget and performance requirements when enabling this feature.

### How Interleaved Thinking Works

With interleaved thinking, the model can:

- Reason about the results of a tool call before deciding what to do next
- Chain multiple tool calls with reasoning steps in between
- Make more nuanced decisions based on intermediate results
- Provide transparent reasoning for its tool selection process

### Example: Multi-Step Research with Reasoning

Here’s an example showing how a model might use interleaved thinking to research a topic across multiple sources:

**Initial Request:**

```code-block text-sm

```

**Model’s Reasoning and Tool Calls:**

1. **Initial Thinking**: “I need to research electric vehicle environmental impact. Let me start with academic papers to get peer-reviewed research.”

2. **First Tool Call**: `search_academic_papers({"query": "electric vehicle lifecycle environmental impact", "field": "environmental science"})`

3. **After First Tool Result**: “The papers show mixed results on manufacturing impact. I need current statistics to complement this academic research.”

4. **Second Tool Call**: `get_latest_statistics({"topic": "electric vehicle carbon footprint", "year": 2024})`

5. **After Second Tool Result**: “Now I have both academic research and current data. Let me search for manufacturing-specific studies to address the gaps I found.”

6. **Third Tool Call**: `search_academic_papers({"query": "electric vehicle battery manufacturing environmental cost", "field": "materials science"})`

7. **Final Analysis**: Synthesizes all gathered information into a comprehensive response.


### Best Practices for Interleaved Thinking

- **Clear Tool Descriptions**: Provide detailed descriptions so the model can reason about when to use each tool
- **Structured Parameters**: Use well-defined parameter schemas to help the model make precise tool calls
- **Context Preservation**: Maintain conversation context across multiple tool interactions
- **Error Handling**: Design tools to provide meaningful error messages that help the model adjust its approach

### Implementation Considerations

When implementing interleaved thinking:

- Models may take longer to respond due to additional reasoning steps
- Token usage will be higher due to the reasoning process
- The quality of reasoning depends on the model’s capabilities
- Some models may be better suited for this approach than others

## A Simple Agentic Loop

In the example above, the calls are made explicitly and sequentially. To handle a wide variety of user inputs and tool calls, you can use an agentic loop.

Here’s an example of a simple agentic loop (using the same `tools` and initial `messages` as above):

PythonTypeScript

```code-block text-sm

```

## Best Practices and Advanced Patterns

### Function Definition Guidelines

When defining tools for LLMs, follow these best practices:

**Clear and Descriptive Names**: Use descriptive function names that clearly indicate the tool’s purpose.

```code-block text-sm

```

```code-block text-sm

```

**Comprehensive Descriptions**: Provide detailed descriptions that help the model understand when and how to use the tool.

```code-block text-sm

```

### Streaming with Tool Calls

When using streaming responses with tool calls, handle the different content types appropriately:

```code-block text-sm

```

### Tool Choice Configuration

Control tool usage with the `tool_choice` parameter:

```code-block text-sm

```

```code-block text-sm

```

```code-block text-sm

```

### Parallel Tool Calls

Control whether multiple tools can be called simultaneously with the `parallel_tool_calls` parameter (default is true for most models):

```code-block text-sm

```

When `parallel_tool_calls` is `false`, the model will only request one tool call at a time instead of potentially multiple calls in parallel.

### Multi-Tool Workflows

Design tools that work well together:

```code-block text-sm

```

This allows the model to naturally chain operations: search → get details → check inventory.

For more details on OpenRouter’s message format and tool parameters, see the [API Reference](https://openrouter.ai/docs/api-reference/overview).

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
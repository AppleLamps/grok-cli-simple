### Core Prompting Strategies (for all users)

* **Provide Specific Context:** Instead of letting tools auto-gather context, explicitly select the relevant code, file paths, project structures, or dependencies. Avoid including irrelevant information to keep the model focused.
* **Set Explicit Goals:** Be detailed and concrete in your requests. Avoid vague prompts (e.g., "create a food tracker") in favor of specific requirements (e.g., "create a food tracker showing daily calorie breakdown by nutrient with high-level trend views").
* **Iterate and Refine:** Since the model is fast (4x speed) and affordable (1/10th cost), use rapid iteration. If an initial output isn't perfect, refine the prompt by adding context or explicitly pointing out why the previous attempt failed (e.g., "The previous approach didn't consider the IO heavy process...").
* **Assign Agentic Tasks:** Use this model for tasks that require navigating code and using tools to implement changes, rather than simple one-shot Q&A. (Use Grok 4 for deep conceptual dives instead).

### Developer & API Specific Tips

* **Use Native Tool Calling:** The model is optimized for first-party native tool calling. Avoid using XML-based tool-call outputs as they may degrade performance.
* **Structure Context Clearly:** When introducing large amounts of context in the initial prompt, use XML tags or Markdown headings to clearly mark and define different sections.
* **Detailed System Prompts:** Write thorough system prompts that cover tasks, expectations, and edge cases.
* **Optimize for Caching:** Maintain a consistent prompt prefix during sequential tool use. Changing the prompt history can cause cache misses, significantly slowing down inference.

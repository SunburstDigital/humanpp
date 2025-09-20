# Modular Prompt & Tool Subsystem

This subsystem manages all modular, DB-driven prompts and tool (action) flows for Sunburst Digital AI.


## Folder Structure

- `/loader/` — Services to fetch, assemble, and inject prompts (DB, Pinecone, persona, slang, etc.)
- `/tools/` — Action handlers and tool registry
	- `/generic/` — Core tools, defined once for all verticals (never duplicated)
	- `/hospitality/`, `/real-estate/`, etc. — Industry-specific tools only (no generic tools)
- `/flows/` — Modular prompt files (JSON, text, or DB schema refs) for distinct conversational flows
- `/test/` — Unit/integration tests for prompts and tools
## Generic vs. Industry-Specific Tools

- **Generic tools** are defined only once in `/tools/generic/`.
	- These are core actions (e.g., saveContactDetails, bookAppointment) used by all verticals.
	- Never duplicate generic tools in any industry folder.
- **Industry folders** (e.g., `/tools/hospitality/`) contain only tools unique to that vertical.
	- Do not copy or override generic tools here.

### How to Use Generic Tools

- Import generic tools from `/tools/generic/` in any industry flow or handler as needed.
- Example:
	```js
	const saveContactDetails = require('../tools/generic/saveContactDetails');
	```

### Adding/Modifying Tools

- To add a new generic tool: create it in `/tools/generic/` with a JSDoc comment and export an async handler.
- To add a new industry tool: create it in the relevant industry folder only if it is unique to that vertical.

## Key Concepts

- **Prompt Swap:** Changing the system/user prompt for a conversation (context, persona, slang, etc.)
- **Tool Call:** Executing an action (e.g., book viewing, check loan status) via a handler function

See `/docs/Prompt-vs-Tool.md` for a detailed comparison.

## How It Works

- The loader fetches a prompt by ID, overlays persona and slang, and can pull from Pinecone or Supabase.
- Tools are modular action handlers, each exporting a function that receives parameters and returns a result.
- Flows define step-by-step conversational logic, referencing prompts and tools.

## Extending the Subsystem

- To add a new flow: Add a JSON/text file to `/flows/` or reference a DB ID.
- To add a new tool: Add a module to `/tools/` exporting a handler function.
- To add a new loader/injector: Add a service to `/loader/` and document it here.


## Rules

- No prompt/tool logic is allowed in handlers/routes outside this subsystem.
- **Generic tools:** One place, for all verticals—never duplicated.
- **Industry folders:** Unique tools only.
- Always document every new loader, tool, or flow in this README.
- All code must be modular, provider-agnostic, and DB-driven (no hardcoded prompts).
- Code must be clean, tested, and ready for integration.

## Contribution

1. Add or update loaders, tools, or flows as needed.
2. Write or update tests in `/test/` (e.g., `tools-generic.test.js`).
3. Document your changes in this README.
4. Notify the team (PM: Dave) for code review before integration.

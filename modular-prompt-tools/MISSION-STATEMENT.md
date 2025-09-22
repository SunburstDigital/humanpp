# Sunburst Digital AI — Modular Prompt Tools Mission Statement
## Mission
To build a modular, fully decoupled subsystem that manages all AI prompt flows and backend tool actions in a way that is:
- Provider-agnostic (works with any telephony or AI vendor)
- Industry-agnostic (easy to extend for new verticals or orgs)
- Scalable, maintainable, and 100% driven by data (not hardcoded)
## What This Subsystem Does
- **Separates all prompt logic and tool/action logic from the rest of the backend.**
- **Allows for fast swapping, versioning, or upgrading of prompts and flows for any client or use case, without code changes in handlers.**
- **Makes it trivial to add new flows (e.g., “New Buyer”, “New Renter”), new tools (e.g., “Book Viewing”, “Check Loan Status”), or overlays (voice persona, slang, org-specific instructions).**
- **Ensures that all prompt swaps and tool actions are logged, auditable, and easy to test.**
- **Paves the way for multi-language, multi-country, and multi-vertical AI operations.**
## Why We’re Doing This
- **To make the AI product “future proof” for new industries, orgs, and integrations.**
- **To minimize risk: All prompt and tool logic can be updated in DB or config—no redeploys needed.**
- **To support true modular flows: tools for actions, prompt swaps for guided conversations, overlays for context/persona/localization.**
- **To maximize speed of development and onboarding of new features, clients, and devs (human or AI).**
## Core Principles
- **No hardcoded prompts, flows, or tool logic in handlers or routes.**
- **All prompt and tool selection is DB-driven and modular.**
- **All “flows” (prompt swaps) and “tools” (actions) must be documented, testable, and discoverable.**
- **Every function must be auditable—log every swap or action for review and QA.**
- **Persona (voice, name), slang/pronunciation overlays, and localization are always injected automatically into every prompt.**
## What Success Looks Like
- New flows or tools can be added or swapped without touching production handler code.
- Any industry, org, or client can get a custom flow or action in minutes.
- Non-devs (or low-code users) can safely update prompts, flows, or overlays via DB/admin panel.
- Copilot and all devs know *exactly* where to add, update, or extend conversational flows and backend actions.
---

*This mission statement is the foundation for all work in `/modular-prompt-tools/`.  
All devs, AI agents, and contributors must understand and follow these principles.*

_Last updated: 2025-09-18_

## Mission

To build a modular, fully decoupled subsystem that manages all AI prompt flows and backend tool actions in a way that is:
- Provider-agnostic (works with any telephony or AI vendor)
- Industry-agnostic (easy to extend for new verticals or orgs)
- Scalable, maintainable, and 100% driven by data (not hardcoded)

## What This Subsystem Does

- **Separates all prompt logic and tool/action logic from the rest of the backend.**
- **Allows for fast swapping, versioning, or upgrading of prompts and flows for any client or use case, without code changes in handlers.**
- **Makes it trivial to add new flows (e.g., “New Buyer”, “New Renter”), new tools (e.g., “Book Viewing”, “Check Loan Status”), or overlays (voice persona, slang, org-specific instructions).**
- **Ensures that all prompt swaps and tool actions are logged, auditable, and easy to test.**
- **Paves the way for multi-language, multi-country, and multi-vertical AI operations.**

## Why We’re Doing This

- **To make the AI product “future proof” for new industries, orgs, and integrations.**
- **To minimize risk: All prompt and tool logic can be updated in DB or config—no redeploys needed.**
- **To support true modular flows: tools for actions, prompt swaps for guided conversations, overlays for context/persona/localization.**
- **To maximize speed of development and onboarding of new features, clients, and devs (human or AI).**

## Core Principles

- **No hardcoded prompts, flows, or tool logic in handlers or routes.**
- **All prompt and tool selection is DB-driven and modular.**
- **All “flows” (prompt swaps) and “tools” (actions) must be documented, testable, and discoverable.**
- **Every function must be auditable—log every swap or action for review and QA.**
- **Persona (voice, name), slang/pronunciation overlays, and localization are always injected automatically into every prompt.**

## What Success Looks Like

- New flows or tools can be added or swapped without touching production handler code.
- Any industry, org, or client can get a custom flow or action in minutes.
- Non-devs (or low-code users) can safely update prompts, flows, or overlays via DB/admin panel.
- Copilot and all devs know *exactly* where to add, update, or extend conversational flows and backend actions.

---

*This mission statement is the foundation for all work in `/modular-prompt-tools/`.  
All devs, AI agents, and contributors must understand and follow these principles.*

_Last updated: 2025-09-18_

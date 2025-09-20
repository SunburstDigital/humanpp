# Prompt Swap vs Tool Call — Sunburst Digital AI

## Overview

This document defines the difference between **Prompt Swaps (Modular Prompt Injection)** and **Tool Calls** in the Sunburst Digital AI system.  
**All devs, Copilot, and contractors must follow these rules to keep conversational logic and action flows clear, modular, and scalable.**

---

## Tool Calls

**Definition:**  
A “tool” is a function used to perform an action *outside* the main conversation, such as booking, retrieving, or updating something in a backend system.

- **When to use:**  
  - User requests a specific action (book, check, send, update).
  - AI needs to perform a backend or database action.
- **How it works:**  
  - AI calls the tool (backend function) with parameters from the conversation.
  - The *core prompt* (the conversational context) does **not change**.
  - The result is returned to the user, and the conversation continues with the original prompt.

- **Examples:**  
  - “I want to view 25 Main St” → Book Viewing tool
  - “What’s my loan status?” → Loan Status tool
  - “Send me pet-friendly rentals” → Property Search tool

---

## Prompt Swap (Modular Prompt Injection)

**Definition:**  
A “prompt swap” is when the AI switches to a new set of conversational instructions—guiding the user through a structured flow (e.g., onboarding, qualification, new listing).

- **When to use:**  
  - User triggers a distinct conversational path needing structured, multi-step Q&A.
  - AI identifies a need for a guided script, not just a one-off action.

- **How it works:**  
  - AI loads a new prompt from the prompts table (Supabase) for the required flow (e.g., New Buyer).
  - AI proceeds with the new Q&A, collects all required information.
  - When complete, the AI returns to the default prompt/context.

- **Examples:**  
  - “I want to buy a house” → New Buyer prompt (collects budget, timeline, pre-approval, etc.)
  - “I want to apply for finance” → Finance Customer prompt (collects income, employment, consent, etc.)
  - “I’m a new landlord” → New Listing prompt

---

## Summary Table

| Type        | Trigger                 | Does prompt swap? | Typical Use             | Conversation flow?         |
|-------------|------------------------|-------------------|-------------------------|----------------------------|
| **Tool**    | Action/intent          | ❌ No             | Bookings, info lookup   | Main prompt remains        |
| **Prompt**  | New guided flow        | ✅ Yes            | Qualifying, onboarding  | New Q&A, then return       |

---

## Implementation Rules

- **Tool = backend function/action, prompt stays the same**
- **Prompt swap = guided conversational flow, new prompt loaded from DB**
- **Never hardcode prompts or tool triggers—must be modular, updatable, and auditable**
- **Always log which tool or prompt is used for every flow/interaction**

---

_Last updated: 2025-09-18_
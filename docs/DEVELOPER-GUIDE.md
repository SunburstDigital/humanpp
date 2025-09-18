# Sunburst Digital AI — Developer Guide (2025-09-18, Copilot & Contractor Edition)

## Overview

This guide is the single source of truth for how to build, refactor, and maintain the Sunburst Digital AI codebase.  
It is designed for all contributors (human, Copilot, or contractors) and assumes that **the current folder and file structure in the repo is the true source of structure**—never assume, always check.

---

## 1. Provider Modularity & Drop-In Principle

**Golden Rule:**  
All logic related to telecom providers (Twilio, Telnyx, etc.) must live entirely within their own subfolders under `/providers/`.

- Do **NOT** place any provider-specific logic in routes, core services, business logic, or utils.
- Adding or swapping a provider should be a drop-in change:  
  - Add a new folder under `/providers/`
  - Implement handler files that match the function signatures used in the current repo
  - No rewrites or deep refactors required elsewhere

**Whenever in doubt, look at the repo's actual `/providers/` structure as your primary source.**

---

## 2. Route & Service Separation

- All HTTP routes must remain “thin.”  
  - Each route only imports and wires up a handler from the relevant provider module.
  - Never directly reference, parse, or manipulate provider events or APIs in route files.

- All business logic, AI, DB, memory, or tools must live outside of any provider code.

---

## 3. Supabase Integration

- Supabase is the single source of truth for persistent data (calls, logs, contacts, transcripts, etc.).
- All DB fields, tables, and logic must match the canonical schema in `/supabase-schema.sql` and the latest documentation (e.g., `/docs/Supabase Schema - Ai Voice System.docx`).
- Use `audio_path` and `transcript_path` for file locations; **never store signed/expiring URLs in the DB**.
- Explicit, actionable error logging must be present in all Supabase interactions.

---

## 4. Testing & Automation

- All dev/test orchestration scripts live in `/tools/` (e.g., `dev-orchestrator.ps1`, etc.).
- Use Jest (or your project’s current test runner) to test **all HTTP endpoints and provider integrations**.
- All endpoints must return `200 OK` for test payloads (to enable CI/CD).
- Maintain a manual and automated test checklist in `/docs/` as per the repo.

---

## 5. Deployment & Entry Points

- All production, Docker, and deploy scripts must use the current main server entry point (see `server.js` or as defined in the repo).
- Keep dev and prod deployment processes in sync. Never introduce dev-only hacks.

---

## 6. Documentation

- Every major change, new endpoint, or architectural refactor must be documented in `/docs/`.
- Each `/providers/` subfolder must have a `README.md` summarizing its handler functions and usage.
- Route files should reference their imported handlers and document the endpoint logic.

---

## 7. Error Handling & Logging

- All handlers must provide explicit, actionable error logs—never generic or swallowed errors.
- All failures (DB, provider, business logic) must surface in logs and API responses.

---

## 8. Naming Conventions & Best Practices

- All handler/function names must be descriptive and provider-scoped (e.g., `twilioHandleIncomingSms`, `telnyxHandleCallSummary`).
- All code must be linted, modular, and maintainable.
- Never break modularity or abstraction for a quick fix or hack.

---

## 9. Adding or Swapping Providers

- To add a new provider:
  - Create a new subfolder in `/providers/`.
  - Implement all required handler files, matching function signatures found in the current codebase.
  - Ensure all route files import the correct handler for their endpoint.
  - Update provider selection logic if dynamic switching is used.
  - Document all new handlers and structural changes in `/docs/` and the provider’s `README.md`.

- **Never edit routes, services, or business logic just to add or swap a provider.**

---

## 10. Copilot & Contractor Rules

- **Always modularize:** All provider-specific logic goes in `/providers/[provider]/` (see actual repo).
- **Routes are thin:** Only wire up and import handlers.
- **Supabase is the data source:** Never use other sources for persistence.
- **Automate testing:** Use PowerShell, Jest, or the project’s current test runner.
- **Log everything explicitly:** Never swallow errors.
- **Document every change:** Keep `/docs/` and all `README.md` files up to date.
- **Never break modularity, abstraction, or naming conventions.**
- **Never assume the file structure—always check the current repo before coding or refactoring.**

---

## 11. Quick Start for New Devs (or Copilot)

1. **Clone the repo and review the actual file/folder structure.**
2. **Read this guide and all `/README.md` files in `/providers/`, `/routes/`, and `/docs/`.**
3. **Never write provider logic outside of the `/providers/` folder.**
4. **Run the dev orchestrator (`dev-orchestrator.ps1`) or the standard local dev command as per project docs.**
5. **Test and lint all code before pushing.**
6. **Document all changes in `/docs/` or the relevant `README.md`.**
7. **Ask questions or review previous commits if in doubt—PKBA/TCDC standard.**

---

_Last updated: 2025-09-18.  
File/folder structure is always determined by the current repo; do not assume!_

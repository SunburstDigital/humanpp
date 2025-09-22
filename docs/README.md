# Sunburst Digital AI – Documentation Index

All project documentation is organized into subject-specific folders.  
This `README.md` is the only file in the `/docs` root.

---


## 📂 Documentation Structure
- [ai/](ai/) – AI testbed, policies, integrations  
- [api/](api/) – API references and endpoints  
- [architecture/](architecture/) – System and conversation design docs  
- [infra/](infra/) – Infrastructure, schemas, and dev setups  
- [onboarding/](onboarding/) – Client onboarding SOPs and checklists  
- [messaging/](messaging/) – Messaging flows and guides  
- [workflow/](workflow/) – Development workflows, notes, prompts  
- [guides/](guides/) – Developer guides, references, comparisons  
- [planning/](planning/) – Roadmaps, engagement flows, clarifications  
- [rules/](rules/) – Numbers, domains, SMS routing rules  
- [testing/](testing/) – Testing guides and coverage  
- [troubleshooting/](troubleshooting/) – Troubleshooting guides  

---

👉 Start with [architecture/](architecture/) for system design,  
or [onboarding/](onboarding/) for client-facing setup.
client-onboarding.md
 → Initial onboarding process.

project-checklist.md
 → Tasks and milestones.

Tech Tasks And Dev Modules.docx
 → Technical breakdowns.

system-prompts.md
 → Prompt libraries + flow references.

twilio-routing.js
 → Early routing logic.

calendar-sync-guide.md
 → Calendar integration notes.

gpt-realtime-integration.md
 → Realtime AI integration guide.

Ai Voice System Project Spec.docx
 → Voice system spec.

Client Setup Checklist.docx
 → What’s needed for client builds.

Supabase Schema - Ai Voice System.docx
 → Early schema notes.

fastify-endpoints.js
 → Endpoint definitions.

pinecone-schema.md
 → Memory schema notes.

supabase-schema.sql
 → SQL schema draft.

transcript-endpoints.js
 → Transcript logic.

Client Portal MVP Map.docx
 → Portal structure.

Prompt Flow Builder.docx
 → Prompt flow buildout.

roadmap.md
 → Development roadmap.

ai-testbed.md
 → Testbed notes.

messaging-guide.md
 → Messaging framework.

📞 Comms + Conversation Docs

telnyx-setup.md
 → Why Telnyx was rejected.

plivo-vs-twilio.md
 → Feature + cost comparison.

comms-strategy.md
 → Codec rules, latency targets, failover.

conversation-schema.md
 → Final SQL schema.

conversation-lifecycle.md
 → Active, stale, expired, guest rules.

active-sessions.md
 → Live session management.

copilot-master-prompt.md
 → Canonical Copilot Pro prompt (routes + tests).

onboarding-checklist.md
 → Client info collection (numbers, staff, socials).

dev-notes.md
 → Gotchas, rules, open questions.

🚦 Quick Start

New client? → onboarding-checklist.md

Voice/number setup? → plivo-vs-twilio.md

Conversation logic? → conversation-lifecycle.md

Building routes? → copilot-master-prompt.md

Debugging? → dev-notes.md

🔑 Rules of Thumb

Phone number = universal key. Guests expire after 24h and get deleted.

Opus = orb/web only. PSTN = G.711.

Twilio first. Plivo is cost fallback.

Scrapers = Playwright/Cheerio in repo. No Apify needed.

Docs = source of truth. If it’s not here, it didn’t happen.
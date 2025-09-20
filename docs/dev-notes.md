# Developer Notes

- Phone number = universal key. Must capture early.
- Guest handling: no phone → guest → 24h max → delete.
- Opus = only for orb. PSTN = G.711 everywhere.
- Don’t waste time chasing Telnyx. Twilio = default, Plivo = cost fallback.
- Copilot Pro required for multi-file context + test scaffolding.
- Always document decisions as they’re made → update `/docs`.

Open questions:
- Do we need WhatsApp **voice**? (currently text only).
- Do we store **attachments** in chunks or separate table?
- Best way to enrich “goals” automatically?


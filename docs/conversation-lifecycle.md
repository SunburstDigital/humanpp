# Conversation Lifecycle

## States
- **active:** Conversation ongoing.
- **stale:** No reply for 10m.
- **expired:** No reply for 24h.
- **closed:** Manually ended.
- **guest:** Active but no phone → auto-deletes on expiry.

## Rules
1. Always ask for **phone + name** at start.
2. If user refuses → session allowed as guest for max 24h.
3. Guests auto-deleted on expiry.
4. If phone provided later → merge guest → contact.

## Multi-Channel Continuity
- Phone number = universal key.
- Messenger/IG PSID ↔ phone mapping.
- Calls + chats merged into single conversation if identity matches.
- Chunks can be role='voice' for calls.

## Proactive Nudges
- If chat goes quiet but still within 24h:
  - Send value (ebook, demo).
  - Soft CTA for conversion.

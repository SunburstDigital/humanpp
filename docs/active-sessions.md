# Active Sessions

## Purpose
Track live conversations without rebuilding prompts every message.

## Model
- One `conversation` → many `chunks`.
- AI uses goal, summary, and recent chunks.
- Steps track pending follow-ups.

## Special Cases
- If chat switches to call:
  - Append voice chunk.
  - Same conversation continues.
- If user stops replying:
  - Before 24h expiry, send nudge.
- If guest:
  - Expire + delete after 24h.

## Benefits
- Lightweight memory.
- Clear “open vs closed” sessions.
- Works across SMS, Messenger, WhatsApp, Orb, voice.

# Telnyx Setup (Abandoned)

## Status
- ❌ Telnyx rejected for production.
- Reason: No Australian POP, no full Opus end-to-end, misleading marketing (advertised AU coverage without full features).

## What We Tried
1. Bought AU number → forced to anchor in Ashburn, VA.
2. Configured Opus codec only → PSTN fallback still G.711.
3. Confirmed no native Opus → only WebRTC demo support.

## Decision
- Telnyx does **not meet requirements** for Sunburst Digital AI.
- Use Twilio or Plivo instead (see `/docs/plivo-vs-twilio.md`).

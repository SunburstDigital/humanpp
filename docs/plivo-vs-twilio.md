# Plivo vs Twilio

## Must-Haves
- Full-duplex Opus for orb/webchat → G.711 acceptable for PSTN.
- Reliable Australian POPs (low latency).
- Stable pricing for SMS + voice.
- Failover and redundancy built-in.

## Twilio
- ✅ Most stable global coverage.
- ✅ WhatsApp + Messenger integrations.
- ✅ Massive ecosystem support.
- ❌ Support costs extra.
- 💰 Higher baseline costs.

## Plivo
- ✅ Cheaper calls/SMS (up to ~40% lower).
- ✅ WhatsApp support.
- ✅ Easier billing (usage-based).
- ❌ Only Opus on WebRTC leg, not PSTN.
- ❌ Smaller ecosystem, fewer integrations.

## Decision
- Start with **Twilio** for reliability + integrations.
- Revisit **Plivo** if call/SMS volumes explode and cost pressure rises.

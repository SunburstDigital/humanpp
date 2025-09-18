# Human++ / Sunburst Digital AI — Telnyx Integration Master README

> **Purpose:**  
> This document is the definitive project, technical, and operational reference for migrating and operating all programmable voice and SMS under Telnyx.  
> For developers, project managers, QA, and future team onboarding.

---

## Table of Contents

1. [Core Benefits](#core-benefits)
2. [API & Account Setup](#api--account-setup)
3. [Number Provisioning](#number-provisioning)
4. [Webhook Endpoints](#webhook-endpoints)
    - [Voice Events](#voice-events)
    - [SMS Events](#sms-events)
5. [Media Streaming & WebSocket Audio Handling](#media-streaming--websocket-audio-handling)
6. [AI Audio Pipeline & Best Practices](#ai-audio-pipeline--best-practices)
7. [Advanced Streaming Setup, Scaling & Tuning](#advanced-streaming-setup-scaling--tuning)
8. [Cost Tracking & Database Schema](#cost-tracking--database-schema)
9. [Authentication, Security & Compliance](#authentication-security--compliance)
10. [Porting Numbers](#porting-numbers)
11. [Troubleshooting & Ops](#troubleshooting--ops)
12. [Developer Code Snippets (Node.js/Fastify)](#developer-code-snippets-nodejsfastify)
13. [Project Management, QA & Team Handoff](#project-management-qa--team-handoff)
14. [Website Messaging & Marketing Ideas](#website-messaging--marketing-ideas)
15. [References & Resources](#references--resources)

---

## Core Benefits

- **Massive cost savings** (calls, SMS, number rental)
- **Private global backbone** — better call quality, lower jitter/latency
- **Native real-time media streaming** (WebSocket), high-fidelity codecs (OPUS, PCM16)
- **Per-call/message cost included in all webhook payloads**
- **No sub-accounts or fragmented billing**
- **Direct API integration — pure programmable control**
- **Fully scalable — all numbers centrally owned and managed**

---

## API & Account Setup

1. **Register Telnyx account** and complete business KYC.
2. **Create API key** for use in all backend/API/webhook integrations (`TELNYX_API_KEY`).
3. **Webhook signing key**: Copy from Telnyx portal for verifying all incoming webhook events.

---

## Number Provisioning

- **Buy AU mobile or local numbers** via portal (prefer “voice+SMS enabled”).
- Assign each number to:
    - **Voice Profile** (set your webhook for inbound calls)
    - **Messaging Profile** (set your webhook for inbound SMS)
- **API Example**:
    ```sh
    curl -X POST "https://api.telnyx.com/v2/number_orders" \
    -H "Authorization: Bearer $TELNYX_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"phone_numbers":[{"phone_number":"+61480094024"}]}'
    ```

---

## Webhook Endpoints

### Voice Events

- Webhook URL: `https://api.yoursite.com/telnyx/webhook`
- Handle:
    - `call.initiated`
    - `call.answered`
    - `call.hangup`
    - `streaming.started`
    - `streaming.stopped`

**Sample JSON:**
```json
{
  "data": {
    "event_type": "call.answered",
    "payload": { "call_control_id": "v2:xxxxx", "call_leg_id": "uuid", ... },
    "meta": { "attempt":1, "delivered_to":"..." }
  }
}
SMS Events
Webhook URL: https://api.yoursite.com/telnyx/sms

Handle:

message.received (inbound)

message.finalized (delivery + cost)

Sample JSON:

json
Copy code
{
  "data": {
    "event_type": "message.finalized",
    "payload": {
      "direction": "outbound",
      "from": { "phone_number": "+61480094024" },
      "to": [{ "phone_number": "+61412XXXXXX", "status": "delivered" }],
      "text": "Hello!",
      "cost": { "amount": "0.0051", "currency": "USD" }
    }
  }
}
Media Streaming & WebSocket Audio Handling
On call.answered, POST to Telnyx API with stream_url (your WS endpoint):

sh
Copy code
curl -X POST "https://api.telnyx.com/v2/calls/{call_control_id}/actions/answer" \
-H "Authorization: Bearer $TELNYX_API_KEY" \
-H "Content-Type: application/json" \
-d '{"stream_url": "wss://ai.yoursite.com/stream", "stream_track": "both_tracks"}'
WebSocket session:

Receives { "event":"connected" }, then { "event":"start", ... }, then { "event":"media", ... }

Media payloads are base64 RTP/PCM audio chunks.

AI Audio Pipeline & Best Practices
Live, Real-Time “Voice-to-Voice” Setup
No file uploads, no disk recording — all audio handled live in memory/buffer

Process each “media” frame instantly and stream to AI STT (e.g., OpenAI Realtime, Whisper)

AI generates text reply, then TTS generates audio response

POST response audio immediately to Telnyx for playback — no batching, no delay

Prefer 16kHz PCM (L16) or OPUS codecs for highest fidelity (configure on trunk, or request on WS start)

Target sub-500ms roundtrip latency for “human-quality” conversation

Advanced Streaming Setup, Scaling & Tuning
Each call = 1 WS connection + 1 AI session

Use async, non-blocking code for frame handling

Implement jitter, silence detection, and buffer overflow handling

Cluster/scale Node.js app for high concurrency (horizontal scaling)

Log per-call codec, sample rate, latency, cost, errors

Monitor real-time: active calls, average latency, errors, cost/minute

Zero-downtime deployment: always test with dev number before updating production numbers

Cost Tracking & Database Schema
Every call/SMS webhook includes cost fields:

Voice: payload.cost.amount (USD), payload.cost.currency

SMS: payload.cost.amount, payload.cost.currency

Schema Example:

sql
Copy code
ALTER TABLE calls ADD COLUMN cost_amount DECIMAL(8,4);
ALTER TABLE calls ADD COLUMN cost_currency VARCHAR(4);
ALTER TABLE messages ADD COLUMN cost_amount DECIMAL(8,4);
ALTER TABLE messages ADD COLUMN cost_currency VARCHAR(4);
Store and map costs per client/number for reporting and pass-through billing.

Authentication, Security & Compliance
REST/WS: Bearer API Key

Verify Ed25519 signature on every webhook event

Accept POSTs only from Telnyx IPs (documented in portal)

Encrypt call/SMS cost data at rest

By default, do not record/store audio unless required for compliance

Porting Numbers
Submit porting request in portal (from Twilio or other carrier)

Upload LOA, ID/business doc as required

Test/dev numbers used until port is complete (no downtime)

Repoint all webhooks/configs to ported number post-migration

Troubleshooting & Ops
"Pending" state: KYC review in progress (normal)

No webhook received: Check endpoint URL, HTTPS, firewall, fast response (<2s)

No audio: Check voice profile, media streaming config, codec match

SMS missing: Confirm number is SMS-enabled, correct messaging profile set

Developer Code Snippets (Node.js/Fastify)
Voice Webhook:

js
Copy code
fastify.post('/telnyx/webhook', async (req, reply) => {
  const { event_type, payload } = req.body.data;
  if (event_type === 'call.answered') {
    await fetch(`https://api.telnyx.com/v2/calls/${payload.call_control_id}/actions/answer`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.TELNYX_API_KEY}` },
      body: JSON.stringify({ stream_url: 'wss://ai.yoursite.com/stream', stream_track: 'both_tracks' }),
    });
  }
  if (event_type === 'call.hangup' && payload.cost) {
    await supabase.from('call_logs').insert({
      call_id: payload.call_control_id,
      cost_amount: payload.cost.amount,
      cost_currency: payload.cost.currency,
      // ...
    });
  }
  reply.code(200).send();
});
SMS Webhook:

js
Copy code
fastify.post('/telnyx/sms', async (req, reply) => {
  const { event_type, payload } = req.body.data;
  if (event_type === 'message.finalized' && payload.cost) {
    await supabase.from('messages').insert({
      message_id: payload.message_id,
      cost_amount: payload.cost.amount,
      cost_currency: payload.cost.currency,
      // ...
    });
  }
  reply.code(200).send();
});
WebSocket Audio Handler:

js
Copy code
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 443, path: '/stream' });
wss.on('connection', ws => {
  ws.on('message', async msg => {
    const data = JSON.parse(msg);
    if (data.event === 'media') {
      const pcm = Buffer.from(data.payload, 'base64');
      // Forward to AI STT, process in memory (no disk)
      // AI reply -> TTS -> POST to Telnyx playback
    }
  });
});
Project Management, QA & Team Handoff
Onboard every new dev with this README + API keys (dev only) + WS endpoint

QA checklist:

Test call, verify roundtrip latency, cost logging, event logs

Confirm “speak → hear AI → AI speaks back” cycle is sub-500ms

All flows tested on dev number before mainline or ported numbers

Deployment:

Dev/test number always first, then port over/activate main numbers

Monitor errors/latency post-deploy (1h minimum soak)

Website Messaging & Marketing Ideas
Leverage These Infrastructure Upgrades for Client-Facing Sales Copy:
“Crystal-Clear, Real-Time Calls — Every Time”
“We run on our own private communications backbone. That means you and your clients get clear, reliable calls—no matter where you are, every time.”

“Built for AI, Not Call Centers”
“Our system streams live, high-definition audio direct to our AI, enabling instant answers and lightning-fast booking—no wait, no repeats, no awkward pauses.”

“Pass-Through Savings—No Hidden Markups”
“All call and SMS costs are billed at cost, not marked up. You pay only for what you use, transparently.”

“No Missed Calls, No Missed Opportunities”
“With our modular platform, you’ll never lose a lead due to network congestion or dropped calls. We scale instantly as you grow.”

“Enterprise Security and Compliance”
“All call and message data is encrypted and never stored unless required for compliance. Your privacy and your client’s privacy are guaranteed.”

“Future-Proof Technology”
“As AI evolves, so does your system—without the pain of switching providers or losing call quality.”

Feature/Benefit Table for Website:
Feature	Human++ / Sunburst Digital AI	Old-School Providers
Private backbone	✅ Yes	❌ No (public internet)
Pass-through comms billing	✅ Yes	❌ No
True real-time AI streaming	✅ Yes	❌ No (uploads/delays)
HD call quality (OPUS/L16)	✅ Yes	❌ No
No sub-accounts required	✅ Yes	❌ No
Plug-and-play scaling	✅ Yes	❌ No
Future-proofed AI stack	✅ Yes	❌ No

References & Resources
Telnyx Developer Docs

Voice API

Messaging API

Webhook Event Types

API Authentication

Media Streams

AU Number Compliance

End of File — All devs, PMs, and ops must read and update this doc as infrastructure evolves.
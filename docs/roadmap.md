# ============================================================================
# START File: roadmap.md
# ============================================================================
# Sunburst Voice System — Project Roadmap

## Phase 1 — Skeleton
- ✅ Fastify bootstrap (`app.js`)
- ✅ Pino logging with pretty/JSON modes
- ✅ `.env` loaded, keys available
- ✅ Health route `/health` tested

## Phase 2 — Inbound SMS & Calls
- ✅ `/twilio/incoming-sms` route live (logs + AI responds)
- ✅ `/twilio/sms-status` route logs delivery
- ✅ AI replies to SMS tested successfully
- ✅ `/twilio/incoming-call` route with TwiML `<Stream>` confirmed
- ✅ AI answered live phone call

## Phase 3 — Realtime Voice Loop
- ✅ End-to-end Twilio <Stream> → OpenAI Realtime → AI voice tested
- ✅ Basic speech-in/speech-out loop working
- 🚧 Needs better prompt injection
- 🚧 Add error handling & resilience (network drops, Twilio reconnects)

## Phase 4 — Call Control & Transfers
- 🚧 Live transfer logic (`<Dial>`) not yet wired
- 🚧 Handoff intent detection pending
- 🚧 Multiple staff routing logic needed

## Phase 5 — Memory Layer
- ✅ Supabase `call_logs` table (sms_inbound, sms_status, call_status, call_start, call_end, transcript_meta)
- ✅ Supabase `transcripts_meta` table aligned to schema
- ✅ Supabase `transcripts` bucket (audio + JSON uploads confirmed)
- ✅ Summaries stored in `call_logs`
- 🚧 Pinecone integration next: only **vectorised summaries/notes** stored, not raw transcripts
- 🚧 Index summaries under namespace `transcripts`

## Phase 6 — Lead & Booking Flows
- 🚧 **Reminders**: outbound SMS/email before appointments (SendGrid + Twilio)
- 🚧 **Reschedules**: AI detects & updates booking, sends confirmation
- 🚧 **Cancellations**: AI cancels + frees slots, confirms via SMS/email
- 🚧 **Review Chasing**: timed SMS/email automation post-appointment
- 🚧 **Automation Engine**: Supabase triggers + Make scenarios
- 🚧 Calendar sync (Outlook, Gmail) still pending

## Phase 7 — Integrations
- 🚧 CRM integration (replaced GHL with native Supabase + Make flows)
- 🚧 Webhooks for Slack/email alerts
- 🚧 Review management loop extensions

## Phase 8 — Hardening & Deployment
- 🚧 Structured test harness in PowerShell (`humanpp-dev.ps1`)
- 🚧 Fly.io deploy with domain
- 🚧 Error logging, retries, metrics
- 🚧 **AI Test Bed**: automated caller AI places test calls to Sunburst
	- Confirms realtime loop works
	- Checks Supabase logs + transcripts
	- Sends outbound status notification
	- Example: “Eva’s been tested and is functioning perfectly so she will be answering your calls today”

---

## Business Assets & SOP
- 🚧 43-page website design + build
- 🚧 Ebooks + demo packs
- 🚧 Portal design + build (client dashboard)
- 🚧 Facebook + Instagram pages
- 🚧 SOP for trials → client conversion
- 🚧 Apify scraper for real estate listings
- 🚧 Agency website content updates + new internal pages

# ============================================================================
# END File: roadmap.md
# ============================================================================

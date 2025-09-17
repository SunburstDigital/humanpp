# Sunburst Voice System (Fastify + Twilio + OpenAI Realtime + Supabase)

## 📌 Overview
This service powers the **Sunburst Voice AI Receptionist**:
- Handles Twilio inbound calls & SMS
- Bridges live audio to OpenAI Realtime models
- Logs calls/SMS into Supabase (contacts + call_logs)
- Supports AI tool calls (listing_match, calendar_book, CRM inject)
- Modular design: clean separation of routes, services, and utils

---

## 📂 Project Structure

/src
app.js # Fastify bootstrap
/routes
health.js # Root + health checks
sms.js # Inbound SMS + status callbacks
calls.js # Call status callbacks
logs.js # Debug log endpoints
media-stream.js # Twilio <Stream> ↔ OpenAI bridge
tools.js # AI tool routing
/services
supabase.js # Supabase client + helper functions
pinecone.js # Pinecone RAM/search layer
transcripts.js # Transcript storage endpoints (optional)
/utils
session-notes.js # Session notes helpers + XML escaping
logging.js # Pino logger config

makefile
Copy code

---

## ⚙️ Environment Variables

Set these in `.env` (for local dev) and in **Fly.io secrets** for production.

```bash
# OpenAI
OPENAI_API_KEY=sk-xxxx
OPENAI_REALTIME_MODEL=gpt-realtime-2025-08-28

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=service-role-key
ENABLE_TRANSCRIPTS=1

# Pinecone
PINECONE_API_KEY=pc-xxxx
PINECONE_ENVIRONMENT=us-west1-gcp

# Webhooks
MAKE_WEBHOOK_BOOK=https://hook.integromat.com/abc123  # optional booking forwarder

# Server
PORT=3000
PUBLIC_HOSTNAME=sunburst-voice.fly.dev
NODE_ENV=development  # "production" on Fly
🖥️ Local Development
bash
Copy code
# Install deps
npm install

# Run dev server
npm run dev

# OR run normally
node src/app.js
Test endpoints:

bash
Copy code
# Health check
curl http://localhost:3000/health

# Simulate SMS
curl -X POST http://localhost:3000/twilio/incoming-sms \
  -d "From=+61412345678&Body=Hello" \
  -H "Content-Type: application/x-www-form-urlencoded"

# Simulate call status
curl -X POST http://localhost:3000/twilio/call-status \
  -d "CallSid=CA123&CallStatus=completed" \
  -H "Content-Type: application/x-www-form-urlencoded"

# Debug logs
curl http://localhost:3000/logs/recent
🚀 Deploy to Fly.io
Install CLI:

bash
Copy code
flyctl auth login
Create the app:

bash
Copy code
flyctl launch
Set secrets:

bash
Copy code
flyctl secrets set OPENAI_API_KEY=sk-xxxx SUPABASE_URL=... SUPABASE_SERVICE_KEY=... PINECONE_API_KEY=...
Deploy:

bash
Copy code
flyctl deploy
Tail logs:

bash
Copy code
flyctl logs
📞 Twilio Setup
In the Twilio Console, configure your phone number Messaging and Voice webhooks:

Messaging → https://<your-app>.fly.dev/twilio/incoming-sms

Voice → https://<your-app>.fly.dev/twilio/incoming-call

Status Callback → https://<your-app>.fly.dev/twilio/call-status

SMS Status Callback → https://<your-app>.fly.dev/twilio/sms-status

🛠️ Debug Endpoints
/logs/recent → last 10 call/SMS logs (with contact join)

/logs/contact/:phone → all logs for one phone number

/logs/supabase-check → verify DB connection

🔮 Coming Soon
Notifications & Alerts (Slack/Email/SMS)

Review Automation

CRM sync expansion

Advanced analytics endpoints

📖 Notes
Logging uses Pino. In dev (NODE_ENV=development) logs are pretty-printed.

All Twilio replies must return 200 OK within ~15s. We keep routes light and async-safe.

Modular routes make it easy to extend — just add a file in /routes and register in app.js.


Caller
   │
   ▼
Twilio (Voice/SMS Gateway)
   │
   │ Voice <Stream>
   ▼
Fly.io (Fastify app)
   ├── /twilio/incoming-call → returns TwiML
   ├── /media-stream ↔ bridges audio to OpenAI Realtime
   ├── /twilio/incoming-sms → logs & replies
   ├── /twilio/call-status → logs status
   └── /twilio/sms-status → logs SMS delivery
   │
   ├── Supabase (contacts, call_logs, transcripts)
   ├── Pinecone (semantic search for listings)
   └── Tools (calendar booking, CRM sync, property match)
   │
   ▼
OpenAI Realtime (gpt-realtime-2025-08-28)
   │
   ▼
Twilio → Caller
   (AI voice + SMS replies)



sequenceDiagram
    participant C as Caller
    participant T as Twilio
    participant F as Fly.io (Fastify)
    participant O as OpenAI Realtime
    participant S as Supabase/Pinecone

    C->>T: Dials / Sends SMS
    T->>F: POST /twilio/incoming-call or /incoming-sms
    F->>S: Log contact + call/SMS
    F->>O: Bridge audio (WS)
    O-->>F: Audio/Text response
    F-->>T: TwiML / Media Stream
    T-->>C: AI Voice/SMS response
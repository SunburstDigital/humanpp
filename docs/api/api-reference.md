# API Reference

## Current Endpoints

### SMS
- `POST /twilio/incoming-sms` — Handle inbound SMS from Twilio
- `POST /twilio/sms-status` — Handle Twilio SMS status callbacks

### Calls
- `POST /twilio/call-status` — Handle Twilio call status callbacks
- `POST /twilio/call-start` — Handle Twilio call start events

### Call Summaries
- `POST /calls/summary` — Handle call summary data from Twilio

### Media
- `GET /media-url` — Get a signed media URL
- `POST /twilio/incoming-call` — Handle inbound Twilio call (media stream)
- `GET /media-stream` (WebSocket) — Start a Twilio media stream

### Logs
- `GET /logs/recent` — Get recent logs
- `GET /logs/contact/:phone` — Get logs for a specific contact
- `GET /logs/supabase-check` — Check Supabase log connection

### Health
- `GET /` — Health check (root)
- `GET /health` — Health check (detailed)

---

Add new endpoints here as you implement them. Update descriptions as logic changes.

# Sunburst AI Test Bed – Automated System QA

## Purpose
Automate daily reliability tests for Sunburst Digital AI voice receptionists.

## Flow
1. **Outbound Test Call**: Bot dials Twilio AI number, runs scripted test (greeting, booking, hangup).
2. **Verification**: Checks Supabase logs (call logs, transcripts) for expected data.
3. **Result Logging**: Logs test outcome in Supabase system_logs.
4. **Notification**: On pass, SMS/email “All systems go!”; on fail, Slack/email alert for urgent fix.

## Tech
- Twilio API (outbound/inbound)
- OpenAI Realtime (voice bot)
- Supabase (logging/audit)
- SendGrid/Twilio/Slack (notifications)

**Note:** Ensure all referenced endpoints and notification flows are up to date with your current backend logic!

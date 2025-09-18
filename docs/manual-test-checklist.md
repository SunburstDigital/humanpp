# Manual Test Checklist for humanpp Backend

## 1. Health and Status
- [ ] GET `/health` returns 200 and `{ ok: true }`.
- [ ] GET `/` returns 200 and a welcome message.

## 2. Call Summary
- [ ] POST `/calls/summary` with valid data returns 200 and saves the summary.
- [ ] POST `/calls/summary` with missing fields returns 400.

## 3. Logs
- [ ] GET `/logs/recent` returns 200 and a list of logs.
- [ ] GET `/logs/contact/{phone}` returns 200 and logs for that contact.
- [ ] GET `/logs/supabase-check` returns 200 and a status message.

## 4. Media
- [ ] GET `/media-url?path=somefile&expires=60` returns 200 and a signed URL.
- [ ] GET `/media-url` without `path` returns 400.

## 5. Twilio Endpoints
- [ ] POST `/twilio/incoming-sms` with a sample payload returns 200.
- [ ] POST `/twilio/sms-status` with a sample payload returns 200.
- [ ] POST `/twilio/call-status` with a sample payload returns 200.
- [ ] POST `/twilio/call-start` with a sample payload returns 200.

## 6. WebSocket
- [ ] Connect to `/media-stream` via WebSocket and verify connection (if used).

## 7. Error Handling
- [ ] Invalid routes return 404.
- [ ] Invalid payloads return 400 or 500 as appropriate.

## 8. End-to-End
- [ ] Simulate a full workflow (e.g., incoming call, summary, log retrieval) and verify data consistency.

---

> You can execute these tests one by one using curl, PowerShell, Postman, or any HTTP client. If you want automation for these, let me know!

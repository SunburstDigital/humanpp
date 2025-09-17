# ============================================================================
# START File: ai-testbed.md
# ============================================================================
# AI Test Bed — Automated System QA

## Purpose
Provide continuous reliability testing of Sunburst AI receptionists.  
Ensures availability and functionality before live client calls each day.

---

## Flow
1. **Outbound Call**  
   - Test Bot uses Twilio API to place a call to Sunburst inbound number.  
   - Runs a scripted “natural” call cycle: greeting, question, reschedule, hang up.  

2. **Conversation Simulation**  
   - Test Bot powered by OpenAI Realtime simulates caller voice.  
   - Expected: Eva responds within configured latency.  

3. **Verification**  
   - After call, check Supabase `call_logs` + `transcripts_meta`.  
   - Validate: log entries created, transcript stored, summary written.  

4. **Result Logging**  
   - Write test outcome into Supabase `system_logs`.  

5. **Notification**  
   - If pass → send status message via SMS/email:  
     - “Eva’s been tested and is functioning perfectly so she will be answering your calls today.”  
   - If fail → alert via Slack/email:  
     - “Eva test failed — realtime loop not responding. Investigate immediately.”  

---

## Schedule
- Run test every morning before client business hours.  
- Optional: run hourly heartbeat tests during live hours.

---

## Tech
- Twilio API for outbound dial.  
- OpenAI Realtime for simulated caller.  
- Supabase for log verification.  
- SendGrid/Twilio/Slack for notifications.

# ============================================================================
# END File: ai-testbed.md
# ============================================================================

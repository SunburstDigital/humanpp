# ============================================================================
# START File: messaging-guide.md
# ============================================================================
# Messaging Guide — Outbound SMS & Email

## Purpose
Centralise outbound messaging logic for the Sunburst Voice System.  
All routes and flows call a **single service layer** (`services/messaging.js`), while **Make** handles scheduled/time-based automations.

---

## SMS — Twilio
- **Helper**: `sendSms(to, body)`
- **Backend**: Twilio REST API
- **Use cases**:
  - Appointment reminders
  - Reschedule confirmations
  - Cancellation notices
  - Review chasers (short form)

---

## Email — SendGrid
- **Helper**: `sendEmail(to, subject, htmlBody)`
- **Backend**: SendGrid REST API
- **Use cases**:
  - Appointment confirmations
  - Reminder emails with richer detail
  - Review chasers (long form, branded)

---

## Automation Flow
**Scheduling & orchestration are handled by [Make](https://www.make.com/).**

1. **Triggers**
   - Appointment created/updated in Supabase → webhook to Make
   - Appointment completed → webhook to Make
2. **Actions (Make scenarios)**
   - T–24h: send reminder SMS + email
   - T–2h: send second reminder (optional)
   - Reschedule event: send confirmation SMS + email
   - Cancellation event: send cancellation SMS + email
   - T+2h post-appointment: send review chaser
3. **System of record**
   - Supabase `appointments` table stores source of truth
   - Supabase `call_logs` updated with event type (`reminder_sent`, `review_sent`, etc.)
4. **Helpers**
   - Make calls `services/messaging.js` endpoints (Twilio + SendGrid) to actually send
   - Ensures consistent logging + error capture inside Fastify

---

## Implementation Notes
- **Twilio** = SMS channel  
- **SendGrid** = Email channel  
- **Make** = Scheduling + orchestration  
- **Supabase** = Source of truth for appointments/logs  
- **AI** = Handles dynamic inbound (reschedules, cancellations), but outbound reminders/reviews are **templated** for compliance/consistency

# ============================================================================
# END File: messaging-guide.md
# ============================================================================

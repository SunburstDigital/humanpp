# Messaging Guide – Outbound SMS & Email

## Central Logic
All outbound messaging (SMS/Email) flows through `services/messaging.js`. Make.com handles timed/triggered automations.

## Channels
- **SMS**: Twilio (`sendSms(to, body)`)
- **Email**: SendGrid (`sendEmail(to, subject, htmlBody)`)

## Flows
- Appointment confirmations/reminders
- Cancellations/reschedules
- Review chasers (short/long form)
- All logs captured in Supabase

## Automation
- Supabase webhooks trigger Make.com scenarios (reminders, reviews, etc)
- Logs updated for all outbound events

## Implementation
- Only templates in `/templates` and verified content from approved flows should be used.
- Add new channels/services as needed and document here.

**Keep this file current with all new notification flows or logic changes.**

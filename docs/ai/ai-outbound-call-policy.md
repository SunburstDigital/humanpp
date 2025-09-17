AI Outbound Call Policy & DFY Campaign System – Finalized Architecture (Sunburst Digital AI)

🚀 Overview

This document outlines the finalized, locked-in policy for AI outbound call behavior within the Sunburst Digital AI platform, including fully managed (DFY) reactivation campaigns, dropped call recovery logic, Twilio number provisioning, and legal-safe controls.

🔒 Final Outbound Call Rules
✅ Allowed AI Outbound Calls:

🔄 Dropped Call Recovery

AI automatically calls back if a live call drops mid-session.

Timing: Retry within 1–2 minutes.

Compliant: User initiated contact.

🔁 Reactivation Campaigns (Manual Activation Only)

AI re-engages old leads or past clients who previously opted in.

Triggered manually by admin.

Requires full consent and DNC checks.

Uses dedicated Twilio number per campaign.

❌ Blocked AI Outbound Calls:
Scenario	Status
Cold lead lists	❌ Blocked
Missed calls (no intent)	❌ Blocked
No-shows or rebooking attempts	❌ Blocked (SMS only)
Internal follow-up	❌ Blocked (Handled by staff)
📆 Campaign Setup Flow (DFY Model)
✅ What the Client Gets:

Dedicated Twilio outbound number

Branded with their business name

Caller ID shows their company when dialed

🔐 What You Control:

Twilio number (provisioned inside your Twilio account)

Call prompts, logic, pacing, and scheduling

Legal compliance (DNC checking, opt-in enforcement)

All activation/deactivation logic

Logs, transcripts, and portal data visibility

🔢 Twilio Naming Convention:

Reactivation_<MonthYear>_<ClientName>

Managed internally by Sunburst Digital AI

Assigned to client visually, but never handed over

📊 Campaign Table (Supabase)
CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  twilio_number_outbound TEXT,
  status TEXT CHECK (status IN ('pending', 'active', 'paused', 'completed')),
  script TEXT,
  created_at TIMESTAMP DEFAULT now(),
  dnc_checked BOOLEAN DEFAULT false,
  notes TEXT
);
🚀 Reactivation Flow Logic

Admin enables campaign

Contacts pre-screened for DNC and opt-in

AI runs call_user tool with:

Approved script

Dedicated outbound number

Opt-out clause included

Transcripts, sentiment, and outcomes logged to Supabase

Portal shows live stats (bookings, fails, blocked, no answer)

🔢 Dropped Call Recovery Flow

If AI call disconnects unexpectedly:

Flag callback_required = true

Store session state + number

Trigger retry via call_user

Log success/failure in Supabase

📊 Compliance & Safety Checklist
Feature	Status
Dedicated Twilio per campaign	✅ Required
DNC check before call	✅ Required
Consent audit log	✅ Required
Opt-out in every call	✅ Required
AI script locked per campaign	✅ Required
Staff-only manual activation	✅ Required
Campaign auto-expiry (optional)	✅ Recommended
🤝 Summary

AI outbound calls are tightly locked to two valid scenarios only: dropped calls and client reactivations.

Reactivations are fully managed, legally safe, and branded for the client using your Twilio setup.

Clients do not get access to outbound controls.

You control the entire system. They carry the risk.

Let me know if you need this exported as a PDF, added to your onboarding d
# Client Onboarding & Go-Live Checklist

## Additional Details (from onboarding/client-onboarding.md)

### Intake Form Fields
- Staff names & mobile numbers (for transfers)

### Onboarding Steps
1. **Call Forwarding Setup**
	- Client sets `#21` forwarding to provided Twilio number
2. **Website Scraper Configuration**
	- Define container selectors for property extraction (Apify)
	- Validate correct suburb, config, and pet tagging
3. **Prompt Configuration**
	- Inject branding, suburb preferences, agent names
	- Attach memory buffers and fallback messages
4. **Calendar Setup**
	- Client shares calendar (read/write)
	- Block out unbookable times
	- AI can only book available slots
5. **Demo Mode (Optional)**
	- Run AI in demo-only mode with fake listings
	- Send prospecting pack: demo number, test script
6. **Live Trial Activation**
	- Real calls routed through AI
	- Bookings and inquiries logged
	- Summaries and recordings emailed daily
7. **Post-Trial Wrap-up**
	- Gather feedback
	- Offer live build or downgrade/remove

### Storage
- All setup stored in Supabase: `clients`, `staff`, `calendars`, `preferences`, `website_configs`

## 1. Intake Form
- Business Name, Phone, Website
- Target suburbs, staff contact details
- Preferred calendar tool (Google/Outlook)
- Emergency hours, booking limits

## 1a. Core Infrastructure & Project Build
- Hosting: **Fly.io**
- Backend: **Fastify**
- Databases: **Supabase** (structured), **Pinecone** (semantic)
- Telephony: **Twilio**
- Scraping: **Playwright/Cheerio** (replace Apify as needed)
- Automations: **Make.com**

## 2. Tech Setup
- Twilio call/SMS number assigned and forwarding confirmed
- Scraper (Playwright/Cheerio) configured per website
- Prompt templates and memory buffers set in Supabase

### Inbound Routing Setup
- Twilio SIP/Webhook routing (voice)
- Twilio Webhook routing (SMS)
- Live Chat/Orb routing into Fastify

### AI Core & Tools
- System prompt JSON loader per number
- Realtime OpenAI audio stream (voice-to-voice)
- Tools: listing-match, calendar-book, memory-summary

### Memory Architecture
- Pinecone: contact memory embed/store/search
- Pinecone: listing match embed/search
- Supabase: contact + listing + seen tracking schema

## 3. Calendar Integration
- OAuth connected, available times confirmed, blackout periods set

## 4. Demo Mode (Optional)
- Fake listings and demo number set up for prospect/test phase

### Testing & Demo Flow
- Twilio demo number wired
- Live listings scraping loaded (Sunburst fake listings)
- AI demo able to book, match, summarize reliably

## 5. Trial Activation
- AI live on inbound, booking flow tested, call logs & summaries checked

### Frontend Portal (Optional)
- Basic dashboard for viewing: call logs, recordings, summaries
- Login view per agency
- Appointment feed with sync/export

### Real Estate & Broker Vertical Prompts
- Final prompt templates for buy/lease/mortgage
- Summary injection + email to agents
- Default response logic + fallback templates

## 6. Post-Trial
- Gather feedback, upgrade or close, remove test/demo configs

> *All onboarding steps and config should be logged in Supabase and linked to the client’s master record. Use this as your single onboarding SOP from now on.*

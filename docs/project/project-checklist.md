## Project Build Checklist – LeadIndicator Replacement (Real Estate + Brokers)

### Phase 1 – Core Infrastructure
- [x] Confirm hosting → **Fly.io**
- [x] Confirm backend → **Fastify**
- [x] Confirm DB → **Supabase** (structured) + **Pinecone** (semantic)
- [x] Confirm telephony → **Twilio**
- [x] Confirm scraping → **Apify**
- [x] Confirm automations → **Make**

### Phase 2 – Inbound Routing Setup
- [ ] Twilio SIP/Webhook routing (voice)
- [ ] Twilio Webhook routing (SMS)
- [ ] Live Chat + Orb routing into Fastify

### Phase 3 – AI Core & Tools
- [ ] System prompt JSON loader per number
- [ ] Realtime OpenAI audio stream (voice-to-voice)
- [ ] Tools: listing-match, calendar-book, memory-summary

### Phase 4 – Memory Architecture
- [ ] Pinecone: contact memory embed/store/search
- [ ] Pinecone: listing match embed/search
- [ ] Supabase: contact + listing + seen tracking schema

### Phase 5 – Frontend Portal (Optional if time)
- [ ] Basic dashboard for viewing: call logs, recordings, summaries
- [ ] Login view per agency
- [ ] Appointment feed with sync/export

### Phase 6 – Real Estate & Broker Vertical Prompts
- [ ] Final prompt templates for buy/lease/mortgage
- [ ] Summary injection + email to agents
- [ ] Default response logic + fallback templates

### Phase 7 – Testing & Demo Flow
- [ ] Twilio demo number wired
- [ ] Live listings scraping loaded (Sunburst fake listings)
- [ ] AI demo able to book, match, summarize reliably

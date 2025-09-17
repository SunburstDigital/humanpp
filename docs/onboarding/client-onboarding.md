## Client Onboarding – Sunburst AI System Trial (Real Estate / Brokers)

### Intake Form Fields
- Business Name
- Business Phone Number
- Website URL
- Target suburbs (buy/lease)
- Staff names & mobile numbers (for transfers)
- Preferred calendar tool (Google, Outlook)
- Emergency hours (Y/N + times)
- Appointment booking limits

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

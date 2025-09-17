# calendar-sync-guide.md

## Overview

This guide explains how to connect Google and Outlook calendars to your AI system so that appointments booked by the AI reflect accurately in the client's external calendar.

---

## Integration Method

Use OAuth + API integration to:

* View availability
* Create, update, or cancel events
* Send confirmations/reminders

---

## Setup

### 1. Google Calendar

* Enable Google Calendar API in Google Cloud Console
* Set up OAuth 2.0 credentials
* Redirect URI → `https://your-app.com/auth/google/callback`
* Scopes:

  * `https://www.googleapis.com/auth/calendar.readonly`
  * `https://www.googleapis.com/auth/calendar.events`

### 2. Outlook (Microsoft 365)

* Register app at Azure Portal
* Set up OAuth credentials
* Redirect URI → `https://your-app.com/auth/outlook/callback`
* Scopes:

  * `Calendars.Read`
  * `Calendars.ReadWrite`

---

## Tokens and Storage

* Store OAuth tokens securely in Supabase or Firestore (linked to client ID)
* Refresh tokens on expiry

---

## Booking Flow

1. AI finds open slot (from calendar API)
2. Confirms availability with user
3. Books appointment via API
4. Sends event confirmation to user and business

---

## Conflict Detection

* Always fetch `busy` blocks from calendars
* Respect blocked/unavailable hours
* Consider using event color codes for AI-scheduled events

---

## Calendar Connection UI (optional)

* In client onboarding: add a “Connect Calendar” step
* Use Google and Microsoft buttons with OAuth redirect

---

## Fallbacks

* If no calendar is connected:

  * Use internal calendar store (Supabase)
  * Remind client to update manually

---

## Security Considerations

* Encrypt tokens at rest
* Limit scope to minimum required
* Provide disconnect option

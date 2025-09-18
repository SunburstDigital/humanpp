# Provider Isolation Structure

This folder contains all provider-specific logic for telephony integrations (Twilio, Telnyx, etc). The goal is to keep all business logic, webhook handlers, and helpers for each provider isolated in their own subfolder, making it easy to swap or extend providers.

## Structure

```
/backend/providers/
  /twilio/
    twilio-voice.js    # Call and voice webhook logic
    twilio-sms.js      # SMS webhook logic
    twilio-media.js    # Media/WebSocket streaming logic
    twilio-utils.js    # Signature verification, API helpers
  /telnyx/
    telnyx-voice.js
    telnyx-sms.js
    telnyx-media.js
    telnyx-utils.js
  index.js            # Provider switcher (exports correct provider based on env)
  README.md           # This file
```

## Purpose

- **Separation:** No provider logic should remain in `/routes/`, `/services/`, or `/utils/`.
- **Thin routes:** Route files only import and delegate to provider handlers.
- **Extensibility:** Add new providers (e.g., Telnyx) by mirroring the structure.
- **Maintainability:** All business logic for each provider is in one place.

## Usage

- Import handlers from the correct provider file in your route files.
- Use `index.js` to switch providers based on `process.env.PHONE_PROVIDER`.

# Rule: Number Separation

## Context
To keep dev/test and production traffic isolated, Sunburst AI uses different phone numbers and endpoints for each environment.

## Implementation Rule
- Dev/Test numbers route to the staging app (`sunburst-voice.fly.dev`).
- Production numbers (agency and clients) route to the production app (`voice.sunburstdigital.ai`).
- All production numbers hit the same endpoint; logic checks the `to` number to determine handling.

## Rationale
This ensures test traffic never impacts production, and all production logic is centralized and consistent.
# Rule: International SMS

## Context
Sunburst AI must handle SMS traffic globally, but only auto-send outbound SMS to Australian numbers for compliance and cost control. All inbound SMS should be accepted regardless of origin.

## Implementation Rule
- Accept inbound SMS from all countries.
- Only auto-send outbound SMS if the `to` number starts with `+61` (Australia).
- If outbound `to` is not `+61...`:
  - Log the attempt with `international_prospect=true`.
  - Notify staff for manual review.
  - Do not send the SMS automatically.

## Pseudocode (Fastify filter)
```js
if (sms.direction === 'outbound') {
  if (!sms.to.startsWith('+61')) {
    log({ international_prospect: true, ...sms });
    notifyStaff(sms);
    return { ok: false, reason: 'International SMS not auto-sent' };
  }
}
// ...proceed with send
```

## Rationale
This ensures compliance with business rules, prevents accidental international SMS charges, and flags global leads for staff follow-up.
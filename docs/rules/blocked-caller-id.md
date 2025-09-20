# Rule: Blocked Caller ID

## Context
Some callers may have anonymous or restricted caller IDs. We still want to capture leads and maintain conversation memory, even without a phone number.

## Implementation Rule
- If `from` is anonymous or restricted:
  - Prompt the caller for their email address.
  - Create a contact with `phone=null` and `email=provided`.
  - Use the email as the unique key in Pinecone/Supabase.
  - On future calls from blocked IDs, ask for email again and load memory if matched.

## Pseudocode
```js
if (call.from === 'anonymous' || call.from === 'restricted') {
  const email = promptForEmail();
  createContact({ phone: null, email });
  // Use email as DB key
  // On future calls, repeat prompt and match
}
```

## Rationale
This allows us to track and serve anonymous callers, link their history by email, and maintain continuity even without a phone number.
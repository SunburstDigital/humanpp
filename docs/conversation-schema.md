# Conversation Schema

## Tables
- `contacts`: Stores phone, name, optional email, IDs for Messenger/WhatsApp/Orb.
- `conversations`: Links to contact_id, tracks session state.
- `conversation_chunks`: All inbound/outbound messages, prompts, voice notes.
- `conversation_steps`: Sub-tasks/goals (pending, complete, cancelled).

## Guest Handling
- If no phone: mark `is_guest=true`.
- Guest sessions expire → auto-delete.

See `/docs/conversation-lifecycle.md` for rules.

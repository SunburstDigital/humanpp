=========================================================================================================
## Current Copilot Task START
=========================================================================================================
# Task
Build a complete Fastify service layer + routes for managing AI conversation sessions using Postgres (Supabase).  
Use the following schema (already created):  
- `conversations` (session record, includes `summary`, `goal`, `is_guest`, `status`)  
- `conversation_chunks` (all prompt/context entries: system, user, ai, memory, voice)  
- `conversation_steps` (mini-goals/tasks inside conversation)

# Requirements

## 1. Webhook Inbound
- Route: `POST /webhooks/:channel/inbound`
  - :channel = messenger | whatsapp | sms | orb | voice
  - Parse `client_id`, `user_id`, `message text`.
  - If phone number not yet captured → set `is_guest = true`.
  - Lookup active conversation (user_id + channel).
    - If found → append new chunk `{ role: 'user', content: message }`.
    - If not found → create new conversation:
      - status='active'
      - goal="Handle inbound enquiry"
      - add system + memory chunks
  - Always update `last_message_at`.

## 2. Outbound Send
- Route: `POST /conversations/:id/send`
  - Input: `{ role, content }`
  - Append chunk `{ role: 'ai', content }`.
  - Call outbound channel API (Messenger/Plivo/Orb/etc) based on conversation.channel.
  - Log outbound in `conversation_messages` (optional).

## 3. Conversation Fetch
- Route: `GET /conversations/:id`
  - Return conversation details, summary, goal, steps, last 10 chunks.

## 4. Steps Management
- Route: `POST /conversations/:id/steps`
  - Create new step (description, default status='pending').
- Route: `PATCH /conversations/:id/steps/:step_id`
  - Update status to 'complete' or 'cancelled'.

## 5. Lifecycle Jobs
- Cron/scheduler job every 5 minutes:
  - If active and `last_message_at` > 10m → mark status='stale'.
  - If active and `last_message_at` > 24h → mark status='expired'.
  - If is_guest=true AND status='expired' → DELETE conversation (cascade clears chunks/steps).

## 6. Memory & Prompt Context
- When generating AI response:
  - Fetch `goal` + `summary` from conversations.
  - Fetch last N chunks (default 5–10).
  - Include any pending steps in context.
  - Do not call Pinecone/global memory for active sessions.
- When conversation closes:
  - Create final summary + archive transcript into Pinecone/global memory.
  - Mark status='closed'.

## 7. Utilities
- Helper: `getActiveConversation(user_id, channel)`
- Helper: `createConversation(client_id, user_id, channel, goal, summary?)`
- Helper: `appendChunk(conversation_id, role, content)`
- Helper: `addStep(conversation_id, description)`
- Helper: `updateStep(step_id, status)`
- Helper: `deleteGuestExpired()` for cron purge.

## 8. Code Style
- Fastify routes + service layer functions separated cleanly.
- Use async/await with pg or Supabase client.
- Return consistent JSON: `{ success: true, data: ... }` or `{ success: false, error: ... }`.
- Gracefully handle errors.

---

# Tests
- Use Jest or Tap for Fastify.  
- Create tests for:  
  1. Creating a new conversation (inbound webhook).  
  2. Appending a chunk to existing conversation.  
  3. Sending outbound message.  
  4. Creating and updating steps.  
  5. Stale/expired detection.  
  6. Guest conversation auto-deletion after expiry.  
  7. Fetching conversation with last N chunks + steps.  
- Use mock Postgres or Supabase client for isolation.  
- Ensure each route returns expected JSON structure.  









=========================================================================================================
## Current Copilot Task END
=========================================================================================================

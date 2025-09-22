# Backend Architecture

## Overview
- Fastify backend with modular routes, services, and utilities
- Integrates with Supabase/Postgres (persistence), Pinecone (memory/context), and OpenAI (AI responses)

## Key Components
- `backend/routes/`: Fastify route handlers (API endpoints)
- `backend/services/`: Business logic, DB helpers, and integrations
- `backend/utils/`: Logging, session helpers, and shared utilities

## Conversation Management
- Conversations, steps, and chunks are managed via service helpers
- Endpoints for inbound/outbound messaging, fetching, and step management

## Integrations
- Supabase/Postgres: Conversation and chunk storage
- Pinecone: Memory/context retrieval and archiving
- OpenAI: AI response generation

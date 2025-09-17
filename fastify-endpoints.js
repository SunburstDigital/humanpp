// ============================================================================
// START File fastify-endpoints.js
// ============================================================================
// Purpose: Fastify route definitions for voice/SMS/orb endpoints and external
// webhooks. Stubs out /media-stream, /incoming-sms, /incoming-voice, /summary,
// /calendar-book, and /inject-contact handlers.
// ============================================================================

import Fastify from "fastify";

export async function buildServer() {
  const app = Fastify({ logger: true });

  app.get("/health", async () => ({ ok: true }));

  app.post("/incoming-sms", async (req, reply) => {
    return { message: "SMS received", body: req.body };
  });

  app.post("/incoming-voice", async (req, reply) => {
    return { message: "Voice webhook hit", body: req.body };
  });

  app.get("/media-stream", async () => {
    return { message: "Media stream WS goes here" };
  });

  app.post("/summary", async (req, reply) => {
    return { message: "Call summary stored", body: req.body };
  });

  app.post("/calendar-book", async (req, reply) => {
    return { message: "Calendar booking stub", body: req.body };
  });

  app.post("/inject-contact", async (req, reply) => {
    return { message: "Contact injected stub", body: req.body };
  });

  return app;
}

// ============================================================================
// END File fastify-endpoints.js
// ============================================================================

// ============================================================================
// START File services/transcripts.mjs
// ============================================================================
// Purpose: Transcript management for AI Voice System.
// Handles saving transcripts + audio URLs into Supabase.
// Dependencies: services/supabase.js, utils/logging.js
// ============================================================================
import { saveCallTranscript } from "./supabase.js";
import { logNS } from "../utils/logging.js";

// ============================================================================
// START Route Handler
// ============================================================================
export default async function transcriptRoutes(fastify) {
  fastify.post("/transcripts/save", async (req, reply) => {
    const {
      call_id,
      phone,
      client_number,
      transcript_text,
      audio_url = null,
      raw_json = null,
    } = req.body || {};

    if (!call_id || !transcript_text) {
      return reply.code(400).send({ ok: false, error: "Missing call_id or transcript_text" });
    }

    const result = await saveCallTranscript({
      callId: call_id,
      phone,
      clientNumber: client_number,
      transcriptText: transcript_text,
      audioUrl: audio_url,
      raw: raw_json,
    });

    if (!result) {
      logNS("transcripts", `❌ Failed to save transcript for ${call_id}`);
      return reply.code(500).send({ ok: false, error: "Transcript save failed" });
    }

    logNS("transcripts", `✅ Transcript saved for ${call_id}`);
    return reply.send({ ok: true });
  });
}
// ============================================================================
// END Route Handler
// ============================================================================

// ============================================================================
// END File services/transcripts.mjs
// ============================================================================

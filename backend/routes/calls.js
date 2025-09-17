// ============================================================================
// START File: routes/calls.js
// ============================================================================
// Purpose: Handle Twilio call lifecycle, log into Supabase, and upload
//          transcript/audio files into the "transcripts" bucket.
//          Metadata is saved in transcripts_meta, while call_logs holds
//          summaries + lifecycle events.
// ============================================================================

import { upsertContact, saveLog, sb, saveCallSummary } from "../services/supabase.js";
import { logger, logNS } from "../utils/logging.js";

// ---------------------------------------------------------------------------
// Helper: upload a file into Supabase Storage (transcripts bucket)
// ---------------------------------------------------------------------------
async function uploadTranscriptFile(filename, buffer, contentType = "application/octet-stream") {
  const { data, error } = await sb.storage
    .from("transcripts")
    .upload(filename, buffer, { contentType, upsert: true });

  if (error) {
    logger.error({ filename, error: error.message }, "❌ Upload failed");
    return null;
  }

  logger.info({ filename, data }, "✅ Upload success");
  return data?.path || filename;
}

// ---------------------------------------------------------------------------
// Fastify route registration
// ---------------------------------------------------------------------------
export default async function callRoutes(app) {
  // -------------------------------------------------------------------------
  // Call status callback (Twilio posts multiple times per call lifecycle)
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // Save call summary
  // -------------------------------------------------------------------------
  app.post("/calls/summary", async (req, reply) => {
    const { phone, summary, client_number, intent, audio_url, transcript_url } = req.body || {};
    logNS("calls", `POST /calls/summary - phone: ${phone}, client_number: ${client_number}, intent: ${intent}, audio_url: ${audio_url}, transcript_url: ${transcript_url}`);
    if (!phone || !summary) {
      logNS("calls", "Missing phone or summary in request body");
      return reply.code(400).send({ ok: false, error: "Missing phone or summary" });
    }
    try {
      const result = await saveCallSummary({ phone, summary, clientNumber: client_number, intent, audio_url, transcript_url });
      if (result) {
        logNS("calls", `Saved call summary for phone ${phone}`);
        return reply.code(200).send({ ok: true });
      } else {
        logNS("calls", `Failed to save call summary for phone ${phone}`);
        return reply.code(500).send({ ok: false, error: "Failed to save call summary" });
      }
    } catch (err) {
      logNS("calls", `Error saving call summary: ${err.message}`);
      return reply.code(500).send({ ok: false, error: err.message });
    }
  });
  app.post("/twilio/call-status", async (req, reply) => {
    const callSid = req.body?.CallSid || "no-sid";
    const status = req.body?.CallStatus || "unknown";
    const from = req.body?.From || "unknown";

    logger.info({ callSid, status, from }, "📞 Call status update");

    try {
      // Ensure contact exists
      const contact = await upsertContact({ phone: from });

      // Always log status transitions
      await saveLog({
        contact_id: contact?.id,
        phone: from,
        summary: `Call status: ${status}`,
        type: "call_status",
      });

      // ---------------------------------------------------------------------
      // On call end (completed) → upload transcript/audio + save metadata
      // ---------------------------------------------------------------------
      if (status === "completed") {
        await saveLog({
          contact_id: contact?.id,
          phone: from,
          summary: "Call ended",
          type: "call_end",
        });

        // Generate filenames
        const jsonFile = `call_${callSid}.json`;
        const audioFile = `call_${callSid}.mp3`;

        // Upload transcript JSON stub
        const jsonPath = await uploadTranscriptFile(
          jsonFile,
          Buffer.from(
            JSON.stringify({
              call_id: callSid,
              phone: from,
              ended_at: new Date().toISOString(),
              notes: "Example transcript text here", // TODO: replace with real transcript
            })
          ),
          "application/json"
        );

        // Upload audio stub (dummy placeholder for now)
        const audioPath = await uploadTranscriptFile(
          audioFile,
          Buffer.from("dummy mp3 data"),
          "audio/mpeg"
        );

        // Save metadata if uploads succeeded
        if (jsonPath || audioPath) {
          const { error: metaErr } = await sb.from("transcripts_meta").insert({
            call_id: callSid,
            contact_id: contact?.id,
            phone: from,
            json_path: jsonPath,
            audio_path: audioPath,
            created_at: new Date().toISOString(),
          });

          if (metaErr) {
            logger.error({ metaErr }, "❌ Failed to insert transcript metadata");
          } else {
            await saveLog({
              contact_id: contact?.id,
              phone: from,
              summary: `Transcript stored for call ${callSid}`,
              type: "transcript_meta",
            });
          }
        }
      }
    } catch (err) {
      logger.error({ err }, "❌ Failed to log call status or store transcripts");
    }

    reply.code(200).send({ ok: true });
  });

  // -------------------------------------------------------------------------
  // Optional: explicit call start logging
  // -------------------------------------------------------------------------
  app.post("/twilio/call-start", async (req, reply) => {
    const callSid = req.body?.CallSid || "no-sid";
    const from = req.body?.From || "unknown";

    logger.info({ callSid, from }, "📞 Call started");

    try {
      const contact = await upsertContact({ phone: from });
      await saveLog({
        contact_id: contact?.id,
        phone: from,
        summary: "Call started",
        type: "call_start",
      });
    } catch (err) {
      logger.error({ err }, "❌ Failed to log call start");
    }

    reply.code(200).send({ ok: true });
  });
}

// ============================================================================
// END File: routes/calls.js
// ============================================================================

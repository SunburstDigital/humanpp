// ============================================================================
// START File: routes/calls.js
// ============================================================================
// Purpose: Handle Twilio call lifecycle, log into Supabase, and upload
//          transcript/audio files into the "transcripts" bucket.
//          Metadata is saved in transcripts_meta, while call_logs holds
//          summaries + lifecycle events.
// ============================================================================

import { twilioHandleCallStatus, twilioHandleCallStart } from "../providers/twilio/twilio-voice.js";

// ---------------------------------------------------------------------------
// Fastify route registration
// ---------------------------------------------------------------------------
export default async function callRoutes(app) {
  // -------------------------------------------------------------------------
  // Call status callback (Twilio posts multiple times per call lifecycle)
  // -------------------------------------------------------------------------
  app.post("/twilio/call-status", twilioHandleCallStatus);

  // -------------------------------------------------------------------------
  // Optional: explicit call start logging
  // -------------------------------------------------------------------------
  app.post("/twilio/call-start", twilioHandleCallStart);
}

// ============================================================================
// END File: routes/calls.js
// ============================================================================

// ============================================================================
// START File: routes/calls.js
// ============================================================================
// Purpose: Handle Twilio call lifecycle, log into Supabase, and upload
//          transcript/audio files into the "transcripts" bucket.
//          Metadata is saved in transcripts_meta, while call_logs holds
//          summaries + lifecycle events.
// ============================================================================


const { twilioHandleCallStatus, twilioHandleCallStart } = require("../providers/twilio/twilio-voice.js");

async function callRoutes(app) {
  app.post("/twilio/call-status", twilioHandleCallStatus);
  app.post("/twilio/call-start", twilioHandleCallStart);
}

module.exports = callRoutes;

// ============================================================================
// END File: routes/calls.js
// ============================================================================

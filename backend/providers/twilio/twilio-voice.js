import { saveCallSummary } from "../../services/supabase.js";

// Twilio call and voice webhook logic
export async function twilioHandleCallStatus(req, reply) {
  // Simulate call status update
  reply.code(200).send({ ok: true, message: 'Call status updated (mock)' });
}

export async function twilioHandleCallStart(req, reply) {
  // Simulate call start
  reply.code(200).send({ ok: true, message: 'Call start logged (mock)' });
}

export async function twilioHandleCallSummary(req, reply) {
  const { phone, summary, client_number, intent, audio_path, transcript_path } = req.body || {};
  if (!phone || !summary) {
    return reply.code(400).send({ ok: false, error: "Missing phone or summary" });
  }
  try {
    const result = await saveCallSummary({
      phone,
      summary,
      clientNumber: client_number,
      intent,
      audio_path,
      transcript_path
    });
    if (result) {
      return reply.code(200).send({ ok: true, data: result });
    } else {
      return reply.code(500).send({ ok: false, error: "Failed to save call summary" });
    }
  } catch (err) {
    return reply.code(500).send({ ok: false, error: err.message });
  }
}

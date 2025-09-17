// ======================================================================================
// File: routes/sms.js
// Purpose: Handle inbound SMS + status callbacks from Twilio, log into Supabase
// ======================================================================================
import { upsertContact, saveLog } from "../services/supabase.js";
import { escapeXml } from "../utils/session-notes.js";
import { logger } from "../utils/logging.js";

export default async function smsRoutes(app) {
  // ---------------------------------------------------------------------------
  // Inbound SMS from Twilio
  // ---------------------------------------------------------------------------
  app.post("/twilio/incoming-sms", async (req, reply) => {
    const from = req.body?.From || "unknown";
    const body = req.body?.Body || "";

    logger.info({ from, body }, "✉️ Inbound SMS");

    try {
      // Ensure contact exists
      const contact = await upsertContact({ phone: from });

      // Save log entry
      await saveLog({
        contact_id: contact?.id,
        phone: from,
        summary: `Inbound SMS: ${body.slice(0, 80)}`,
        type: "sms_inbound",
      });
    } catch (err) {
      logger.error({ err }, "❌ Failed to log inbound SMS");
    }

    // Respond with TwiML
    const twiml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<Response><Message>Hi ${escapeXml(from)}, we got your message: ` +
      `${escapeXml(String(body).slice(0, 160))}</Message></Response>`;

    reply.header("Content-Type", "text/xml").send(twiml);
  });

  // ---------------------------------------------------------------------------
  // SMS Delivery Status updates from Twilio
  // ---------------------------------------------------------------------------
  app.post("/twilio/sms-status", async (req, reply) => {
    const status = req.body?.MessageStatus || "unknown";
    const sid = req.body?.MessageSid || "no-sid";

    logger.info({ sid, status }, "✉️ SMS status update");

    try {
      await saveLog({
        id: `sms_status_${sid}`,
        summary: `SMS status: ${status}`,
        type: "sms_status",
      });
    } catch (err) {
      logger.error({ err }, "❌ Failed to log SMS status");
    }

    reply.code(200).send({ ok: true });
  });
}

// ======================================================================================
// File: routes/logs.js
// Purpose: Fetch recent logs, logs per contact, and test Supabase connectivity
// ======================================================================================
const { getRecentLogs, getLogsByContact } = require("../services/supabase.js");
const { logger } = require("../utils/logging.js");

async function logRoutes(app) {
  // Recent logs
  app.get("/logs/recent", async (req, reply) => {
    try {
      const logs = await getRecentLogs(10);
      reply.code(200).send({ ok: true, logs });
    } catch (err) {
      logger.error({ err }, "❌ Failed to fetch recent logs");
      reply.code(500).send({ ok: false, error: err.message });
    }
  });

  // Logs by contact phone
  app.get("/logs/contact/:phone", async (req, reply) => {
    const phone = req.params.phone;
    try {
      const logs = await getLogsByContact(phone);
      reply.code(200).send({ ok: true, logs });
    } catch (err) {
      logger.error({ err }, "❌ Failed to fetch logs for contact");
      reply.code(500).send({ ok: false, error: err.message });
    }
  });

  // Supabase connectivity check
  app.get("/logs/supabase-check", async (req, reply) => {
    try {
      const logs = await getRecentLogs(1);
      reply.code(200).send({ ok: true, message: "Supabase connected", sample: logs[0] || null });
    } catch (err) {
      logger.error({ err }, "❌ Supabase connectivity failed");
      reply.code(500).send({ ok: false, error: err.message });
    }
  });
}

module.exports = logRoutes;

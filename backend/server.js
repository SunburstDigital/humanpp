// server.js — Starts the Fastify server (separated for testability)

const { app, setupApp } = require('./app.js');
const { logger } = require('./utils/logging.js');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

(async () => {
  try {
    await setupApp();
    await app.listen({ port: PORT, host: HOST });
    logger.info(`🚀 Fastify running on http://${HOST}:${PORT}`);
  } catch (err) {
    logger.error(err, "❌ Failed to start Fastify");
    process.exit(1);
  }
})();

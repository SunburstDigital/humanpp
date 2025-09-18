// server.js — Starts the Fastify server (separated for testability)
import app, { setupApp } from './app.js';
import { logger } from './utils/logging.js';

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

try {
  await setupApp();
  await app.listen({ port: PORT, host: HOST });
  logger.info(`🚀 Fastify running on http://${HOST}:${PORT}`);
} catch (err) {
  logger.error(err, "❌ Failed to start Fastify");
  process.exit(1);
}

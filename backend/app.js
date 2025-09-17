// ======================================================================================
// app.js — Sunburst Voice System (Fastify bootstrap)
// ======================================================================================
// Purpose: Entry point. Registers plugins, mounts route modules, and starts the server.
// ======================================================================================

import * as dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import { logger } from "./utils/logging.js";
import formbody from "@fastify/formbody";
import websocket from "@fastify/websocket";
import multipart from "@fastify/multipart";



// Route modules
import healthRoutes from "./routes/health.js";
import smsRoutes from "./routes/sms.js";
import callRoutes from "./routes/calls.js";
import logRoutes from "./routes/logs.js";
import mediaStreamRoutes from "./routes/media-stream.js";

// ======================================================================================
// START App Bootstrap
// ======================================================================================
const app = Fastify({ logger: { instance: logger } });

// Register core plugins
await app.register(formbody);
await app.register(websocket);
await app.register(multipart);

// Register route modules
await app.register(healthRoutes);
await app.register(smsRoutes);
await app.register(callRoutes);
await app.register(logRoutes);
await app.register(mediaStreamRoutes);

console.log("Logger is Pino instance?", typeof logger.info === "function"); // should print true

// ======================================================================================
// START Server
// ======================================================================================
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

try {
  await app.listen({ port: PORT, host: HOST });
  logger.info(`🚀 Fastify running on http://${HOST}:${PORT}`);
} catch (err) {
  logger.error(err, "❌ Failed to start Fastify");
  process.exit(1);
}
// ======================================================================================
// END Server
// ======================================================================================

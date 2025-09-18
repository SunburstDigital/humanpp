// ======================================================================================
// app.js — Sunburst Voice System (Fastify bootstrap)
// ======================================================================================
// Purpose: Entry point. Registers plugins, mounts route modules, and starts the server.
// ======================================================================================

import path from "path";
import dotenv from "dotenv";

const envPath = path.resolve("infra", ".env");
dotenv.config({ path: envPath });

console.log("[DEBUG] Loaded .env from:", envPath);
console.log("[DEBUG] SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("[DEBUG] CWD:", process.cwd());

import Fastify from "fastify";
import { logger } from "./utils/logging.js";
import formbody from "@fastify/formbody";
import websocket from "@fastify/websocket";
import multipart from "@fastify/multipart";

// Route modules from routes/
import healthRoutes from "./routes/health.js";
import smsRoutes from "./routes/sms.js";
import callRoutes from "./routes/calls.js";
import logRoutes from "./routes/logs.js";
import mediaStreamRoutes from "./routes/media-stream.js";
import mediaUrlRoutes from "./routes/media-url.js";
import summaryRoutes from "./routes/summary.js";

// Service modules from services/
import transcripts from "./services/transcripts.mjs";

// ======================================================================================
// START App Bootstrap
// ======================================================================================
const app = Fastify({ logger: { instance: logger } });

// Register core plugins and routes
export async function setupApp() {
  await app.register(formbody);
  await app.register(websocket);
  await app.register(multipart);

  // Register route modules
  await app.register(healthRoutes);
  await app.register(transcripts); // services/transcripts.mjs
  await app.register(smsRoutes);
  await app.register(callRoutes);
  await app.register(logRoutes);
  await app.register(mediaStreamRoutes);
  await app.register(mediaUrlRoutes);
  await app.register(summaryRoutes);

  console.log("Logger is Pino instance?", typeof logger.info === "function"); // should print true
  return app;
}

export default app;

// ======================================================================================
// app.js — Sunburst Voice System (Fastify bootstrap)
// ======================================================================================
// Purpose: Entry point. Registers plugins, mounts route modules, and starts the server.
// ======================================================================================

const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve("infra", ".env");
dotenv.config({ path: envPath });

console.log("[DEBUG] Loaded .env from:", envPath);
console.log("[DEBUG] SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("[DEBUG] CWD:", process.cwd());

const Fastify = require("fastify");
const { logger } = require("./utils/logging.js");
const formbody = require("@fastify/formbody");
const websocket = require("@fastify/websocket");
const multipart = require("@fastify/multipart");

// Route modules from routes/
const healthRoutes = require("./routes/health.js");
const smsRoutes = require("./routes/sms.js");
const callRoutes = require("./routes/calls.js");
const logRoutes = require("./routes/logs.js");
const mediaStreamRoutes = require("./routes/media-stream.js");
const mediaUrlRoutes = require("./routes/media-url.js");
const summaryRoutes = require("./routes/summary.js");
const webhooksRoutes = require("./routes/webhooks.js");

// Service modules from services/
const transcripts = require("./services/transcripts.js");

// ======================================================================================
// START App Bootstrap
// ======================================================================================
const app = Fastify({ logger: { instance: logger } });

// Register core plugins and routes
async function setupApp() {
  await app.register(formbody);
  await app.register(websocket);
  await app.register(multipart);

  // Register route modules
  await app.register(healthRoutes);
  await app.register(transcripts); // services/transcripts.js
  await app.register(smsRoutes);
  await app.register(callRoutes);
  await app.register(logRoutes);
  await app.register(mediaStreamRoutes);
  await app.register(mediaUrlRoutes);
  await app.register(summaryRoutes);
  await app.register(webhooksRoutes);

  console.log("Logger is Pino instance?", typeof logger.info === "function"); // should print true
  return app;
}

module.exports = { app, setupApp };

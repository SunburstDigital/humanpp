// ======================================================================================
// File: utils/logging.js
// Purpose: Centralised logging using Pino. Works with Fastify, falls back gracefully
// ======================================================================================

const pino = require("pino");

function buildLogger() {
  // In production: plain JSON logs
  if (process.env.NODE_ENV === "production") {
    return pino({ level: "info" });
  }

  // In development: try to pretty-print
  try {
    return pino({
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    });
  } catch (err) {
    // Fallback: plain JSON logs if pino-pretty not installed
    console.warn("⚠️  pino-pretty not installed. Falling back to JSON logs.");
    return pino({ level: "debug" });
  }
}

const logger = buildLogger();

/**
 * Namespace logger for consistent log output.
 * @param {string} ns - Namespace (e.g. 'supabase')
 * @param {...any} args - Log message and data
 */
function logNS(ns, ...args) {
  if (logger && typeof logger.info === "function") {
    logger.info({ ns }, ...args);
  } else {
    console.log(`[${ns}]`, ...args);
  }
}

module.exports = { logger, logNS };

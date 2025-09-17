// ============================================================================
// START File services/logger.js
// ============================================================================
// Purpose: Global debug logger for Sunburst AI Voice System.
// Toggle with DEBUG_PIPELINE=true in .env
// ============================================================================

const DEBUG = String(process.env.DEBUG_PIPELINE || "").toLowerCase() === "true";

export function logNS(namespace, ...args) {
  if (DEBUG) {
    const ts = new Date().toISOString();
    console.log(`[${ts}] [${namespace}]`, ...args);
  }
}

export function isDebug() {
  return DEBUG;
}

// ============================================================================
// END File services/logger.js
// ============================================================================

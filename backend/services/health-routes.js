// ============================================================================
// START File services/health-routes.js
// ============================================================================
async function healthRoutes(fastify) {
  fastify.get("/health/deps", async () => {
    // require so module side-effects aren’t duplicated
    const pine = require("./pinecone.js");

    const pineHealth = await pine.health();
    const supaOk = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

    return {
      ok: pineHealth.ok && supaOk,
      pinecone: pineHealth,
      supabase: { ok: supaOk, url: process.env.SUPABASE_URL || null },
      openai: { ok: !!process.env.OPENAI_API_KEY },
      embed_model: process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small",
      index: process.env.PINECONE_INDEX || "sunburst-memory-index",
      ts: new Date().toISOString(),
    };
  });
}

module.exports = healthRoutes;
// ============================================================================
// END File services/health-routes.js
// ============================================================================

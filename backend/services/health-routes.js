// ============================================================================
// START File services/health-routes.js
// ============================================================================
export default async function healthRoutes(fastify) {
  fastify.get("/health/deps", async () => {
    // dynamic import so module side-effects aren’t duplicated
    const pine = await import("./pinecone.js");
    const supa = await import("../supabase-functions.js").catch(() => null);

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
// ============================================================================
// END File services/health-routes.js
// ============================================================================

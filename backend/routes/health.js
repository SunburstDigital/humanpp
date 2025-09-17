// ======================================================================================
// Health Routes
// Purpose: Root + health check endpoints
// ======================================================================================
export default async function healthRoutes(app) {
  app.get("/", async () => ({ ok: true, message: "Sunburst Voice is live" }));

  app.get("/health", async () => ({
    ok: true,
    env: {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      PUBLIC_HOSTNAME: process.env.PUBLIC_HOSTNAME || null,
    },
  }));
}

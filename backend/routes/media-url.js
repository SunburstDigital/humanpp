// ======================================================================================
// File: routes/media-url.js
// Purpose: Expose a GET /media-url endpoint for generating signed Supabase Storage URLs
// ======================================================================================
const { getTranscriptSignedUrl } = require("../utils/url-generator.js");
const { logger } = require("../utils/logging.js");

async function mediaUrlRoutes(app) {
  app.get("/media-url", async (req, reply) => {
    const path = req.query?.path;
    const expires = parseInt(req.query?.expires, 10) || 3600;
    if (!path) {
      return reply.code(400).send({ ok: false, error: "Missing path parameter" });
    }
    const url = await getTranscriptSignedUrl(path, expires);
    if (url) {
      return reply.code(200).send({ ok: true, url });
    } else {
      logger.error({ path, expires }, "Failed to generate signed media URL");
      return reply.code(500).send({ ok: false, error: "Failed to generate signed URL" });
    }
  });
}

module.exports = mediaUrlRoutes;

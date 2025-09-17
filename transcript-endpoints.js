// ============================================================================
// START File transcript-endpoints.js
// ============================================================================
// Purpose: Fastify plugin exposing transcript upload, signed URL retrieval,
// and per-contact transcript listing. Uses Supabase storage + transcripts_meta.
// ============================================================================

import fp from "fastify-plugin";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default fp(async function (fastify, opts) {
  fastify.post("/transcripts", async (request, reply) => {
    const { type, contactId } = request.query;
    const data = await request.file();

    if (!["audio", "json"].includes(type)) {
      return reply.code(400).send({ error: "Invalid type: must be audio or json" });
    }

    const ext = type === "audio" ? ".mp3" : ".json";
    const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    const fileBuffer = await data.toBuffer();

    const { error: uploadError } = await supabase.storage
      .from("transcripts")
      .upload(`${type}/${filename}`, fileBuffer, {
        contentType: data.mimetype,
      });

    if (uploadError) return reply.code(500).send({ error: uploadError.message });

    const { error: metaError } = await supabase
      .from("transcripts_meta")
      .insert([{ contact_id: contactId, type, filename }]);

    if (metaError) return reply.code(500).send({ error: metaError.message });

    reply.send({ success: true, filename });
  });

  fastify.get("/transcripts/:id", async (request, reply) => {
    const { id } = request.params;
    const { data, error } = await supabase
      .from("transcripts_meta")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return reply.code(404).send({ error: "Transcript not found" });

    const { data: signedUrl, error: urlError } = await supabase.storage
      .from("transcripts")
      .createSignedUrl(`${data.type}/${data.filename}`, 3600);

    if (urlError) return reply.code(500).send({ error: urlError.message });

    reply.send({ url: signedUrl.signedUrl });
  });

  fastify.get("/transcripts/contact/:contactId", async (request, reply) => {
    const { contactId } = request.params;
    const { data, error } = await supabase
      .from("transcripts_meta")
      .select("*")
      .eq("contact_id", contactId);

    if (error) return reply.code(500).send({ error: error.message });

    reply.send({ transcripts: data });
  });
});

// ============================================================================
// END File transcript-endpoints.js
// ============================================================================

// ============================================================================
// START File services/openai.js
// ============================================================================
// Purpose: Thin OpenAI embeddings helper with lazy env access.
// - No console warnings at import time
// - Works with Node 18+ (uses global fetch)
// ============================================================================

import * as dotenv from "dotenv";
dotenv.config();

// Model helpers ---------------------------------------------------------------
export function getEmbedModel() {
  return process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";
}

export function embedDimension(model = getEmbedModel()) {
  // Known dims (OpenAI):
  // - text-embedding-3-small: 1536
  // - text-embedding-3-large: 3072
  if (/3-large$/i.test(model)) return 3072;
  return 1536;
}

// Core calls -----------------------------------------------------------------
async function _postEmbeddings(input) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const model = getEmbedModel();
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`OpenAI embeddings HTTP ${res.status}: ${err || res.statusText}`);
  }
  return res.json();
}

export async function embedText(texts = []) {
  if (!Array.isArray(texts)) throw new Error("embedText expects an array of strings");
  if (texts.length === 0) return [];
  const json = await _postEmbeddings(texts);
  return (json?.data || []).map((d) => d.embedding);
}

export async function embedOne(text = "") {
  const [vec] = await embedText([text]);
  return vec;
}

// ============================================================================
// END File services/openai.js
// ============================================================================

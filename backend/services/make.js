// ============================================================================
// START File services/make.js
// ============================================================================
// Purpose: Minimal HTTP client for Make.com webhooks (calendar_book,
// listing_match, CRM inject). Adds optional bearer token if provided.
// ============================================================================

import { request } from "undici";

const BASE = process.env.MAKE_BASE_URL || ""; // e.g. https://hook.integromat.com/abc123
const TOKEN = process.env.MAKE_TOKEN || "";   // optional

export async function makeCall(path, body) {
  if (!BASE) return null; // allow local dev without Make
  const url = `${BASE}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const { statusCode, body: resBody } = await request(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body || {}),
  });

  const text = await resBody.text();
  try {
    const json = JSON.parse(text);
    return json;
  } catch {
    return { ok: statusCode >= 200 && statusCode < 300, raw: text };
  }
}

// ============================================================================
// END File services/make.js
// ============================================================================

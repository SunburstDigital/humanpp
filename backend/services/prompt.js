// ============================================================================
// START File services/prompts.js
// ============================================================================
// Purpose: Build per-call session instructions by merging:
// - Base guardrails
// - Client prompt from Supabase (by called number / client_number)
// - RAM top-K from Pinecone (facts, transcript chunks, listing snippets)
// Debug logging via services/logger.js (toggle with DEBUG_PIPELINE).
// ============================================================================



// ============================================================================
// START Imports
// ============================================================================
import { getClientPromptByNumber } from "./supabase.js";
import { fetchCallRAM } from "./pinecone.js";
import { logNS } from "./logger.js";
// ============================================================================
// END Imports
// ============================================================================



// ============================================================================
// START Constants
// ============================================================================
// Note: app.js has its own BASE_SYSTEM_INSTRUCTIONS. This file focuses on
// augmenting with client rules + RAM. Keep a small base here as a safety net
// if app.js ever falls back to prompts.js output directly.
const LOCAL_BASE_GUARDRAILS = `
You are Sunburst Digital AI's receptionist.
- Use Australian spelling and tone.
- Be concise, friendly, and confident.
- Verify key facts before acting; ask if unsure.
- For property search: suburb, beds, baths, budget, pets → call listing_match tool.
- For bookings: confirm day/time and details → call calendar_book tool.
`.trim();
// ============================================================================
// END Constants
// ============================================================================



// ============================================================================
// START Helpers
// ============================================================================
function formatSection(title, items) {
  if (!items?.length) return "";
  const lines = items
    .map((m) => m?.metadata?.text || m?.text || "")
    .filter(Boolean)
    .map((t) => `- ${t}`);
  if (!lines.length) return "";
  return `\n### ${title}\n${lines.join("\n")}\n`;
}
// ============================================================================
// END Helpers
// ============================================================================



// ============================================================================
// START Builder
// ============================================================================
/**
 * Build a merged instruction string for a live Realtime session.
 * @param {Object} params
 * @param {string} params.calledNumber - The client's public number (used as client identifier).
 * @param {string} params.phone - Caller phone (for contact RAM filtering).
 * @param {string} params.clientNumber - Alias for calledNumber; either is fine.
 * @param {string} [params.queryText] - Optional hint for RAM retrieval focus.
 * @param {number} [params.topK=5] - How many RAM items to fetch per namespace.
 * @returns {Promise<string>} - Final merged instruction text.
 */
export async function buildSessionInstructions({
  calledNumber,
  phone,
  clientNumber,
  queryText,
  topK = 5,
}) {
  const clientId = clientNumber || calledNumber || null;

  // 1) Fetch client-specific prompt from Supabase
  let clientPrompt = "";
  try {
    clientPrompt = (await getClientPromptByNumber(clientId)) || "";
    if (clientPrompt) logNS("prompts", `Loaded client prompt for ${clientId}`);
  } catch (e) {
    logNS("prompts", "getClientPromptByNumber failed:", e?.message);
  }

  // 2) Fetch top-K RAM from Pinecone
  let ram = { facts: [], transcripts: [], listings: [] };
  try {
    ram = await fetchCallRAM({
      phone,
      clientNumber: clientId,
      queryText: queryText || "caller context and current property needs",
      topK,
    });
    logNS(
      "prompts",
      `RAM fetched: facts=${ram.facts?.length || 0}, transcripts=${
        ram.transcripts?.length || 0
      }, listings=${ram.listings?.length || 0}`
    );
  } catch (e) {
    logNS("prompts", "fetchCallRAM failed:", e?.message);
  }

  // 3) Merge all sections
  const facts = formatSection("Caller Facts (RAM)", ram.facts);
  const transcripts = formatSection(
    "Recent Transcript Chunks (RAM)",
    ram.transcripts
  );
  const listings = formatSection("Listing Snippets (RAM)", ram.listings);

  const merged = [
    LOCAL_BASE_GUARDRAILS,
    clientPrompt ? `\n### Client Rules\n${clientPrompt.trim()}\n` : "",
    facts,
    transcripts,
    listings,
  ]
    .join("\n")
    .trim();

  logNS("prompts", "Built session instructions");
  return merged;
}
// ============================================================================
// END Builder
// ============================================================================



// ============================================================================
// END File services/prompts.js
// ============================================================================

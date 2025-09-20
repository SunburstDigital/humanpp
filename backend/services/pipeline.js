// ============================================================================
// START File services/pipeline.js
// ============================================================================
// Purpose: Post-call pipeline (source of truth + RAM updates)
// - Save full transcript to Supabase
// - Summarize call via OpenAI chat
// - Chunk + upsert summary to Pinecone (transcript namespace)
// - Extract facts → Pinecone (contact namespace)
// Uses shared OpenAI wrapper (services/openai.js). Debug via logger.js.
// ============================================================================

const { saveCallTranscript } = require("./supabase.js");
const { rememberTranscriptChunk, rememberContactFact } = require("./pinecone.js");
const { chatComplete } = require("./openai.js");
const { logNS } = require("./logger.js");

function chunkText(str, size = 1500) {
  const s = String(str || "");
  const chunks = [];
  for (let i = 0; i < s.length; i += size) chunks.push(s.slice(i, i + size));
  return chunks;
}

async function summarizeTranscriptLong(text) {
  const prompt = `Summarize this call into crisp, factual bullet points (max 12).
Capture: intent, constraints, time windows, budget, pets, suburbs, priority, and follow-ups.

--- CALL TRANSCRIPT ---
${text}`;
  return chatComplete([{ role: "user", content: prompt }]);
}

async function postCallPipeline({
  callId,
  phone,
  clientNumber,
  fullTranscript,
  audioUrl = null,
}) {
  if (!fullTranscript?.trim()) {
    logNS("pipeline", `No transcript text for call ${callId}`);
    return;
  }

  logNS("pipeline", `▶ Starting pipeline for call ${callId}, phone ${phone}`);

  // 1) Save full transcript into Supabase
  await saveCallTranscript({
    callId,
    phone,
    clientNumber,
    transcriptText: fullTranscript,
    audioUrl,
  });
  logNS("pipeline", `Saved transcript to Supabase for call ${callId}`);

  // 2) Summarize transcript
  const summary = await summarizeTranscriptLong(fullTranscript);
  const preview = summary.length > 200 ? summary.slice(0, 200) + "…" : summary;
  logNS("pipeline", `Summary preview for call ${callId}: ${preview}`);

  // 3) Chunk + write into Pinecone transcript namespace
  const chunks = chunkText(summary, 900);
  for (const ch of chunks) await rememberTranscriptChunk(callId, phone, ch, { clientNumber });
  logNS("pipeline", `Stored ${chunks.length} transcript chunk(s) in Pinecone for call ${callId}`);

  // 4) Extract & upsert strong facts into Pinecone contact namespace
  const factLines = summary.split("\n").map((x) => x.trim()).filter(Boolean);
  const strong = factLines.filter((l) =>
    /(budget|pets|suburb|timeline|bed|bath|car|email|urgent|prefers|avoid|school|parking|pool|furnished)/i.test(l)
  );
  for (const f of strong) await rememberContactFact(phone, f, { clientNumber });
  logNS("pipeline", `Stored ${strong.length} strong fact(s) in Pinecone for phone ${phone}`);

  logNS("pipeline", `✅ Pipeline complete for call ${callId}`);
}
module.exports = { postCallPipeline };

// ============================================================================
// END File services/pipeline.js
// ============================================================================

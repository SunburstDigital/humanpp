// ============================================================================
// START File services/pinecone.js
// ============================================================================
// Purpose: Pinecone RAM layer for contacts, transcripts, and listings
// - Auto-creates index with correct dimension
// - Namespaces: contact | transcript | listing
// - Clean, lean metadata; full details come from Supabase
// ============================================================================

import { Pinecone } from "@pinecone-database/pinecone";
import { embedText, embedOne, embedDimension, getEmbedModel } from "./openai.js";

// Optional logger (falls back to console if missing)
let log = (...a) => console.log(...a);
try {
  const mod = await import("./logger.js");
  if (mod?.logNS) log = (ns, ...a) => mod.logNS(ns, ...a);
} catch { /* noop */ }

const {
  PINECONE_API_KEY = "",
  PINECONE_INDEX = "sunburst-memory-index",
  PINECONE_CLOUD = process.env.PINECONE_CLOUD || "aws",
  PINECONE_REGION = process.env.PINECONE_REGION || "us-east-1",
} = process.env;

let pc = null;
let index = null;

// ----------------------------------------------------------------------------
// ensureIndex() – create the index if it doesn't exist, with correct dimension
// ----------------------------------------------------------------------------
async function ensureIndex() {
  if (!PINECONE_API_KEY) {
    log("pinecone", "❌ Missing PINECONE_API_KEY");
    return null;
  }

  if (!pc) pc = new Pinecone({ apiKey: PINECONE_API_KEY });

  const dim = embedDimension(getEmbedModel());

  try {
    const existing = await pc.listIndexes();
    const found = existing.indexes?.find((x) => x.name === PINECONE_INDEX);

    if (!found) {
      log("pinecone", `🛠️ Creating index ${PINECONE_INDEX} (dim=${dim}) ...`);
      await pc.createIndex({
        name: PINECONE_INDEX,
        dimension: dim,
        metric: "cosine",
        spec: {
          serverless: { cloud: PINECONE_CLOUD, region: PINECONE_REGION },
        },
      });

      // Wait until ready
      let ready = false;
      for (let i = 0; i < 30; i++) {
        const d = await pc.describeIndex(PINECONE_INDEX);
        if (d?.status?.ready) { ready = true; break; }
        await new Promise(r => setTimeout(r, 2000));
      }
      if (!ready) throw new Error("index-not-ready");
      log("pinecone", `✅ Created index ${PINECONE_INDEX}`);
    }

    index = pc.index(PINECONE_INDEX);
    log("pinecone", `✅ Initialized index: ${PINECONE_INDEX}`);
    return index;
  } catch (e) {
    log("pinecone", "ensureIndex error:", e?.message || e);
    return null;
  }
}

// Init eagerly
await ensureIndex();

// ----------------------------------------------------------------------------
// Embedding helpers (thin wrappers)
// ----------------------------------------------------------------------------
async function embed(text) { return await embedOne(text); }
async function embedBatch(texts) { return await embedText(texts); }

// ----------------------------------------------------------------------------
// Contact Memory
// ----------------------------------------------------------------------------
export async function rememberContactFact(phone, text, meta = {}) {
  try {
    if (!index || !phone || !text) return null;
    const vec = await embed(text);
    const id = `contact:${phone}:${Date.now()}`;
    await index.namespace("contact").upsert([{
      id,
      values: vec,
      metadata: { kind: "fact", phone, text, ...meta },
    }]);
    log("pinecone", `Stored contact fact for ${phone}: "${text}"`);
    return { ok: true, id };
  } catch (e) {
    log("pinecone", "rememberContactFact error:", e?.message);
    return null;
  }
}

// ----------------------------------------------------------------------------
// Transcript Memory
// ----------------------------------------------------------------------------
export async function rememberTranscriptChunk(callId, phone, text, meta = {}) {
  try {
    if (!index || !callId || !text) return null;
    const vec = await embed(text);
    const id = `call:${callId}:${Date.now()}`;
    await index.namespace("transcript").upsert([{
      id,
      values: vec,
      metadata: { kind: "transcript_chunk", callId, phone, text, ...meta },
    }]);
    log("pinecone", `Stored transcript chunk for call ${callId}`);
    return { ok: true, id };
  } catch (e) {
    log("pinecone", "rememberTranscriptChunk error:", e?.message);
    return null;
  }
}

// ----------------------------------------------------------------------------
// Listing Memory (snippet + preview; hydrate full row from Supabase later)
// ----------------------------------------------------------------------------
export async function indexListingSnippet(listingId, companyId, summaryText, meta = {}) {
  try {
    if (!index || !listingId || !summaryText) return null;

    const fullDescription = (meta.fullDescription ?? "").toString();
    const descPreview = fullDescription.slice(0, 1200);

    // build the embedding text (summary + full description), lightly truncated
    const embedBody = [summaryText, fullDescription].filter(Boolean).join("\n\n").slice(0, 8000);
    const vec = await embed(embedBody);

    // sanitize metadata: drop null/undefined; Pinecone accepts string/number/bool/array-of-strings
    const rawMeta = {
      kind: "listing_snippet",
      listingId,
      company_id: companyId ?? null,           // we’ll filter by this later
      text: summaryText,
      descPreview,
      suburb: meta.suburb ?? null,
      price: meta.price ?? null,
      beds: meta.beds ?? null,
      baths: meta.baths ?? null,
      pets_ok: meta.pets_ok ?? null,
      status: meta.status ?? null,
      url: meta.url ?? null,
      address: meta.address ?? null,
      external_id: meta.external_id ?? null,
    };
    const cleanMeta = Object.fromEntries(
      Object.entries(rawMeta).filter(([, v]) => v !== null && v !== undefined)
    );

    const id = `listing:${listingId}`;
    await index.namespace("listing").upsert([{
      id,
      values: vec,
      metadata: cleanMeta,
    }]);

    log("pinecone", `Indexed listing snippet ${listingId} for company ${companyId || "n/a"}`);
    return { ok: true, id };
  } catch (e) {
    log("pinecone", "indexListingSnippet error:", e?.message);
    return null;
  }
}


// ----------------------------------------------------------------------------
// Listing Search (returns raw Pinecone matches with metadata)
// ----------------------------------------------------------------------------
export async function searchListingSnippets({ clientNumber, companyId, queryText, topK = 8 }) {
  if (!index) return [];
  const q = (queryText || "").trim() || "matching residential property listing";
  const qvec = await embed(q);

  try {
    const r = await index.namespace("listing").query({
      vector: qvec,
      topK,
      includeMetadata: true,
      filter: companyId ? { company_id: companyId } : (clientNumber ? { company_id: clientNumber } : undefined),
    });
    const matches = r?.matches || [];
    log("pinecone", `searchListingSnippets returned ${matches.length} results`);
    return matches.map((m) => ({
      id: m.id,
      score: m.score,
      metadata: m.metadata || {},
      listingId: m.metadata?.listingId,
      text: m.metadata?.text,
    }));
  } catch (e) {
    log("pinecone", "searchListingSnippets error:", e?.message);
    return [];
  }
}

// ----------------------------------------------------------------------------
// Fetch aggregated RAM for a call (facts + transcripts + listing recall)
// ----------------------------------------------------------------------------
export async function fetchCallRAM({ phone, clientNumber, companyId, queryText, topK = 5 }) {
  if (!index) return { facts: [], transcripts: [], listings: [] };
  const q = (queryText || "").trim() || "caller context and recent needs";
  const qvec = await embed(q);

  async function doQuery(ns, filter) {
    try {
      const r = await index.namespace(ns).query({
        vector: qvec, topK, includeMetadata: true, filter,
      });
      return r?.matches || [];
    } catch {
      return [];
    }
  }

  const facts = await doQuery("contact", phone ? { phone } : undefined);
  const transcripts = await doQuery("transcript", phone ? { phone } : undefined);
  const listings = await doQuery("listing", (companyId || clientNumber) ? { company_id: companyId || clientNumber } : undefined);

  log("pinecone", `Fetched RAM for phone=${phone}, company=${companyId || clientNumber}`);
  return { facts, transcripts, listings };
}

// ----------------------------------------------------------------------------
// Maintenance
// ----------------------------------------------------------------------------
export async function deleteNamespaceIds(namespace, ids = []) {
  if (!index || !namespace || !ids?.length) return { ok: false, deleted: 0 };
  try {
    await index.namespace(namespace).deleteMany(ids);
    log("pinecone", `Deleted ${ids.length} ids from ${namespace}`);
    return { ok: true, deleted: ids.length };
  } catch (e) {
    log("pinecone", "deleteNamespaceIds error:", e?.message);
    return { ok: false, deleted: 0 };
  }
}

export async function deleteByFilter(namespace, filter) {
  if (!index || !namespace || !filter) return { ok: false };
  try {
    await index.namespace(namespace).deleteAll({ filter });
    log("pinecone", `Deleted by filter in ${namespace}`);
    return { ok: true };
  } catch (e) {
    log("pinecone", "deleteByFilter error:", e?.message);
    return { ok: false };
  }
}

export async function health() {
  return { ok: !!index, index: PINECONE_INDEX };
}

// ============================================================================
// END File services/pinecone.js
// ============================================================================

// ============================================================================
// START File scripts/backfill-listings.js
// ============================================================================
// Purpose: Pull listings from Supabase and index rich semantic text in Pinecone.
// Usage: node scripts/backfill-listings.js
// ============================================================================

import "dotenv/config.js";
import { createClient } from "@supabase/supabase-js";
import { indexListingSnippet } from "../services/pinecone.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function spokenSummary(row) {
  const parts = [];
  // e.g., "For rent in Maylands — 3 bed, 2 bath, 1 car, pets ok, $650/week."
  if (row.type) parts.push(row.type === "lease" ? "For rent" : "For sale");
  if (row.suburb) parts.push(`in ${row.suburb}`);
  const head = parts.join(" ");

  const specs = [];
  if (row.beds) specs.push(`${row.beds} bed`);
  if (row.baths) specs.push(`${row.baths} bath`);
  if (row.carspaces) specs.push(`${row.carspaces} car`);
  if (row.pets_ok) specs.push("pets ok");
  const specStr = specs.length ? ` — ${specs.join(", ")}` : "";

  const price = row.price ? `, ${row.price}.` : ".";
  return `${head}${specStr}${price}`.replace(/\s+/g, " ").trim();
}

function toSummaryText(row) {
  // This is the concise summary that’s easy to speak out
  return spokenSummary(row);
}

function toMeta(row) {
  return {
    suburb: row.suburb || null,
    price: row.price || null,
    beds: row.beds || null,
    baths: row.baths || null,
    carspaces: row.carspaces || null,
    type: row.type || null,
    status: row.status || null,
    url: row.url || null,
  };
}

async function run() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_KEY");
    process.exit(1);
  }
  if (!process.env.PINECONE_API_KEY) {
    console.error("Missing PINECONE_API_KEY");
    process.exit(1);
  }

  console.log("Fetching listings from Supabase...");
  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .limit(5000);

  if (error) {
    console.error("Supabase fetch error:", error.message);
    process.exit(1);
  }

  if (!listings?.length) {
    console.log("No listings to backfill.");
    process.exit(0);
  }

  let ok = 0, fail = 0;
  for (const row of listings) {
    try {
      const summary = toSummaryText(row);
      const meta = toMeta(row);
      await indexListingSnippet(
        row.id,
        row.client_number || null,
        summary,
        {
          ...meta,
          fullDescription: row.description || "", // full body goes in meta for embedding/preview
          address: row.address || null,
          open_times: row.open_times || null,
        }
      );
      ok++;
    } catch (e) {
      fail++;
      console.error("Index error:", e?.message);
    }
  }

  console.log(`Backfill complete: indexed=${ok}, failed=${fail}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

// ============================================================================
// END File scripts/backfill-listings.js
// ============================================================================

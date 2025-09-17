// ============================================================================
// START File scripts/sync-pinecone-from-supabase.js
// ============================================================================
//Run nightly (Task Scheduler/cron/Fly machine):
// run in powershell =  node scripts/sync-pinecone-from-supabase.js
//What it does: only re-embeds listings updated in the last 24h (change window tweakable).


import "dotenv/config.js";
import { createClient } from "@supabase/supabase-js";
import { indexListingSnippet } from "../services/pinecone.js";

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const lookbackHours = parseInt(process.env.SYNC_LOOKBACK_HOURS || "24", 10);
const since = new Date(Date.now() - lookbackHours * 60 * 60 * 1000).toISOString();

(async () => {
  const { data: rows, error } = await sb
    .from("listings")
    .select("id, company_id, type, suburb, address, price, beds, baths, pets_ok, status, url, description, updated_at")
    .gte("updated_at", since);

  if (error) {
    console.error("Supabase fetch error:", error);
    process.exit(1);
  }

  let indexed = 0, failed = 0;
  for (const r of rows || []) {
    const spoken = [
      r.type === "lease" ? "For rent" : "For sale",
      r.suburb && `in ${r.suburb}`,
      r.beds && `${r.beds} bed`,
      r.baths && `${r.baths} bath`,
      r.pets_ok ? "pets ok" : null,
      r.price
    ].filter(Boolean).join(", ") + ".";

    const ok = await indexListingSnippet(
      r.id, r.company_id, spoken,
      {
        suburb: r.suburb,
        price: r.price,
        beds: r.beds,
        baths: r.baths,
        pets_ok: !!r.pets_ok,
        status: r.status,
        url: r.url,
        address: r.address,
        fullDescription: r.description
      }
    );

    ok ? indexed++ : failed++;
  }

  console.log(`Delta sync complete: indexed=${indexed}, failed=${failed}`);
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
// ============================================================================
// END File scripts/sync-pinecone-from-supabase.js
// ============================================================================

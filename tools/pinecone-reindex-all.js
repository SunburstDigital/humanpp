// ============================================================================
// START File scripts/pinecone-reindex-all.js
// ============================================================================
// What it does: re-embeds all listings (use when rolling to a new embedding model + new index name).
import "dotenv/config.js";
import { createClient } from "@supabase/supabase-js";
import { indexListingSnippet } from "../backend/services/pinecone.js";

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
  const { data: rows, error } = await sb
    .from("listings")
    .select("id, company_id, type, suburb, address, price, beds, baths, pets_ok, status, url, description");

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
  console.log(`Full reindex complete: indexed=${indexed}, failed=${failed}`);
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
// ============================================================================
// END File scripts/pinecone-reindex-all.js
// ============================================================================

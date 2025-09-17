// ============================================================================
// START File scripts/pinecone-smoketest.js
// ============================================================================
import "dotenv/config.js";
import { rememberContactFact, searchListingSnippets, indexListingSnippet, health } from "../services/pinecone.js";

async function run() {
  console.log("Health:", await health());

  // 1) contact memory test
  const r1 = await rememberContactFact("+61400000000", "prefers Maylands rentals under $650/wk, pets ok");
  console.log("contact fact:", r1);

  // 2) listing snippet test (dummy)
  const r2 = await indexListingSnippet("00000000-0000-0000-0000-000000000001", "ACME-REI",
    "For rent in Maylands — 3 bed, 2 bath, pets ok, $640/week",
    { suburb: "Maylands", price: "$640/week", beds: 3, baths: 2, pets_ok: true, status: "available", url: "https://example.com" }
  );
  console.log("listing upsert:", r2);

  // 3) search snippets
  const found = await searchListingSnippets({ clientNumber: "ACME-REI", queryText: "Maylands 3x2 pets under 650", topK: 5 });
  console.log("search results:", found);
}

run().catch((e) => { console.error(e); process.exit(1); });
// ============================================================================
// END File scripts/pinecone-smoketest.js
// ============================================================================

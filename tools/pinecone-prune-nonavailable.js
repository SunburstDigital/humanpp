// ============================================================================
// START File scripts/pinecone-prune-nonavailable.js
// ============================================================================
//run in powershell = node scripts/pinecone-prune-nonavailable.js ACME-REI
// or without arg to prune all companies:
//run in powershell =node scripts/pinecone-prune-nonavailable.js

import "dotenv/config.js";
import { deleteByFilter } from "../services/pinecone.js";

const companyId = process.argv[2] || process.env.COMPANY_ID || null;

(async () => {
  const filter = { status: { $ne: "available" } };
  if (companyId) filter.company_id = companyId;

  const r = await deleteByFilter("listing", filter);
  console.log("Prune non-available result:", r);
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
// ============================================================================
// END File scripts/pinecone-prune-nonavailable.js
// ============================================================================

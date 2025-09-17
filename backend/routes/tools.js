// ======================================================================================
// File: routes/tools.js
// Purpose: Handle OpenAI tool calls (listing_match, calendar_book, ghl_crm_inject).
// ======================================================================================
import { getListingsByIds, upsertContact, makeInvoke, saveLog } from "../services/supabase.js";
import { searchListingSnippets } from "../services/pinecone.js";
import { logger } from "../utils/logging.js";
import { getTranscriptSignedUrl } from "../utils/url-generator.js";

export async function routeToolCall(name, args, { from, to, callSid }) {
  try {
    switch (name) {
      case "ghl_crm_inject": {
        const contact = await upsertContact({ phone: from || args?.phone, name: args?.name || null });
        await saveLog({
          contact_id: contact?.id,
          phone: from,
          summary: "CRM contact injected",
          type: "tool_crm_inject",
        });
        return { ok: true, contact };
      }

      case "listing_match": {
        const queryText = args?.queryText || [
          args?.suburb,
          args?.min_beds ? `${args.min_beds}+ beds` : "",
          args?.min_baths ? `${args.min_baths}+ baths` : "",
          args?.pets ? "pets ok" : "",
          args?.for,
          args?.budget ? `budget ${args.budget}` : "",
        ]
          .filter(Boolean)
          .join(", ");

        const candidates = await searchListingSnippets({
          clientNumber: to,
          queryText,
          topK: Math.min(args?.topK || 6, 12),
        });

        const ids = candidates.map((c) => c.listingId).filter(Boolean);
        const fullRows = await getListingsByIds(to, ids);

        await saveLog({
          phone: from,
          summary: `Listing match for query: ${queryText}`,
          type: "tool_listing_match",
        });

        return { ok: true, queryText, results: fullRows || [] };
      }

      case "calendar_book": {
        if (process.env.MAKE_WEBHOOK_BOOK) {
          await makeInvoke(process.env.MAKE_WEBHOOK_BOOK, {
            clientNumber: to,
            attendee: {
              name: args?.name || "",
              phone: args?.phone || from || "",
              email: args?.email || "",
            },
            when: args?.datetime || null,
            notes: args?.notes || "",
          });
        }

        await saveLog({
          phone: from,
          summary: `Calendar booking requested: ${args?.datetime || "TBD"}`,
          type: "tool_calendar_book",
        });

        return { ok: true, forwarded: !!process.env.MAKE_WEBHOOK_BOOK };
      }

      default:
        await saveLog({
          phone: from,
          summary: `Unknown tool call: ${name}`,
          type: "tool_unknown",
        });
        return { ok: false, error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    logger.error({ err }, "❌ Tool call failed");
    return { ok: false, error: err.message };
  }
}

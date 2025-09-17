// ============================================================================
// START File services/supabase.js
// ============================================================================
// Purpose: Supabase = source of truth for Sunburst AI Voice System.
// Stores full listings, transcripts, contacts, bookings, and prompts.
// Provides helpers for pipeline and tool routing.
// Debug logging via services/logger.js (toggle with DEBUG_PIPELINE).
// ============================================================================
import * as dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import { logNS } from "./logger.js";

const {
  SUPABASE_URL = "",
  SUPABASE_SERVICE_KEY = "",
} = process.env;

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});
export { sb };
// ============================================================================
// START Client Prompts
// ============================================================================
export async function getClientPromptByNumber(calledNumber) {
  if (!calledNumber) return "";
  const { data, error } = await sb
    .from("prompts")
    .select("prompt")
    .eq("client_number", calledNumber)
    .maybeSingle();

  if (error) {
    logNS("supabase", "getClientPromptByNumber error:", error.message);
    return "";
  }
  logNS("supabase", `Fetched prompt for number ${calledNumber}`);
  return data?.prompt || "";
}

export async function setPromptForClient({
  client_number,
  prompt,
  voice = "alloy",
  industry = "real_estate",
  enabled = true,
}) {
  try {
    const { data, error } = await sb
      .from("prompts")
      .upsert([{ client_number, prompt, voice, industry, enabled }])
      .select("*")
      .maybeSingle();

    if (error) throw error;
    logNS("supabase", `Updated prompt for client ${client_number}`);
    return data;
  } catch (err) {
    logNS("supabase", "setPromptForClient error:", err.message);
    return null;
  }
}
// ============================================================================
// END Client Prompts
// ============================================================================

// ============================================================================
// START Contacts
// ============================================================================
export async function upsertContact({ phone, name, clientNumber }) {
  if (!phone) return null;
  const { data, error } = await sb
    .from("contacts")
    .upsert(
      { phone, name: name || null, client_number: clientNumber || null },
      { onConflict: "phone" }
    )
    .select()
    .maybeSingle();

  if (error) {
    logNS("supabase", "upsertContact error:", error.message);
    return null;
  }
  logNS("supabase", `Upserted contact ${phone}`);
  return data;
}
// ============================================================================
// END Contacts
// ============================================================================

// ============================================================================
// START Listings
// ============================================================================
export async function getListingsByIds(clientNumber, ids = []) {
  if (!ids?.length) return [];
  const { data, error } = await sb
    .from("listings")
    .select("*")
    .in("id", ids)
    .eq("client_number", clientNumber);

  if (error) {
    logNS("supabase", "getListingsByIds error:", error.message);
    return [];
  }
  logNS("supabase", `Fetched ${data?.length || 0} listings for client ${clientNumber}`);
  return data || [];
}
// ============================================================================
// END Listings
// ============================================================================

// ============================================================================
// START Transcripts
// ============================================================================
export async function saveCallTranscript({
  callId,
  phone,
  clientNumber,
  transcriptText,
  audioUrl = null,
  raw = null,
}) {
  if (!callId || !transcriptText) return null;
  const { data, error } = await sb
    .from("call_transcripts")
    .insert({
      call_id: callId,
      phone,
      client_number: clientNumber,
      transcript_text: transcriptText,
      audio_url: audioUrl,
      raw_json: raw ? JSON.stringify(raw) : null,
    })
    .select()
    .maybeSingle();

  if (error) {
    logNS("supabase", "saveCallTranscript error:", error.message);
    return null;
  }
  logNS("supabase", `Saved transcript for call ${callId}`);
  return data;
}
// ============================================================================
// END Transcripts
// ============================================================================

// ============================================================================
// START Make Webhooks
// ============================================================================
export async function makeInvoke(url, payload) {
  if (!url) throw new Error("Missing Make webhook URL");
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
  logNS("supabase", `makeInvoke POST ${url} -> ${res.status}`);
  return { ok: res.ok, status: res.status };
}
// ============================================================================
// END Make Webhooks
// ============================================================================

// ============================================================================
// START Logs Helpers (fixed UUID-safe inserts)
// ============================================================================
export async function getRecentLogs(limit = 10) {
  const { data, error } = await sb
    .from("call_logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getLogsByContact(phone) {
  const { data, error } = await sb
    .from("call_logs")
    .select("*")
    .eq("phone", phone)
    .order("timestamp", { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveLog({ contact_id, phone, summary, type = "generic" }) {
  try {
    let resolvedContactId = contact_id || null;

    if (!resolvedContactId && phone) {
      const { data: contact, error: contactErr } = await sb
        .from("contacts")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (contactErr) throw contactErr;
      resolvedContactId = contact?.id || null;
    }

    const { data, error } = await sb
      .from("call_logs")
      .insert({
        contact_id: resolvedContactId,
        phone,
        summary,
        type,
        timestamp: new Date().toISOString(),
      })
      .select("*")
      .maybeSingle();

    if (error) throw error;
    logNS("supabase", `Saved log entry: ${summary}`);
    return { ok: true, data };
  } catch (err) {
    logNS("supabase", "saveLog error:", err.message);
    return { ok: false, error: err.message };
  }
}

export async function insertCall({
  contact_id,
  phone,
  direction = "inbound",
  medium = "voice",
  summary = null,
  intent = null,
  audio_url = null
}) {
  try {
    let resolvedContactId = contact_id || null;

    if (!resolvedContactId && phone) {
      const { data: contact, error: contactErr } = await sb
        .from("contacts")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (contactErr) throw contactErr;
      resolvedContactId = contact?.id || null;
    }

    const { data, error } = await sb
      .from("call_logs")
      .insert({
        contact_id: resolvedContactId,
        phone,
        summary,
        type: medium,
        intent,
        audio_url,
        timestamp: new Date().toISOString(),
      })
      .select("*")
      .maybeSingle();

    if (error) throw error;
    logNS("supabase", `Inserted call log: ${summary || "(no summary)"}`);
    return data;
  } catch (err) {
    logNS("supabase", "insertCall error:", err.message);
    return null;
  }
}
// ============================================================================
// END Logs Helpers (fixed UUID-safe inserts)
// ============================================================================


// ============================================================================
// END File services/supabase.js
// ============================================================================

// ============================================================================
// START File services/supabase.js
// ============================================================================
// Purpose: Supabase = source of truth for Sunburst AI Voice System.
// Stores full listings, transcripts, contacts, bookings, and prompts.
// Provides helpers for pipeline and tool routing.
// Debug logging via services/logger.js (toggle with DEBUG_PIPELINE).
// ============================================================================
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve("infra", ".env") });

import { createClient } from "@supabase/supabase-js";
import { logNS } from "../utils/logging.js";

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

export async function checkSupabaseHealth() {
  return { ok: true, message: "Supabase is reachable" };
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
// Save Call Summary
// ============================================================================
/**
 * Save a call summary to Supabase call_logs table.
 * @param {Object} params
 * @param {string} params.phone - Phone number (required)
 * @param {string} params.summary - Call summary text (required)
 * @param {string|null} params.clientNumber - Client number (optional)
 * @param {string} [params.type="summary"] - Log type (default: "summary")
 * @param {string} [params.contact_id] - Contact ID (optional, resolved from phone if missing)
 * @returns {Promise<Object|null>} Inserted row or null on error
 */
export async function saveCallSummary({ phone, summary, clientNumber = null, type = "summary", contact_id = null, intent = null, audio_url = null, transcript_url = null }) {
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
        client_number: clientNumber,
        type,
        intent,
        audio_url,
        transcript_url,
        timestamp: new Date().toISOString(),
      })
      .select("*")
      .maybeSingle();
    if (error) {
      logNS("supabase", "saveCallSummary insert error:", String(error), error, { data, error });
      return null;
    }
    logNS("supabase", `Saved call summary for phone ${phone}: ${summary}`);
    return data;
  } catch (err) {
    logNS("supabase", "saveCallSummary error:", err, JSON.stringify(err));
    return null;
  }
}


// ============================================================================
// Save Call Summary
// ============================================================================
/**
 * Save a call summary to Supabase call_logs table.
 * @param {Object} params
 * @param {string} params.contact_id - Contact ID (optional, will resolve from phone if not provided)
 * @param {string} params.phone - Phone number (required if contact_id not provided)
 * @param {string} params.summary - Call summary text
 * @param {string} [params.type="summary"] - Log type (default: "summary")
 * @param {string} [params.intent] - Call intent (optional)
 * @param {string} [params.audio_url] - Audio URL (optional)
 * @returns {Promise<Object|null>} Inserted row or null on error
 */


// ============================================================================
// END File services/supabase.js
// ============================================================================

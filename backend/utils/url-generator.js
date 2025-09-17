// utils/url-generator.js
// Helper to generate signed Supabase Storage URLs for the transcripts bucket
import { sb } from "../services/supabase.js";
import { logNS } from "./logging.js";

/**
 * Generate a signed URL for a file in the transcripts bucket.
 * @param {string} filePath - The path to the file in the transcripts bucket (e.g., call_ABC123.mp3)
 * @param {number} expiresIn - Expiry time in seconds (default: 3600)
 * @returns {Promise<string|null>} The signed URL or null if error
 *
 * Example usage (backend):
 *   import { getTranscriptSignedUrl } from "../utils/url-generator.js";
 *   const url = await getTranscriptSignedUrl("call_ABC123.mp3", 900);
 *
 * Example usage (dashboard/frontend):
 *   // Call GET /media-url?path=call_ABC123.mp3&expires=900
 *   // The backend will return { ok: true, url: "...signedUrl..." }
 *   // Use this signed URL to display or download the file securely.
 */
export async function getTranscriptSignedUrl(filePath, expiresIn = 3600) {
  if (!filePath) return null;
  const { data, error } = await sb.storage
    .from("transcripts")
    .createSignedUrl(filePath, expiresIn);
  if (error) {
    logNS("url-generator", "Error creating signed URL:", error, { filePath, expiresIn });
    return null;
  }
  return data?.signedUrl || null;
}

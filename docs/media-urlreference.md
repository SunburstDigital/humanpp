# Media URL Reference: Supabase Signed URLs for Audio/Transcripts

## Overview
This document describes the architecture, usage, endpoints, and helper function for generating signed Supabase Storage URLs for audio and transcript files. This enables secure, time-limited access to media files from your dashboard or other authenticated clients.

---

## Architecture
- **Storage:** All call audio and transcript files are stored in the Supabase `transcripts` bucket.
- **Database:** The `call_logs` table stores only the file paths (e.g., `audio_path`, `transcript_path`) for each call.
- **Backend Helper:** A reusable helper function (`getTranscriptSignedUrl`) generates signed URLs for any file in the bucket.
- **API Endpoint:** The `/media-url` endpoint exposes this functionality to the dashboard/frontend.

---

## Helper Function: `getTranscriptSignedUrl`
- **Location:** `backend/utils/url-generator.js`
- **Signature:**
  ```js
  async function getTranscriptSignedUrl(filePath, expiresIn = 3600): Promise<string|null>
  ```
- **Purpose:** Returns a signed URL for a file in the `transcripts` bucket, valid for `expiresIn` seconds.
- **Example Usage (backend):**
  ```js
  import { getTranscriptSignedUrl } from "../utils/url-generator.js";
  const url = await getTranscriptSignedUrl("call_ABC123.mp3", 900); // 15 min expiry
  ```

---

## API Endpoint: `/media-url`
- **Location:** `backend/routes/media-url.js`
- **Method:** `GET`
- **Query Parameters:**
  - `path` (required): File path in the transcripts bucket (e.g., `call_ABC123.mp3`)
  - `expires` (optional): Expiry time in seconds (default: 3600)
- **Example Request:**
  ```http
  GET /media-url?path=call_ABC123.mp3&expires=900
  ```
- **Example Response:**
  ```json
  { "ok": true, "url": "https://...signedUrl..." }
  ```

---

## Example Dashboard Integration
1. Fetch the `audio_path` or `transcript_path` for each call from the database.
2. For each file, call the backend endpoint:
   ```js
   // Example using fetch in frontend code
   const res = await fetch(`/media-url?path=${encodeURIComponent(audio_path)}&expires=900`);
   const { ok, url } = await res.json();
   if (ok) {
     // Use the signed URL to play or download the file
   }
   ```
3. Display or link to the signed URL in your dashboard UI.

---

## Security Notes
- Only expose `/media-url` to authenticated users.
- Signed URLs expire after the specified time and cannot be reused.
- Never store or expose permanent public URLs for sensitive media.

---

**File:** `docs/media-urlreference.md`

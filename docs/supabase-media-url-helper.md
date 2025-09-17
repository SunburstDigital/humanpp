# Supabase Media URL Helper & API Endpoint

## Overview
This document explains how to generate signed URLs for audio and transcript files stored in the Supabase `transcripts` bucket. This allows secure, time-limited access to call recordings and transcripts from your dashboard or any authenticated UI.

## Helper Function: `getTranscriptSignedUrl`
- **Location:** `backend/utils/url-generator.js`
- **Purpose:** Generates a signed URL for a file in the `transcripts` bucket.
- **Usage (backend):**
  ```js
  import { getTranscriptSignedUrl } from "../utils/url-generator.js";
  const url = await getTranscriptSignedUrl("call_ABC123.mp3", 900); // 15 min expiry
  ```
- **Usage (frontend/dashboard):**
  - Call the backend endpoint: `GET /media-url?path=call_ABC123.mp3&expires=900`
  - The backend responds with `{ ok: true, url: "...signedUrl..." }`
  - Use the returned URL to display or download the file securely.

## API Endpoint: `/media-url`
- **Location:** `backend/routes/tools.js`
- **Method:** `GET`
- **Query Parameters:**
  - `path` (required): The file path in the transcripts bucket (e.g., `call_ABC123.mp3`)
  - `expires` (optional): Expiry time in seconds (default: 3600)
- **Example Request:**
  ```http
  GET /media-url?path=call_ABC123.mp3&expires=900
  ```
- **Example Response:**
  ```json
  { "ok": true, "url": "https://...signedUrl..." }
  ```

## When to Use
- When displaying a dashboard of calls, fetch the relevant `audio_path` or `transcript_path` from the database, then call `/media-url` to get a signed URL for each file.
- Signed URLs are time-limited for security. Adjust the `expires` parameter as needed.

## Security Note
- Only expose the `/media-url` endpoint to authenticated users.
- Signed URLs expire after the specified time and cannot be reused.

---

**File:** `docs/supabase-media-url-helper.md`

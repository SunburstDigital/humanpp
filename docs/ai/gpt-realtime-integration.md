# gpt-realtime-integration.md

## Overview

This document explains how to integrate OpenAI’s Realtime API (GPT-4o / GPT-5) for full-duplex voice communication using WebSocket. It supports streaming audio in and out in real-time and can handle function calling (tool use).

---

## Requirements

* OpenAI API key (Tier 3+)
* WebSocket library (e.g., `ws`)
* Audio source (Twilio Media Streams, browser mic input)
* Fastify or similar backend framework

---

## Connection Flow

1. Client (Twilio or Web app) opens WebSocket to your server
2. Server proxies audio stream to OpenAI Realtime API
3. OpenAI processes and returns streamed audio + optional tool calls
4. Server streams audio back to client

---

## Session Configuration

```json
{
  "type": "session.update",
  "session": {
    "modalities": ["audio", "text"],
    "voice": "alloy",
    "instructions": "You are a helpful agent. No narration. Use tools silently.",
    "tools": [ ... ]
  }
}
```

---

## Handling Audio

Send base64 chunks to OpenAI:

```json
{
  "type": "input_audio_buffer.append",
  "audio": "<base64-string>"
}
```

Receive delta:

```json
{
  "type": "response.audio.delta",
  "delta": "<base64-audio>"
}
```

---

## Handling Tool Calls

Receive:

```json
{
  "type": "session.tool_call",
  "tool": {
    "name": "lookup_calendar",
    "arguments": { "query": "today 3pm" }
  }
}
```

Reply:

```json
{
  "type": "tool_call_result",
  "tool_call_id": "abc123",
  "result": "{'slot_available': true}"
}
```

---

## Latency Tuning

Use `turn_detection: server_vad` for best responsiveness.

---

## Error Handling

* Monitor for `disconnect`, `overload`, `session.error` events
* Add retries and timeouts at WebSocket and tool layer

---

## Notes

* Rate limit: \~100 concurrent sessions (Tier 5)
* Cost: \~\$0.06/min input, \~\$0.24/min output
* Suggested fallback: TTS only on error

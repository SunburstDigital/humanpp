// ======================================================================================
// File: routes/media-stream.js
// Purpose: Handle Twilio inbound call webhook and bridge Twilio <Stream> <-> OpenAI Realtime
// ======================================================================================
import WebSocket, { WebSocket as WSClient } from "ws";
import { notesStart, notesAdd, notesEnd, notesStr, escapeXml } from "../utils/session-notes.js";
import { logger } from "../utils/logging.js";
import { saveLog } from "../services/supabase.js";
import { routeToolCall } from "./tools.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const REALTIME_MODEL = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2025-08-28";

const BASE_SYSTEM_INSTRUCTIONS = `
You are a professional AI receptionist for Sunburst Digital clients.
- Use Australian spelling and tone.
- Be concise, friendly, confident.
- Use tools silently; never mention JSON, functions, or internals.
`;

export default async function mediaStreamRoutes(app) {
  // Inbound call TwiML
  app.post("/twilio/incoming-call", async (req, reply) => {
    const host = process.env.PUBLIC_HOSTNAME || req.headers["x-forwarded-host"] || req.headers.host;
    const callSid = req.body?.CallSid || "";
    const wsUrl = `wss://${host}/media-stream?callSid=${encodeURIComponent(callSid)}`;

    const twiml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<Response>` +
      `<Say voice="Polly.Matthew">Hello, connecting you now.</Say>` +
      `<Connect><Stream url="${escapeXml(wsUrl)}"/></Connect>` +
      `</Response>`;

    reply.header("Content-Type", "text/xml").send(twiml);
  });

  // WebSocket media bridge
  app.get("/media-stream", { websocket: true }, async (twilioConn, req) => {
    const to = req.headers["x-twilio-call-to"] || null;
    const from = req.headers["x-twilio-call-from"] || null;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const callSid = url.searchParams.get("callSid") || "unknown";

    let openaiWS = null;
    let streamSid = null;
    let pingTimer = null;
    let closed = false;

    const safeSend = (ws, data) => { if (ws && ws.readyState === WSClient.OPEN) ws.send(data); };
    const toOpenAIEvent = (type, payload = {}) => JSON.stringify({ type, ...payload });

    const closeAll = (code = 1000, reason = "normal") => {
      if (closed) return;
      closed = true;
      try { if (pingTimer) clearInterval(pingTimer); } catch {}
      try { if (openaiWS?.readyState === WSClient.OPEN) openaiWS.close(code, reason); } catch {}
      try { notesEnd(callSid); } catch {}
      try { twilioConn.close(code, reason); } catch {}
    };

    // Connect to OpenAI Realtime
    try {
      openaiWS = new WebSocket(
        `wss://api.openai.com/v1/realtime?model=${encodeURIComponent(REALTIME_MODEL)}`,
        { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "OpenAI-Beta": "realtime=v1" } }
      );
    } catch (err) {
      logger.error({ err }, "OpenAI WS init failed");
      return closeAll(1011, "openai-init-failed");
    }

    // OpenAI session lifecycle
    openaiWS.on("open", async () => {
      notesStart(callSid);
      await saveLog({ phone: from, summary: "Caller connected", type: "call_start" });
      pingTimer = setInterval(() => {
        try { if (openaiWS?.readyState === WSClient.OPEN) openaiWS.ping(); } catch {}
      }, 15000);

      safeSend(openaiWS, JSON.stringify({
        type: "session.update",
        session: {
          instructions: (BASE_SYSTEM_INSTRUCTIONS || "") + notesStr(callSid),
          voice: "alloy",
          modalities: ["audio", "text"],
          input_audio_format: { type: "g711_ulaw", sample_rate: 8000 },
          output_audio_format: { type: "g711_ulaw", sample_rate: 8000 },
        },
      }));

      safeSend(openaiWS, toOpenAIEvent("response.create", {
        response: { modalities: ["audio"], instructions: `Call connected. From: ${from || "unknown"}. Greet and assist.` },
      }));
    });

    openaiWS.on("error", (err) => { logger.error({ err }, "OpenAI WS error"); closeAll(1011, "openai-error"); });

    openaiWS.on("close", async () => {
      await saveLog({ phone: from, summary: "Caller disconnected", type: "call_end" });
      closeAll(1000, "openai-closed");
    });

    // Messages FROM OpenAI
    openaiWS.on("message", async (data, isBinary) => {
      if (isBinary) return;
      let msg; try { msg = JSON.parse(data.toString()); } catch { return; }

      switch (msg.type) {
        case "response.output_audio.delta":
          if (streamSid && msg?.audio) {
            safeSend(twilioConn, JSON.stringify({ event: "media", streamSid, media: { payload: msg.audio } }));
          }
          break;

        case "response.tool_call":
          const toolCall = msg.tool_call;
          if (!toolCall) return;
          const { name, arguments: toolArgs, id: toolCallId } = toolCall;
          const result = await routeToolCall(name, toolArgs, { from, to, callSid });
          notesAdd(callSid, `Tool used: ${name}`);
          safeSend(openaiWS, toOpenAIEvent("tool.output", { tool_call_id: toolCallId, output: result }));
          safeSend(openaiWS, toOpenAIEvent("response.create", { response: { modalities: ["audio"] } }));
          break;

        default:
          break;
      }
    });

    // Messages FROM Twilio
    twilioConn.socket.on("message", (raw) => {
      try {
        const evt = JSON.parse(raw.toString());
        if (evt.event === "start") {
          streamSid = evt?.start?.streamSid;
          notesAdd(callSid, "caller connected");
        }
        if (evt.event === "media") {
          const base64Mulaw = evt?.media?.payload;
          if (!base64Mulaw) return;
          safeSend(openaiWS, toOpenAIEvent("input_audio_buffer.append", { audio: base64Mulaw, format: "g711_ulaw", sample_rate: 8000 }));
          if (Math.random() < 0.06) safeSend(openaiWS, toOpenAIEvent("response.create", { response: { modalities: ["audio"] } }));
        }
        if (evt.event === "stop") {
          notesAdd(callSid, "caller left");
          saveLog({ phone: from, summary: "Caller hung up", type: "call_end" });
          safeSend(openaiWS, toOpenAIEvent("response.create", {
            response: { modalities: ["audio"], instructions: "The caller has left. Say goodbye." },
          }));
          setTimeout(() => closeAll(1000, "call-ended"), 400);
        }
      } catch {}
    });

    twilioConn.socket.on("close", () => closeAll(1000, "twilio-closed"));
    twilioConn.socket.on("error", (e) => { logger.error({ e }, "Twilio WS error"); closeAll(1011, "twilio-error"); });
  });
}

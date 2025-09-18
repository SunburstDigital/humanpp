import { twilioHandleIncomingCall, twilioStartMediaStream } from "../providers/twilio/twilio-media.js";

export default function mediaStreamRoutes(app) {
  app.post("/twilio/incoming-call", twilioHandleIncomingCall);
  app.get("/media-stream", { websocket: true }, twilioStartMediaStream);
}

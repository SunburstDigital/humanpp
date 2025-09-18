import { twilioHandleCallSummary } from "../providers/twilio/twilio-voice.js";

export default function summaryRoutes(app) {
  app.post("/calls/summary", twilioHandleCallSummary);
}

import { twilioHandleIncomingSms, twilioHandleSmsStatus } from "../providers/twilio/twilio-sms.js";

export default function smsRoutes(app) {
  app.post("/twilio/incoming-sms", twilioHandleIncomingSms);
  app.post("/twilio/sms-status", twilioHandleSmsStatus);
}

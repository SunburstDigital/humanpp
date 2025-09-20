const { twilioHandleIncomingSms, twilioHandleSmsStatus } = require("../providers/twilio/twilio-sms.js");

function smsRoutes(app) {
  app.post("/twilio/incoming-sms", twilioHandleIncomingSms);
  app.post("/twilio/sms-status", twilioHandleSmsStatus);
}

module.exports = smsRoutes;

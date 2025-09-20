const { twilioHandleCallSummary } = require("../providers/twilio/twilio-voice.js");

function summaryRoutes(app) {
  app.post("/calls/summary", twilioHandleCallSummary);
}

module.exports = summaryRoutes;

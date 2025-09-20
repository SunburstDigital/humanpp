const { twilioHandleIncomingCall, twilioStartMediaStream } = require("../providers/twilio/twilio-media.js");

function mediaStreamRoutes(app) {
  app.post("/twilio/incoming-call", twilioHandleIncomingCall);
  app.get("/media-stream", { websocket: true }, twilioStartMediaStream);
}

module.exports = mediaStreamRoutes;

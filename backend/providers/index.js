import * as twillio from './twillio/twilio-sms.js';
// import * as telnyx from './telnyx/telnyx-sms.js'; // Uncomment and adjust when telnyx is ready

// This can be extended to switch all provider modules (sms, voice, media, etc.)
const provider = process.env.PHONE_PROVIDER === 'telnyx' ? {} /* telnyx */ : twillio;

export default provider;

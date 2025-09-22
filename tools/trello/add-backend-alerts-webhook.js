// tools/trello/add-backend-alerts-webhook.js
// Adds the backend alerting/webhook integration card to the Trello Alerts list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_ALERTS = process.env.LIST_ID_ALERTS;

const name = 'Backend Alerting & Webhook Integration';
const desc = `Implement robust alerting and webhook integration for system, AI, and infrastructure issues:\n\n- Build and secure backend webhook endpoint for receiving alert/bug/AI issue posts.\n- Auto-create Trello cards + markdown blocks from webhook POST data (system, AI, infra alerts).\n- Log all webhook requests, errors, and failed deliveries.\n- Test webhook end-to-end: fire a sample alert, confirm in Trello/markdown.\n- Add alert “acknowledged”/“resolved” tracking (manual or via webhook).\n- Document how to send valid alerts to the webhook (for future devs/AI).\n- Monitor for duplicate or spammy alerts and handle gracefully.`;

async function addCard() {
  const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idList: LIST_ID_ALERTS,
      name,
      desc
    })
  });
  if (!res.ok) {
    console.error('Failed to add card:', await res.text());
    process.exit(1);
  }
  const data = await res.json();
  console.log('Added Trello card:', data);
}

addCard();

// tools/trello/add-alerts-backend-webhook.js
// Adds backend webhook and alert management card to the Trello Alerts list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_ALERTS = process.env.LIST_ID_ALERTS;

const name = 'ALERTS — Backend Webhook and Alert Management';
const desc = `- Set up and secure backend webhook endpoint for system, bug, or critical alerts.\n- Ensure incoming alerts are posted to ALERTS list in Trello and mirrored in trello-alerts.md.\n- High-priority/urgent alerts go to top of ALERTS, flagged in markdown.\n- Validate all webhook data; log/reject if incomplete.\n- Track alert acknowledgement/resolution and notify the team.\n- Document alert/webhook usage for all devs and future systems.\n\nAREA: ALERTS\n- Secure backend webhook endpoint\n- Post incoming alerts to Trello/markdown\n- Flag high-priority/urgent alerts\n- Validate/log/reject incomplete webhook data\n- Track acknowledgement/resolution\n- Notify team on alert\n- Document alert/webhook usage`;

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

// tools/trello/add-todo-api-map-card.js
// Adds the Sunburst Voice System – API Map card to the Trello Todo list with checklist

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_TODO = process.env.LIST_ID_TODO;

const card = {
  name: 'Sunburst Voice System – API Map',
  desc: 'Checklist of all Fastify routes and services in the backend.'
};

const checklist = {
  name: 'API Endpoints & Services',
  items: [
    'Health',
    'GET /health → basic health check',
    'SMS',
    'POST /sms → inbound SMS handler',
    'Calls',
    'POST /calls → inbound call webhook',
    'POST /calls/summary → save call summary in Supabase',
    'Logs',
    'GET /logs → fetch call/message logs',
    'POST /logs → write new log entry',
    'Media',
    'POST /media-stream → handle real-time media streams',
    'POST /media-url → accept recording/media URL callbacks',
    'Summary',
    'POST /summary → receive/store AI-generated call summary',
    'Webhooks',
    'POST /webhooks → generic webhook receiver',
    'Services',
    'transcripts.js → manages call transcripts in Supabase, used by summary routes'
  ]
};

async function addCardWithChecklist() {
  // Create the card
  const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idList: LIST_ID_TODO,
      name: card.name,
      desc: card.desc
    })
  });
  if (!res.ok) {
    console.error('Failed to add card:', await res.text());
    process.exit(1);
  }
  const data = await res.json();
  const cardId = data.id;
  // Add the checklist
  const checklistUrl = `https://api.trello.com/1/cards/${cardId}/checklists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const checklistRes = await fetch(checklistUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: checklist.name,
      checkItems: checklist.items
    })
  });
  if (!checklistRes.ok) {
    console.error('Failed to add checklist:', await checklistRes.text());
    process.exit(1);
  }
  console.log('Card and checklist added to Trello Todo list.');
}

addCardWithChecklist();

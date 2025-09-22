// tools/trello/add-backend-backlog-cards.js
// Adds Backend/Infrastructure backlog cards to the Trello Backlog list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_BACKLOG = process.env.LIST_ID_BACKLOG;

const cards = [
  {
    name: 'Build/maintain Fastify API endpoints for voice, messaging, webhook, call summary, calendar, etc.',
    desc: 'Build and maintain Fastify API endpoints for: Voice, Messaging, Webhook, Call summary, Calendar, Other integrations as needed.'
  },
  {
    name: 'Harden backend security (rate limits, auth, validation, CORS).',
    desc: 'Harden backend security by implementing: Rate limiting, Authentication, Input validation, CORS configuration, Security best practices.'
  }
];

async function addCards() {
  for (const card of cards) {
    const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idList: LIST_ID_BACKLOG,
        name: card.name,
        desc: card.desc
      })
    });
    if (!res.ok) {
      console.error('Failed to add card:', await res.text());
      process.exit(1);
    }
    const data = await res.json();
    console.log('Added Trello card:', data);
  }
}

addCards();

// tools/trello/add-backend-backlog-cards-5.js
// Adds next Backend/Infrastructure backlog cards to the Trello Backlog list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_BACKLOG = process.env.LIST_ID_BACKLOG;

const cards = [
  {
    name: 'Logging, error alerting, metrics, monitoring.',
    desc: 'Implement logging, error alerting, metrics, and monitoring for backend systems: Centralized logging, Error alerting, Metrics collection, System monitoring.'
  },
  {
    name: 'Build and deploy client portal MVP (Supabase Auth, dashboard, booking, reporting).',
    desc: 'Build and deploy the client portal MVP with: Supabase Auth, Dashboard, Booking system, Reporting features.'
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

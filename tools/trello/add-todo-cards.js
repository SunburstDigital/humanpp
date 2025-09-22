// tools/trello/add-todo-cards.js
// Adds all TODO items to the Trello TODO list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_TODO = process.env.LIST_ID_TODO;

const cards = [
  {
    name: 'Document webhook endpoints and sample payloads.',
    desc: 'Document webhook endpoints and provide sample payloads: List all webhook endpoints, Show example payloads.'
  },
  {
    name: 'Create Copilot prompt templates for future markdown formatting.',
    desc: 'Create Copilot prompt templates for future markdown formatting: Standardize block formatting, Enable easy reuse.'
  },
  {
    name: 'Make sample/test cards with checklists, comments, attachments.',
    desc: 'Make sample/test cards with: Checklists, Comments, Attachments.'
  },
  {
    name: 'Write VSCode snippet for block creation.',
    desc: 'Write a VSCode snippet for block creation: Canonical markdown block, Easy insertion.'
  },
  {
    name: 'Set up scheduled sync (cron) if not running as a service.',
    desc: 'Set up scheduled sync (cron) if not running as a service: Cron job setup, Ensure regular sync.'
  },
  {
    name: 'Write onboarding/quickstart for new devs/contractors.',
    desc: 'Write onboarding/quickstart for new devs/contractors: Project overview, Setup steps, Key resources.'
  }
];

async function addCards() {
  for (const card of cards) {
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
    console.log('Added Trello card:', data);
  }
}

addCards();

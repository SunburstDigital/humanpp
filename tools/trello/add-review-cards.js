// tools/trello/add-review-cards.js
// Adds all REVIEW items to the Trello Review list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_REVIEW = process.env.LIST_ID_REVIEW;

const cards = [
  {
    name: 'QA full Trello → markdown sync, card moves, deletes, archive flow.',
    desc: 'QA full Trello → markdown sync, including: Card moves, Deletes, Archive flow.'
  },
  {
    name: 'Peer review webhook/sync code for bugs/security/edge cases.',
    desc: 'Peer review webhook/sync code for: Bugs, Security, Edge cases.'
  },
  {
    name: 'Confirm headers and markdown formatting in all mirror files.',
    desc: 'Confirm headers and markdown formatting in all mirror files: Check all file headers, Validate markdown formatting.'
  },
  {
    name: 'Review logs, error reports, and audit trails.',
    desc: 'Review logs, error reports, and audit trails: Analyze logs, Review error reports, Check audit trails.'
  },
  {
    name: 'Get user/team feedback on workflow and formatting.',
    desc: 'Get user/team feedback on workflow and formatting: Collect feedback, Review suggestions, Plan improvements.'
  }
];

async function addCards() {
  for (const card of cards) {
    const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idList: LIST_ID_REVIEW,
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

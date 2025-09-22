// tools/trello/add-inprogress-cards-1.js
// Adds the first four IN PROGRESS items to the Trello In Progress list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_INPROGRESS = process.env.LIST_ID_INPROGRESS;

const cards = [
  {
    name: 'Implement polling/debounce for sync script (2min idle).',
    desc: 'Implement polling and debounce logic for the Trello-to-markdown sync script: 2min idle debounce, Efficient polling.'
  },
  {
    name: 'Test Trello-to-markdown mirroring with live cards in every column.',
    desc: 'Test Trello-to-markdown mirroring with live cards in every column: Validate sync for all columns, Confirm block formatting.'
  },
  {
    name: 'Render checklists/comments into markdown blocks.',
    desc: 'Render Trello checklists and comments into markdown blocks: Checklist formatting, Comment threading.'
  },
  {
    name: 'Debug edge cases: duplicate cards, network errors, permission issues.',
    desc: 'Debug edge cases for Trello-to-markdown sync: Duplicate cards, Network errors, Permission issues.'
  }
];

async function addCards() {
  for (const card of cards) {
    const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idList: LIST_ID_INPROGRESS,
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

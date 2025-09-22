// tools/trello/add-trello-sync-review.js
// Adds the Trello sync & webhook QA/review card to the Trello Review list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_REVIEW = process.env.LIST_ID_REVIEW;

const name = 'Trello Sync & Webhook QA/Review';
const desc = `Quality assurance and peer review for Trello-to-markdown sync and webhook integration:\n\n- QA full Trello → .md sync, card moves, deletes, and archive flow.\n- Peer review of webhook and sync scripts for security, edge cases, and error handling.\n- Check all mirror file headers and canonical formatting.\n- Test and review logging/audit trail output for all scripts.\n- Manual “fuzz test”: try weird data/cards in Trello, confirm .md output stays perfect.\n- Get feedback from team on workflow, format, and file locations.`;

async function addCard() {
  const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idList: LIST_ID_REVIEW,
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

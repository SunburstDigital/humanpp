// tools/trello/add-blocked-cards.js
// Adds all BLOCKED items to the Trello Blocked list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_BLOCKED = process.env.LIST_ID_BLOCKED;

const cards = [
  {
    name: 'Resolve Trello API rate limits, errors, or permission issues.',
    desc: 'Resolve Trello API rate limits, errors, or permission issues: Investigate API limits, Handle error responses, Address permission problems.'
  },
  {
    name: 'Handle “orphaned” cards (in Trello, not markdown, or vice versa).',
    desc: 'Handle “orphaned” cards (in Trello, not markdown, or vice versa): Detect orphaned cards, Sync or archive as needed.'
  },
  {
    name: 'Fix merge conflicts for markdown files if multi-dev.',
    desc: 'Fix merge conflicts for markdown files if multi-dev: Detect and resolve conflicts, Add merge conflict handling logic.'
  },
  {
    name: 'Solve long/malformed card names or weird content.',
    desc: 'Solve long/malformed card names or weird content: Detect malformed names/content, Add validation and sanitization.'
  },
  {
    name: 'Deal with rapid card moves during debounce window.',
    desc: 'Deal with rapid card moves during debounce window: Track card moves, Prevent sync errors.'
  },
  {
    name: 'Sort any permissions errors on file/folder writes.',
    desc: 'Sort any permissions errors on file/folder writes: Detect file/folder permission errors, Add error handling and recovery.'
  }
];

async function addCards() {
  for (const card of cards) {
    const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idList: LIST_ID_BLOCKED,
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

// tools/trello/add-trello-sync-blocked.js
// Adds the Trello sync blockers & edge cases card to the Trello Blocked list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_BLOCKED = process.env.LIST_ID_BLOCKED;

const name = 'Trello Sync Blockers & Edge Cases';
const desc = `Resolve the following blockers and edge cases for Trello-to-markdown sync:\n\n- Sort out Trello API rate limits or failures (handle gracefully, log, retry).\n- Deal with “orphaned” cards (in Trello, but no .md, or vice versa).\n- Fix any permissions errors on file/folder writes.\n- Decide how to handle markdown file merge conflicts (multiple devs editing at once).\n- Handle long card names/descriptions that could break format or line width.\n- Resolve cases where cards are rapidly moved between columns (debounce collision).`;

async function addCard() {
  const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idList: LIST_ID_BLOCKED,
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

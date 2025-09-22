// tools/trello/add-trello-sync-inprogress.js
// Adds the Trello sync script core implementation card to the Trello In Progress list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_INPROGRESS = process.env.LIST_ID_INPROGRESS;

const name = 'Trello Sync Script Core Implementation';
const desc = `Implement the core Trello-to-markdown sync script:\n\n- Write sync script core: polling, debounce, .env mapping.\n- Add markdown block render function for all card data.\n- Test with real cards in each Trello column and verify block format in each .md.\n- Debug and log edge cases (e.g. duplicate cards, network drop, file write error).\n- Add “ask user” logic: pause on ambiguity, prompt via console or email.\n- Verify webhook → ALERTS integration (issue posts go to right file/column).\n- Start implementation of checklist/comment fetching and markdown rendering.\n- Begin auto-archive/copy of DONE cards to archive markdown.\n- Update README and formatting files if format changes during dev.`;

async function addCard() {
  const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idList: LIST_ID_INPROGRESS,
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

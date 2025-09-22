// tools/trello/add-trello-sync-todos.js
// Adds the Trello/sync/dev TODOs & docs card to the Trello To Do list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_TODO = process.env.LIST_ID_TODO;

const name = 'Trello/Sync/Dev TODOs & Docs';
const desc = `Ongoing TODOs and documentation tasks for Trello sync and dev workflow:\n\n- Document the webhook endpoint and expected payloads.\n- Make a Copilot prompt set for future markdown block formatting changes.\n- Create example/test data for all types of issues, comments, checklists.\n- Write VSCode snippet or script for canonical block creation (for manual entry).\n- Set up cron/scheduled task to run sync script if not running as a daemon.\n- Integrate with existing dev tools or PM pipelines as needed.\n- Write a quickstart/one-pager for new contributors.\n- (As you build): add any newly discovered tasks or “TODO”s here.`;

async function addCard() {
  const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idList: LIST_ID_TODO,
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

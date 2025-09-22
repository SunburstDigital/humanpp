// tools/trello/add-trello-mirror-done.js
// Adds the Trello mirror & automation setup complete card to the Trello Done list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_DONE = process.env.LIST_ID_DONE;

const name = 'Trello Mirror & Automation Setup Complete';
const desc = `The following foundational work is complete:\n\n- Trello column structure, mirror file/folder setup, headers, and canonical formatting finalized\n- .env mapping for list IDs and markdown files complete\n- mirror-file-formatting.md written and referenced\n- Folder and script structure agreed and ready for automation\n- All agreed PM and sync standards documented`;

async function addCard() {
  const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idList: LIST_ID_DONE,
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

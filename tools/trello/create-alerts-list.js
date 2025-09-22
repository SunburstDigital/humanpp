// Create a new 'Alerts' list in Trello and print its ID
require('dotenv').config({ path: './infra/.env' });
const fetch = require('node-fetch');

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const BOARD_ID = process.env.BOARD_ID;

if (!TRELLO_KEY || !TRELLO_TOKEN || !BOARD_ID) {
  console.error('Missing Trello config in .env');
  process.exit(1);
}

(async () => {
  const url = `https://api.trello.com/1/boards/${BOARD_ID}/lists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alerts' })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Trello create list error:', res.status, err);
    process.exit(1);
  }
  const data = await res.json();
  console.log('Created Alerts list:', data.name, data.id);
})();

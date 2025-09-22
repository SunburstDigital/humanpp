/**
 * Print all Trello list names and IDs for the configured board.
 * Usage: node tools/trello/get-list-ids.js
 */

require('dotenv').config({ path: './infra/.env' });
const axios = require('axios');

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const BOARD_ID = process.env.BOARD_ID;

if (!TRELLO_KEY || !TRELLO_TOKEN || !BOARD_ID) {
  console.error('Missing Trello config in .env');
  process.exit(1);
}

const apiBase = 'https://api.trello.com/1';

(async () => {
  try {
    const res = await axios.get(`${apiBase}/boards/${BOARD_ID}/lists`, {
      params: { key: TRELLO_KEY, token: TRELLO_TOKEN, fields: 'id,name' }
    });
    console.log('Trello Lists:');
    for (const list of res.data) {
      console.log(`- ${list.name}: ${list.id}`);
    }
  } catch (err) {
    console.error('Error fetching lists:', err.response?.data || err.message);
    process.exit(1);
  }
})();

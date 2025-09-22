// tools/trello/add-backend-api-todo.js
// Adds the backend API TODO as a card to the Trello TO DO list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_TODO = process.env.LIST_ID_TODO;

const name = 'Backend API TODOs (Conversation/Memory)';
const desc = `Implement the following backend features:\n\n- Outbound send route: POST /conversations/:id/send\n- Conversation fetch route: GET /conversations/:id\n- Steps management routes: POST/PATCH /conversations/:id/steps\n- Lifecycle cron jobs for stale/expired conversations\n- Memory and prompt context logic\n- Utility helpers: getActiveConversation, createConversation, appendChunk, addStep, updateStep, deleteGuestExpired\n- Jest tests for all routes and logic`;

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

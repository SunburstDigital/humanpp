// tools/trello/add-inprogress-api-map-card.js
// Adds the Sunburst Voice System – API Map card to the Trello In Progress list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_INPROGRESS = process.env.LIST_ID_INPROGRESS;

const card = {
  name: 'Sunburst Voice System – API Map',
  desc: `### 🗂️ Fastify Endpoints (routes/)
- [ ] **POST /webhooks/:channel/inbound**  
  _Handles inbound webhook events (e.g., Trello, messaging, etc.). Logs payload and returns status._
\n(More endpoints/services can be added here as you expand the map.)`
};

async function addCard() {
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
  if (res.ok) {
    console.log('Card added to Trello In Progress list.');
  } else {
    const err = await res.text();
    console.error('Failed to add card:', err);
  }
}

addCard();

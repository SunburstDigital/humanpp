// tools/trello/add-backend-backlog-cards-4.js
// Adds next Backend/Infrastructure backlog cards to the Trello Backlog list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_BACKLOG = process.env.LIST_ID_BACKLOG;

const cards = [
  {
    name: 'Implement Supabase bucket storage for audio/transcripts.',
    desc: 'Implement Supabase bucket storage for: Audio files, Transcripts, Secure access and retrieval.'
  },
  {
    name: 'Automate DB migration, backup, disaster recovery processes.',
    desc: 'Automate database migration, backup, and disaster recovery processes: Migration scripts, Automated backups, Recovery procedures.'
  }
];

async function addCards() {
  for (const card of cards) {
    const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idList: LIST_ID_BACKLOG,
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

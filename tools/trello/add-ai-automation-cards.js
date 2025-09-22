// tools/trello/add-ai-automation-cards.js
// Adds AI/Automation items as cards to the Trello To Do list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_TODO = process.env.LIST_ID_TODO;

const cards = [
  {
    name: 'AI / AUTOMATION — Develop modular prompt flow builder and versioning',
    desc: 'Develop modular prompt flow builder and versioning for easy updates.\n\nAREA: AI / AUTOMATION\n- Prompt flow builder\n- Versioning logic\n- Documentation'
  },
  {
    name: 'AI / AUTOMATION — Build and QA real-time property matching and lead qualification',
    desc: 'Build and QA real-time property matching and lead qualification (web scraper, AI logic).\n\nAREA: AI / AUTOMATION\n- Real-time property matching\n- Lead qualification\n- Web scraper integration\n- QA'
  },
  {
    name: 'AI / AUTOMATION — Implement voice and chat appointment booking flows',
    desc: 'Implement voice and chat appointment booking flows (reschedule, cancel, reminders).\n\nAREA: AI / AUTOMATION\n- Voice appointment booking\n- Chat appointment booking\n- Reschedule/cancel logic\n- Reminders'
  },
  {
    name: 'AI / AUTOMATION — Develop automated review request logic',
    desc: 'Develop automated review request logic (SMS/email).\n\nAREA: AI / AUTOMATION\n- SMS review requests\n- Email review requests\n- Automation logic'
  },
  {
    name: 'AI / AUTOMATION — Tune AI for compliance with AU/EU/US privacy and anti-hallucination controls',
    desc: 'Tune AI for compliance with AU/EU/US privacy and anti-hallucination controls.\n\nAREA: AI / AUTOMATION\n- AU privacy compliance\n- EU privacy compliance\n- US privacy compliance\n- Anti-hallucination controls'
  },
  {
    name: 'AI / AUTOMATION — Daily automated AI system test bed',
    desc: 'Daily automated AI system test bed: simulate live calls, SMS, orb, reminders.\n\nAREA: AI / AUTOMATION\n- Simulate live calls\n- Simulate SMS\n- Simulate orb\n- Simulate reminders'
  }
];

async function addCards() {
  for (const card of cards) {
    const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idList: LIST_ID_TODO,
        name: card.name,
        desc: card.desc
      })
    });
    if (!res.ok) {
      console.error('Failed to add card:', await res.text());
      process.exit(1);
    }
    const data = await res.json();
    console.log('Added Trello card:', data.name);
  }
}

addCards();

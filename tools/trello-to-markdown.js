// trello-to-markdown.js
// Fetches all lists and cards from a Trello board and outputs as Markdown
// Usage: node tools/trello-to-markdown.js

require('dotenv').config({ path: './infra/.env' });
const fs = require('fs');
const axios = require('axios');

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const BOARD_ID = process.env.BOARD_ID;

if (!TRELLO_KEY || !TRELLO_TOKEN || !BOARD_ID) {
  console.error('Missing Trello config in .env');
  process.exit(1);
}

const apiBase = 'https://api.trello.com/1';

async function fetchListsAndCards() {
  // Get all lists on the board
  const listsRes = await axios.get(`${apiBase}/boards/${BOARD_ID}/lists`, {
    params: { key: TRELLO_KEY, token: TRELLO_TOKEN, cards: 'open' }
  });
  const lists = listsRes.data;

  // For each list, fetch its cards
  for (const list of lists) {
    const cardsRes = await axios.get(`${apiBase}/lists/${list.id}/cards`, {
      params: { key: TRELLO_KEY, token: TRELLO_TOKEN }
    });
    list.cards = cardsRes.data;
  }
  return lists;
}

function listsToMarkdown(lists) {
  let md = `# Trello Board: ${BOARD_ID}\n\n`;
  for (const list of lists) {
    md += `## ${list.name}\n`;
    if (list.cards.length === 0) {
      md += '_No cards_\n\n';
      continue;
    }
    for (const card of list.cards) {
      md += `- **${card.name}**`;
      if (card.desc) md += `\n  - ${card.desc.replace(/\n/g, '\n    ')}`;
      md += '\n';
    }
    md += '\n';
  }
  return md;
}

(async () => {
  try {
    const lists = await fetchListsAndCards();
    const md = listsToMarkdown(lists);
    fs.writeFileSync('trello-board.md', md, 'utf8');
    console.log('Markdown file written: trello-board.md');
  } catch (err) {
    console.error('Error fetching Trello board:', err.message);
    process.exit(1);
  }
})();

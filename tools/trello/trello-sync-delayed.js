// Sunburst Digital AI: Trello-to-Markdown Sync Script (Delayed Mirror)
// See mirror-file-formatting.md for canonical formatting rules.

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config({ path: path.resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const DEBOUNCE_MS = 2 * 60 * 1000; // 2 minutes

function getListFileMappings() {
  const mappings = {};
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('LIST_ID_')) {
      const listKey = key.replace('LIST_ID_', '');
      const fileVar = 'FILE_' + listKey;
      if (process.env[fileVar]) {
        mappings[process.env[key]] = process.env[fileVar];
      }
    }
  });
  return mappings;
}

const mappings = getListFileMappings();
let debounceTimeout = null;
let lastTrelloState = {};


async function fetchTrelloCards(listId) {
  const url = `https://api.trello.com/1/lists/${listId}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&fields=name,desc,id,labels,idList,dateLastActivity&attachments=true&customFieldItems=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Trello fetch error: ${res.status}`);
  return await res.json();
}

async function fetchChecklists(cardId) {
  const url = `https://api.trello.com/1/cards/${cardId}/checklists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return await res.json();
}

async function fetchComments(cardId) {
  const url = `https://api.trello.com/1/cards/${cardId}/actions?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&filter=commentCard`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return await res.json();
}

async function cardToMarkdownBlock(card, listName) {
  // Fetch checklists and comments
  const [checklists, comments] = await Promise.all([
    fetchChecklists(card.id),
    fetchComments(card.id)
  ]);

  // Format checklists
  let checklistSection = '';
  if (checklists.length > 0) {
    checklistSection = checklists.map(cl =>
      cl.checkItems.map(item => `- [${item.state === 'complete' ? 'x' : ' '}] ${item.name}`).join('\n')
    ).join('\n');
  }
  // If no checklist, leave blank
  if (!checklistSection) checklistSection = '';

  // Format comments
  let commentsSection = '';
  if (comments.length > 0) {
    commentsSection = comments.map(c => {
      const date = c.date ? c.date.slice(0, 10) : '';
      const member = c.memberCreator && c.memberCreator.fullName ? c.memberCreator.fullName : (c.memberCreator && c.memberCreator.username ? c.memberCreator.username : '');
      return `- *${date} ${member}*: ${c.data && c.data.text ? c.data.text : ''}`;
    }).join('\n');
  }
  if (!commentsSection) commentsSection = '';

  return `\n===============================START========================================\n## ISSUE: ${card.name}\n==========================================================================\n- **Card ID:** ${card.id}\n- **Created:** ${card.dateLastActivity ? card.dateLastActivity.slice(0, 10) : ''}\n- **Status:** ${listName}\n### DESCRIPTION\n${card.desc || ''}\n### CHECKLIST\n${checklistSection}\n### COMMENTS\n${commentsSection}\n===============================END==========================================`;
}

function getListTitleFromFile(filePath) {
  // Extracts the list title from the file name, e.g. trello-in-progress.md -> IN PROGRESS
  return filePath.replace(/^trello-/, '').replace(/\.md$/, '').replace(/-/g, ' ').toUpperCase();
}

async function updateMarkdownFile(filePath, listTitle, cards, listName) {
  let header = `${'='.repeat(listTitle.length + 20)}\n${listTitle}\n*Trello Mirror — please see mirror-file-formatting.md in this folder for full formatting guidelines for each issue*\n${'='.repeat(listTitle.length + 20)}\n\n\n`;
  let body = '';
  for (const card of cards) {
    body += await cardToMarkdownBlock(card, listName) + '\n\n\n';
  }
  fs.writeFileSync(path.join(__dirname, 'trello-lists', filePath), header + (body ? body : ''), 'utf8');
}

async function syncTrelloToMarkdown() {
  for (const [listId, filePath] of Object.entries(mappings)) {
    const cards = await fetchTrelloCards(listId);
    const listTitle = getListTitleFromFile(filePath);
    await updateMarkdownFile(filePath, listTitle, cards, listTitle);
  }
  // TODO: If any card cannot be matched, prompt the user (console log/warning)
}

function onTrelloActivity() {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    console.log('No Trello activity for 2 minutes — updating markdown mirror...');
    syncTrelloToMarkdown().catch(console.error);
  }, DEBOUNCE_MS);
}

// Example polling (replace with webhook if available)
async function pollTrello() {
  // For demo: always call onTrelloActivity (in real use, compare state)
  onTrelloActivity();
}

// Start polling every 30 seconds
setInterval(pollTrello, 30 * 1000);

console.log('Trello-to-Markdown sync script running. Will sync after 2 minutes of inactivity.');

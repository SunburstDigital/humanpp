// tools/trello/add-trello-sync-backlog.js
// Adds the Trello-to-markdown sync & utilities backlog card to the Trello Backlog list

const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../infra/.env') });

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_BACKLOG = process.env.LIST_ID_BACKLOG;

const name = 'Trello-to-Markdown Sync & Utilities';
const desc = `Build and enhance the Trello-to-markdown sync system:\n\n- Full sync script with 2min idle debounce, .env mapping, block format, ask-if-unsure.\n- Support all list files, including ALERTS, BACKLOG, IN PROGRESS, BLOCKED, REVIEW, TODO, DONE, etc.\n- Render checklists, comments, attachments from Trello API.\n- Handle card moves (list changes in Trello → move blocks in .md), deletes, edits, label/field updates.\n- Utility to update .env mapping when new columns/files are added.\n- Option: one-time migration script to backfill existing Trello cards into markdown.\n- Automated tests for all sync features.\n- Logging for sync script (timestamp, actions, errors, dry run).\n- Process for restoring .md from Trello, and vice versa.\n- Dev onboarding/usage guide for new team members.\n- Scripts to easily create/delete Trello columns + matching .md files.`;

async function addCard() {
  const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idList: LIST_ID_BACKLOG,
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

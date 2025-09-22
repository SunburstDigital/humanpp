/**
 * Test script for Trello sync setup
 *
 * This script checks that the Trello sync script and board mirror file are accessible and working.
 * It does NOT modify any data—just verifies file presence and basic read access.
 */

const fs = require('fs');
const path = require('path');

const mirrorPath = path.join(__dirname, 'trello-board-mirror.md');
const syncScriptPath = path.join(__dirname, 'trello-markdown.js');

function checkFile(filePath, label) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    console.log(`✅ ${label} found and readable: ${filePath}`);
  } catch (err) {
    console.error(`❌ ${label} missing or not readable: ${filePath}`);
    process.exit(1);
  }
}

console.log('--- Trello Sync Test ---');
checkFile(mirrorPath, 'Board Mirror Markdown');
checkFile(syncScriptPath, 'Sync Script');

// --- Trello API Connectivity Test ---
require('dotenv').config({ path: path.resolve(__dirname, '../../infra/.env') });
const axios = require('axios');

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const BOARD_ID = process.env.BOARD_ID;

if (!TRELLO_KEY || !TRELLO_TOKEN || !BOARD_ID) {
  console.error('❌ Missing Trello config in .env');
  process.exit(1);
}

const apiBase = 'https://api.trello.com/1';

async function checkTrelloAPI() {
  try {
    const res = await axios.get(`${apiBase}/boards/${BOARD_ID}`, {
      params: { key: TRELLO_KEY, token: TRELLO_TOKEN, fields: 'name' }
    });
    console.log(`✅ Trello API access OK. Board name: ${res.data.name}`);
  } catch (err) {
    console.error('❌ Trello API access failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

checkTrelloAPI();

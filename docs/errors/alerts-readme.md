# Alerts Integration for System Faults

This document describes how the backend system uses Trello Alerts for error and fault notification.

## Trello Alerts List
- **List ID:** 68d10824c6db5c7e70692b8f
- **Purpose:** All critical system faults, automated alerts, and urgent issues are posted as cards to this list.

## How Alerts Are Created
When the backend detects a fault (e.g., failed job, critical error, or automation trigger), it creates a new card in the Trello Alerts list using the Trello API:

**Endpoint:**
```
POST https://api.trello.com/1/cards
```
**Parameters:**
- `idList`: 68d10824c6db5c7e70692b8f (Alerts list)
- `name`: Alert title
- `desc`: Detailed error or alert description
- `key`: Trello API key
- `token`: Trello API token

## Example Usage
When a system error is detected:
1. The backend POSTs to the Trello API with the error details.
2. A new card appears in the Alerts list for immediate review.
3. The alert is mirrored in the markdown file `trello-alerts.md` for audit and backup.

## Example Code Snippet
```js
const fetch = require('node-fetch');
const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const LIST_ID_ALERTS = process.env.LIST_ID_ALERTS;

async function postAlertToTrello(name, desc) {
  const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idList: LIST_ID_ALERTS, name, desc })
  });
}
```

## Markdown Mirror
All alerts are also written to `tools/trello/trello-lists/trello-alerts.md` for backup and compliance.

---

For more details, see the main Trello integration documentation.

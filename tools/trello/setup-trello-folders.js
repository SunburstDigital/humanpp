/**
 * Sunburst Digital AI — Trello Folder & File Setup Script
 *
 * - Creates the /tools/trello/ folder and an archive subfolder
 * - For each Trello column, creates a .md file with:
 *   - Page title matching the column
 *   - A comment block at the top specifying:
 *     - Column name (exactly as in Trello)
 *     - List ID (to be filled in by user)
 *     - Markdown file path (to be added in .env)
 *     - Description of purpose (mirrors Trello column)
 *     - Key formatting rules (as agreed)
 * - Creates README.md in /tools/trello/ with a full formatting example and usage instructions
 *
 * NOTE: When updating .env, always add both the LIST_ID and the corresponding markdown file path:
 *   LIST_ID_BACKLOG=xxxxxxxx
 *   FILE_BACKLOG=backlog.md
 */

const fs = require('fs');
const path = require('path');

// Define your columns and file names as [Column, File]
const columns = [
  ['Ideas & Research', 'ideas-and-research.md'],
  ['Specs & Drafts', 'specs-and-drafts.md'],
  ['Backlog', 'backlog.md'],
  ['Ready', 'ready.md'],
  ['To Do', 'todo.md'],
  ['In Progress', 'in-progress.md'],
  ['Review', 'review.md'],
  ['Document', 'document.md'],
  ['Blocked', 'blocked.md'],
  ['Done', 'done.md'],
];

// Folders
const baseDir = path.join('tools', 'trello');
const archiveDir = path.join(baseDir, 'archive');

// Ensure folders exist
fs.mkdirSync(baseDir, { recursive: true });
fs.mkdirSync(archiveDir, { recursive: true });

// Canonical comment block
function getCommentBlock(column, filename) {
  return `<!--
  COLUMN: ${column}
  FILE: ${filename}
  PURPOSE: Mirrors the "${column}" column in Trello. All cards/issues from this column will appear here in strict project formatting.
  FORMATTING RULES:
    - Each card/issue must be boxed by START and END separators as shown in the README.
    - Card content must be kept between matching separators.
    - Never add blank lines inside a card block; always leave two blank lines between card blocks.
    - Card title and column name must match Trello exactly.
    - When moving cards between files, copy the entire block from START to END, inclusive.
  MAPPING:
    - Add both LIST_ID and FILE path to your .env file for scripts to auto-map.
      Example:
        LIST_ID_INPROGRESS=xxxxxxxxx
        FILE_INPROGRESS=in-progress.md
  -->\n\n# ${column}\n\n`;
}

// Create files with comment block and page title
columns.forEach(([column, filename]) => {
  const filePath = path.join(baseDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, getCommentBlock(column, filename));
    console.log('Created:', filePath);
  } else {
    console.log('Already exists:', filePath);
  }
});

// Create archive file
const archiveFile = path.join(archiveDir, 'done-archive.md');
if (!fs.existsSync(archiveFile)) {
  fs.writeFileSync(
    archiveFile,
    `<!--
  ARCHIVE: All completed/Done cards, full history.
  Cards moved here are not removed from Trello; this is a backup and audit record only.
  Follows exact card formatting as all project files.
  -->\n\n# Done Archive\n\n`
  );
  console.log('Created:', archiveFile);
} else {
  console.log('Already exists:', archiveFile);
}

// Create README.md with example block
const readmePath = path.join(baseDir, 'README.md');
const exampleBlock = `
===============================START========================================
## ISSUE: Example Card Title
==========================================================================
- **Card ID:** 62adf234f... (Trello Card ID)
- **Created:** 2025-09-23 by Dave
- **Assigned:** Dave / Copilot
- **Status:** In Progress
### DESCRIPTION
This is a description of the task or card.
### CHECKLIST
- [x] Example task complete
- [ ] Example task not complete
### COMMENTS
- *2025-09-24 Copilot*: Comment goes here.
===============================END==========================================

(two blank lines between card blocks)
`;

fs.writeFileSync(
  readmePath,
  `# Sunburst Digital AI Trello Markdown Structure

This folder mirrors your Trello board columns for the Sunburst Digital AI project.  
Each file represents a Trello column and follows strict formatting for script and AI compatibility.

## Card Formatting Rules

- Every card/issue must be enclosed by matching START and END separator lines.
- Card content (description, checklist, comments) must be inside the block, with no extra blank lines inside.
- Always leave **two blank lines** between card blocks.
- Card titles and column names must match Trello exactly.
- When moving cards between files, copy the full block from START to END (inclusive).
- Each .md file begins with a comment block that matches its column and filename.
- Update your .env file for each Trello LIST_ID and corresponding markdown FILE.

## Example Card Block

${exampleBlock}


## .env Example

  LIST_ID_INPROGRESS=xxxxxxxxx
  FILE_INPROGRESS=in-progress.md


## Archive

- The archive/done-archive.md file stores full details for all completed cards.
- The done.md file contains only summary titles/dates for scan-ability.

`
);

console.log('README created:', readmePath);

console.log('\nAll folders and files have been created and initialized per Sunburst Digital AI project conventions.\n');

// 🟩 NOTES/INSTRUCTIONS FOR HUMANS & COPILOT:
//
// Run this script before the mirroring/sync script.
//
// When updating .env, always add both the Trello List ID and the Markdown file path:
//
// LIST_ID_BACKLOG=xxxxxxxx
// FILE_BACKLOG=backlog.md
//
// Each markdown file starts with a comment block explaining the mapping, formatting, and usage.
//
// See /tools/trello/README.md for the canonical formatting rules and a full card block example.
//
// Delay logic for sync scripts will be added later (e.g., using a debounce/timer before syncing updates).

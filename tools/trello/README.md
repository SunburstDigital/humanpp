# Sunburst Digital AI Trello Markdown Structure

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



## .env Example

  LIST_ID_INPROGRESS=xxxxxxxxx
  FILE_INPROGRESS=in-progress.md


## Archive

- The archive/done-archive.md file stores full details for all completed cards.
- The done.md file contains only summary titles/dates for scan-ability.


# ...existing code...
==============================================================================
BLOCKED
*Trello Mirror — please see mirror-file-formatting.md in this folder for full formatting guidelines for each issue*
==============================================================================
===============================START========================================
## ISSUE: Trello Sync Blockers & Edge Cases
========================================================================
- **Card ID:** trello-sync-blocked
- **Created:** 2025-09-22
- **Status:** BLOCKED
### DESCRIPTION
Resolve the following blockers and edge cases for Trello-to-markdown sync:
- Sort out Trello API rate limits or failures (handle gracefully, log, retry).
- Deal with “orphaned” cards (in Trello, but no .md, or vice versa).
- Fix any permissions errors on file/folder writes.
- Decide how to handle markdown file merge conflicts (multiple devs editing at once).
- Handle long card names/descriptions that could break format or line width.
- Resolve cases where cards are rapidly moved between columns (debounce collision).
### CHECKLIST
- [ ] Handle Trello API rate limits/failures
- [ ] Orphaned card detection/resolution
- [ ] File/folder permissions errors
- [ ] Markdown merge conflict strategy
- [ ] Long card name/desc handling
- [ ] Rapid card move debounce/collision
### COMMENTS
- *2025-09-22 Copilot*: Added Trello sync blockers and edge cases from project plan.
===============================END==========================================
## ISSUE: Resolve Trello API rate limits, errors, or permission issues.
========================================================================
- **Card ID:** trello-api-blocked
- **Created:** 2025-09-22
- **Status:** BLOCKED
### DESCRIPTION
Resolve Trello API rate limits, errors, or permission issues:
- Investigate API limits
- Handle error responses
- Address permission problems
### CHECKLIST
- [ ] Identify rate limit scenarios
- [ ] Add error handling logic
- [ ] Request higher API quota if needed
- [ ] Document solutions
### COMMENTS
- *2025-09-22 Copilot*: Added Trello API rate limits/issues item from project plan.
===============================END==========================================
## ISSUE: Handle “orphaned” cards (in Trello, not markdown, or vice versa).
========================================================================
- **Card ID:** orphaned-cards-blocked
- **Created:** 2025-09-22
- **Status:** BLOCKED
### DESCRIPTION
Handle “orphaned” cards (in Trello, not markdown, or vice versa):
- Detect orphaned cards
- Sync or archive as needed
### CHECKLIST
- [ ] Detect orphaned cards
- [ ] Sync or archive orphans
- [ ] Document orphan handling
### COMMENTS
- *2025-09-22 Copilot*: Added orphaned cards item from project plan.
===============================END==========================================
## ISSUE: Fix merge conflicts for markdown files if multi-dev.
========================================================================
- **Card ID:** merge-conflicts-blocked
- **Created:** 2025-09-22
- **Status:** BLOCKED
### DESCRIPTION
Fix merge conflicts for markdown files if multi-dev:
- Detect and resolve conflicts
- Add merge conflict handling logic
### CHECKLIST
- [ ] Detect merge conflicts
- [ ] Add conflict resolution logic
- [ ] Document merge process
### COMMENTS
- *2025-09-22 Copilot*: Added merge conflicts item from project plan.
===============================END==========================================
## ISSUE: Solve long/malformed card names or weird content.
========================================================================
- **Card ID:** malformed-cards-blocked
- **Created:** 2025-09-22
- **Status:** BLOCKED
### DESCRIPTION
Solve long/malformed card names or weird content:
- Detect malformed names/content
- Add validation and sanitization
### CHECKLIST
- [ ] Detect malformed card names/content
- [ ] Add validation/sanitization logic
- [ ] Document edge cases
### COMMENTS
- *2025-09-22 Copilot*: Added malformed card names/content item from project plan.
===============================END==========================================
## ISSUE: Deal with rapid card moves during debounce window.
========================================================================
- **Card ID:** rapid-moves-blocked
- **Created:** 2025-09-22
- **Status:** BLOCKED
### DESCRIPTION
Deal with rapid card moves during debounce window:
- Track card moves
- Prevent sync errors
### CHECKLIST
- [ ] Track rapid card moves
- [ ] Add debounce logic for moves
- [ ] Test for sync errors
### COMMENTS
- *2025-09-22 Copilot*: Added rapid card moves item from project plan.
===============================END==========================================
## ISSUE: Sort any permissions errors on file/folder writes.
========================================================================
- **Card ID:** file-permissions-blocked
- **Created:** 2025-09-22
- **Status:** BLOCKED
### DESCRIPTION
Sort any permissions errors on file/folder writes:
- Detect file/folder permission errors
- Add error handling and recovery
### CHECKLIST
- [ ] Detect file/folder permission errors
- [ ] Add error handling/recovery
- [ ] Document solutions
### COMMENTS
- *2025-09-22 Copilot*: Added file/folder permissions item from project plan.
===============================END==========================================
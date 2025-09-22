# Trello Mirror File Formatting Rules

All Trello mirror markdown files must format every issue/card as shown below.

---

## Card Block Format

- Every issue/card is boxed by a START and END separator line.
- No blank lines inside a card block.
- Exactly two blank lines between card blocks.
- Card title and column name must match Trello exactly (case and wording).
- When moving a card, always copy the full block from START to END (inclusive).
- Never merge, split, or break up a card block.
- Do not add or remove content outside a block.

---

## Canonical Card Block Example

```markdown
===============================START========================================
## ISSUE: Example Card Title
==========================================================================
- **Card ID:** 123456789abcdef
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


===============================START========================================
## ISSUE: Another Card Title
==========================================================================
- **Card ID:** 987654321fedcba
- **Created:** 2025-09-24 by Copilot
- **Assigned:** Dave
- **Status:** Blocked
### DESCRIPTION
Blocked on API rate limits.
### CHECKLIST
- [ ] Wait for new quota
### COMMENTS
- *2025-09-25 Dave*: Checking with provider.
===============================END==========================================


(two blank lines between blocks, as above)
```

.env Mapping Example
LIST_ID_INPROGRESS=xxxxxxxxx
FILE_INPROGRESS=trello-lists/trello-in-progress.md

Archive

All completed cards' full blocks must also be appended to trello-lists/archive/trello-done-archive.md.

trello-done.md contains only summary lines (title + date) for fast reference.

Automation/Script Note

All scripts, Copilot, and team members must follow these rules exactly.

Never leave content outside a START/END block.

Never merge, split, or lose a card block.

All formatting, spacing, and separator lines must be strictly followed.

---

## 🟦 **Summary:**

- **Mirror file**: Title, italics ref, no rules, then blocks.
- **Formatting rules**: All bullets, block examples, mapping ONLY in `mirror-file-formatting.md`.

---

This is the **one true way**.

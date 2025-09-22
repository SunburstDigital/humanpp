📋 SUNBURST AI TASK SYNC POLICY

MANDATORY: Every Trello board change and every update to /docs/todo.md must be kept in sync.
This ensures a single source of truth for all work-in-progress, helps Copilot, and prevents lost/duplicated tasks.

Task Workflow (For Everyone, Including Copilot & Human Coders)

Starting a Task:

Move the card from Backlog (or relevant column) → Doing in Trello.

Immediately update /docs/todo.md by moving the matching line to the Doing section (or mark as IN PROGRESS).

Working on a Task:

All meaningful updates (description changes, new subtasks, blockers) must be reflected in both Trello (card description/comments) AND in /docs/todo.md (as sub-bullets or notes).

No silent work—all progress must be visible in both places.

Finishing a Task:

Move the card to Done (or the final/Completed column) in Trello.

Immediately mark the task as DONE in /docs/todo.md (move to Done/Completed section, or [x] checkbox).

Partial/Blocked Tasks:

If a task is started but not finished, mark as BLOCKED or PENDING in both Trello and .md (add a comment/reason).

Running the Sync Script:

After any manual change (by you or Copilot) to either the Trello board or /docs/todo.md, always run the sync-trello.js script (or your equivalent) to bring both into perfect alignment.

NEVER let Trello and the .md get out of sync by more than a single work session.

Merge Conflicts/Disagreements:

If the .md and Trello board are out of sync, reconcile by:

Preferencing the most recent timestamp, or

Confirming with the team (or you, as PM/owner) which is authoritative for that session.

Copilot/AI Instructions:

Copilot and all AI tools must follow this workflow—any task script, commit, or PR must show changes in both the Trello board and /docs/todo.md.

If Copilot completes or updates a task, it must move the card and update the .md before pushing code or merging.

Sample Markdown Format:
# 🔄 TASK BOARD SYNCED WITH TRELLO

## BACKLOG
- [ ] Build Fastify endpoint for /media-stream
- [ ] Trello sync logic v2

## DOING
- [ ] Client onboarding script (IN PROGRESS)  
  - Started: 2025-09-22  
  - Assigned: Dave / Copilot

## BLOCKED
- [ ] Supabase audio upload (PENDING: API quota)

## DONE
- [x] Project skeleton deployed to Fly.io
- [x] Supabase tables migrated

Summary:

🚨 No task is “done” until both Trello and /docs/todo.md reflect the same status.
All contributors (AI + human) must run the sync script after changes and double-check for alignment.

Paste this at the top of your /docs/todo.md and (optionally) as README-copilot-sync.md.
Let me know if you want an automated status badge or GitHub Actions workflow to enforce this as well!

# System Fault Handling: Trello Alerts Workflow

When the system detects a fault or critical error, it performs the following steps:

1. **Detect Fault:**
   - The backend identifies a failure (e.g., job error, automation failure, or critical exception).

2. **Create Trello Alert:**
   - The backend creates a new card in the Trello Alerts list using the API (see `alerts-readme.md`).
   - The card includes a clear title and a detailed description of the fault.

3. **Mirror to Markdown:**
   - The alert is also written to `tools/trello/trello-lists/trello-alerts.md` for backup, compliance, and audit.

4. **Notification/Review:**
   - Team members review the Alerts list in Trello and the markdown mirror to triage and resolve the issue.

## Example Fault Flow

- **Fault:** Database connection failure detected.
- **Action:**
  - Create Trello card: "Database Connection Failure" with error details.
  - Append the same alert to `trello-alerts.md`.
- **Result:**
  - Alert is visible in both Trello and the repo for immediate action and historical tracking.

---

For API usage and integration details, see `alerts-readme.md` in this folder.

# Copilot Operating Instructions

## ALWAYS READ `/BIG-PICTURE.md` FIRST!

- **Before starting any task or writing any code, always open and read `/BIG-PICTURE.md` at the project root.**
    - This file contains the current project vision, goals, and context for this sprint or build session.
    - Use it to understand *what* we are trying to achieve today/this week, and the bigger context for your task.

- **After reading `/BIG-PICTURE.md`, follow the step-by-step instructions below.**
    - The rest of this file (`/copilot-prompt.md`) contains the current, tactical instructions and tasks to complete in this session.
    - Only work on what is listed below, unless the Project Manager updates the instructions.

---
=========================================================================================================
## Current Copilot Task START
=========================================================================================================
## Follow-Up Task: Complete Industry Tool Folders and Stubs

> **You must create the following missing subfolders in `/modular-prompt-tools/tools/`—even if they don’t exist yet:**
> - `hospitality`
> - `real-estate`
> - `plumbing`
> - `roofing`
> - `brokers`
> - `sunburst`

> **Inside each folder, create the following stub files:**  
> _(Each file must export an async function with JSDoc, `params` as only arg, and a TODO. Only include tools unique to that industry—do NOT duplicate generic tools.)_

---

### `/hospitality/`
- bookTable.js
- checkReservation.js
- sendMenuInfo.js

### `/real-estate/`
- searchListings.js
- bookPropertyViewing.js
- qualifyBuyer.js

### `/plumbing/`
- bookJob.js
- emergencyCallout.js
- quoteJob.js

### `/roofing/`
- bookRoofInspection.js
- quoteRoofRepair.js
- scheduleRoofWork.js

### `/brokers/`
- qualifyFinanceLead.js
- checkLoanStatus.js
- uploadKYC.js

### `/sunburst/`
- createDemoLead.js
- demoBooking.js
- sendDemoInfo.js

---

> **Instructions:**
> 1. Do NOT copy any generic tools into these industry folders.
> 2. Each stub must include a JSDoc with: what it does, when to call, param structure, expected result, and a TODO.
> 3. All folders must be at the same directory level as `/generic/` (see screenshot for reference).
> 4. Notify PM when done.

---

**Sample stub:**  
```js
/**
 * Book a table at a restaurant.
 * Params: { name, phone, partySize, date, time, specialRequest }
 * Returns: { ok: true, data } or { ok: false, error }
 * Only used in hospitality flows.
 */
module.exports = async function bookTable(params) {
    // TODO: Implement table booking logic
    return { ok: false, error: 'Not implemented yet' };
};


=========================================================================================================
## Current Copilot Task END
=========================================================================================================

# Example Workflow

1. Open `/BIG-PICTURE.md` — confirm current project goals.
2. Read the step-by-step tasks above between the Current Copilot Task START & Current Copilot Task END blocks.
3. Complete each task in order.
4. When finished, notify the Project Manager for review and new instructions.

---

_Last updated: 2025-09-19_

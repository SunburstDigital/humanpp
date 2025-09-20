// ============================================================================
// START File services/session-notes.js
// ============================================================================
// Purpose: Keep tiny rolling notes per callId. Append small bullets as the
// convo progresses (e.g., after tool calls). Render into instructions.
// ============================================================================

const store = new Map(); // callId -> string[]

function sessionNotesStart(callId) {
  if (!store.has(callId)) store.set(callId, []);
}

function sessionNotesAdd(callId, bullet) {
  const arr = store.get(callId) || [];
  if (!bullet) return;
  // Keep last 6 bullets max (tiny rolling memory)
  const next = [...arr, `• ${bullet}`].slice(-6);
  store.set(callId, next);
}

function sessionNotesString(callId) {
  const arr = store.get(callId) || [];
  if (!arr.length) return "";
  return `\n### Session Notes\n${arr.join("\n")}\n`;
}

function sessionNotesEnd(callId) {
  store.delete(callId);
}

module.exports = {
  sessionNotesStart,
  sessionNotesAdd,
  sessionNotesString,
  sessionNotesEnd
};
// ============================================================================
// END File services/session-notes.js
// ============================================================================

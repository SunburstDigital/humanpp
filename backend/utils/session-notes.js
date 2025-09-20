// ======================================================================================
// Session Notes Utils
// Purpose: Track per-call session notes and safe XML escaping
// ======================================================================================
const _notes = new Map();

function notesStart(id) { _notes.set(id, []); }
function notesAdd(id, s) {
  const arr = _notes.get(id) || [];
  arr.push(typeof s === "string" ? s : JSON.stringify(s));
  _notes.set(id, arr.slice(-6));
}
function notesStr(id) {
  const arr = _notes.get(id) || [];
  return arr.length ? `\n\n[session_notes]\n- ${arr.join("\n- ")}\n` : "";
}
function notesEnd(id) { _notes.delete(id); }

function escapeXml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/\'/g, "&apos;");
}

module.exports = { notesStart, notesAdd, notesStr, notesEnd, escapeXml };

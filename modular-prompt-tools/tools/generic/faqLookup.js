/**
 * Lookup an FAQ answer for a contact or staff.
 * Used by any vertical to provide quick answers to common questions.
 * Params: { question, contactId, ... }
 * Returns: { ok: true, data } or { ok: false, error }
 * Imported by industry-specific flows as needed; never duplicated.
 */
module.exports = async function faqLookup(params) {
    // TODO: Implement FAQ lookup logic
    return { ok: false, error: 'Not implemented yet' };
};
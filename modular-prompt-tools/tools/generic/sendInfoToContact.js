/**
 * Send information to a contact via preferred method.
 * Used by any vertical to send info (email, SMS, etc.) to a lead/contact.
 * Params: { contactId, method, message, ... }
 * Returns: { ok: true, data } or { ok: false, error }
 * Imported by industry-specific flows as needed; never duplicated.
 */
module.exports = async function sendInfoToContact(params) {
    // TODO: Implement info sending logic
    return { ok: false, error: 'Not implemented yet' };
};
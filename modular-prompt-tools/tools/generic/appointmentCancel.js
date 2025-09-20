/**
 * Cancel an existing appointment for a contact.
 * Used by any vertical to cancel a scheduled appointment.
 * Params: { appointmentId, contactId, reason, ... }
 * Returns: { ok: true, data } or { ok: false, error }
 * Imported by industry-specific flows as needed; never duplicated.
 */
module.exports = async function appointmentCancel(params) {
    // TODO: Implement appointment cancel logic
    return { ok: false, error: 'Not implemented yet' };
};
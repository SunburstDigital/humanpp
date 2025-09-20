/**
 * Handle an emergency plumbing callout.
 * Params: { name, phone, address, issue, time }
 * Returns: { ok: true, data } or { ok: false, error }
 * Only used in plumbing flows.
 */
module.exports = async function emergencyCallout(params) {
    // TODO: Implement emergency callout logic
    return { ok: false, error: 'Not implemented yet' };
};
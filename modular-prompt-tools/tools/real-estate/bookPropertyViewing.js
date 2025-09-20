/**
 * Book a property viewing for a client.
 * Params: { propertyId, clientId, date, time, agentId }
 * Returns: { ok: true, data } or { ok: false, error }
 * Only used in real-estate flows.
 */
module.exports = async function bookPropertyViewing(params) {
    // Stub: always succeed for test
    return {
        ok: true,
        message: `Viewing booked for ${params.name || 'client'} at property ${params.propertyId || ''}`
    };
};
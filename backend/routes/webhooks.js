// backend/routes/webhooks.js
// Handles inbound webhook events (e.g., Trello, messaging, etc.)

module.exports = async function (fastify, opts) {
  // POST /webhooks/:channel/inbound
  fastify.post('/webhooks/:channel/inbound', async (request, reply) => {
    const { channel } = request.params;
    const payload = request.body;
    // TODO: Implement logic to create/update conversations and append chunks as specified
    // For now, just log and return 200
    fastify.log.info({ channel, payload }, 'Received inbound webhook');
    reply.send({ status: 'ok', received: true });
  });
};

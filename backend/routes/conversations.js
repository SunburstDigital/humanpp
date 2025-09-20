const conversationService = require('../services/conversations/conversationService');
const { buildSessionInstructions } = require('../services/prompt.js');

async function routes(fastify, options) {
  // 1. Webhook Inbound
  fastify.post('/webhooks/:channel/inbound', async (request, reply) => {
    const { channel } = request.params;
    const { client_id, user_id, message, phone } = request.body;
    let conversation = null;
    let is_guest = false;
    try {
      // Determine guest status
      is_guest = !phone;
      // Lookup active conversation
      const found = await conversationService.getActiveConversation(user_id, channel);
      if (found.success && found.data) {
        conversation = found.data;
        await conversationService.appendChunk(conversation.id, 'user', message);
        // Update last_message_at
        await conversationService.updateLastMessageAt(conversation.id);
      } else {
        // Create new conversation
        const created = await conversationService.createConversation(client_id, user_id, channel, 'Handle inbound enquiry', null, is_guest);
        if (!created.success) return reply.code(500).send({ success: false, error: created.error });
        conversation = created.data;
        // Add system chunk
        await conversationService.appendChunk(conversation.id, 'system', 'System prompt here');
        // Add memory chunk from Pinecone
        let memory = null;
        try {
          memory = await buildSessionInstructions({
            calledNumber: client_id,
            phone: user_id,
            clientNumber: client_id,
            queryText: 'Handle inbound enquiry',
          });
        } catch (e) {
          memory = null;
        }
        await conversationService.appendChunk(conversation.id, 'memory', memory || '');
        await conversationService.appendChunk(conversation.id, 'user', message);
      }
      return { success: true, data: { conversation_id: conversation.id } };
    } catch (err) {
      return reply.code(500).send({ success: false, error: err.message });
    }
  });

  // 2. Outbound Send
  fastify.post('/conversations/:id/send', async (request, reply) => {
    const { id } = request.params;
    const { role, content } = request.body;
    await conversationService.appendChunk(id, role, content);
    // TODO: Call outbound channel API based on conversation.channel
    // TODO: Log outbound in conversation_messages (optional)
    return { success: true };
  });

  // 3. Conversation Fetch
  fastify.get('/conversations/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      // Fetch conversation
      const convoRes = await conversationService.getConversationById(id);
      if (!convoRes.success || !convoRes.data) {
        return reply.code(404).send({ success: false, error: 'Conversation not found' });
      }
      // Fetch chunks
      const chunksRes = await conversationService.getChunks(id);
      // Fetch steps
      const stepsRes = await conversationService.getSteps(id);
      // Fetch Pinecone memory/context for this conversation
      const conversation = convoRes.data;
      let memory = null;
      try {
        memory = await buildSessionInstructions({
          calledNumber: conversation.client_id,
          phone: conversation.user_id,
          clientNumber: conversation.client_id,
          queryText: conversation.goal || undefined,
        });
      } catch (e) {
        memory = null;
      }
      return {
        success: true,
        data: {
          conversation: convoRes.data,
          chunks: chunksRes.data || [],
          steps: stepsRes.data || [],
          memory,
        }
      };
    } catch (err) {
      return reply.code(500).send({ success: false, error: err.message });
    }
  });

  // 4. Steps Management
  fastify.post('/conversations/:id/steps', async (request, reply) => {
    const { id } = request.params;
    const { description } = request.body;
    const result = await conversationService.addStep(id, description);
    if (!result.success) return reply.code(500).send(result);
    return { success: true, data: result.data };
  });

  fastify.patch('/conversations/:id/steps/:step_id', async (request, reply) => {
    const { step_id } = request.params;
    const { status } = request.body;
    const result = await conversationService.updateStep(step_id, status);
    if (!result.success) return reply.code(500).send(result);
    return { success: true, data: result.data };
  });
}

module.exports = routes;

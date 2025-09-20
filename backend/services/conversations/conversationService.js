// Helper: get conversation by ID
async function getConversationById(conversation_id) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversation_id)
    .single();
  if (error) return { success: false, error };
  return { success: true, data };
}

// Helper: get all chunks for a conversation
async function getChunks(conversation_id) {
  const { data, error } = await supabase
    .from('conversation_chunks')
    .select('*')
    .eq('conversation_id', conversation_id)
    .order('created_at', { ascending: true });
  if (error) return { success: false, error };
  return { success: true, data };
}

// Helper: get all steps for a conversation
async function getSteps(conversation_id) {
  const { data, error } = await supabase
    .from('conversation_steps')
    .select('*')
    .eq('conversation_id', conversation_id)
    .order('created_at', { ascending: true });
  if (error) return { success: false, error };
  return { success: true, data };
}
// Helper: update last_message_at
async function updateLastMessageAt(conversation_id) {
  const { error } = await supabase
    .from('conversations')
    .update({ last_message_at: new Date() })
    .eq('id', conversation_id);
  if (error) return { success: false, error };
  return { success: true };
}
// Service layer for conversation management (Supabase/Postgres)
// All DB logic for conversations, chunks, steps, and utilities

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../infra/.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Helper: get active conversation
async function getActiveConversation(user_id, channel) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user_id)
    .eq('channel', channel)
    .eq('status', 'active')
    .single();
  if (error && error.code !== 'PGRST116') return { success: false, error };
  return { success: true, data };
}

// Helper: create conversation
async function createConversation(client_id, user_id, channel, goal, summary = null, is_guest = false) {
  const { data, error } = await supabase
    .from('conversations')
    .insert({ client_id, user_id, channel, goal, summary, is_guest, status: 'active', last_message_at: new Date() })
    .select()
    .single();
  if (error) return { success: false, error };
  return { success: true, data };
}

// Helper: append chunk
async function appendChunk(conversation_id, role, content) {
  const { data, error } = await supabase
    .from('conversation_chunks')
    .insert({ conversation_id, role, content, created_at: new Date() })
    .select()
    .single();
  if (error) return { success: false, error };
  return { success: true, data };
}

// Helper: add step
async function addStep(conversation_id, content, metadata) {
  const { data, error } = await supabase
    .from('conversation_steps')
    .insert({ conversation_id, content, metadata, status: 'pending', created_at: new Date() })
    .select()
    .single();
  if (error) return { success: false, error };
  return { success: true, data };
}

// Helper: update step
async function updateStep(step_id, updates) {
  const { data, error } = await supabase
    .from('conversation_steps')
    .update(updates)
    .eq('id', step_id)
    .select()
    .single();
  if (error) return { success: false, error };
  return { success: true, data };
}

// Helper: delete step
async function deleteStep(step_id) {
  const { error } = await supabase
    .from('conversation_steps')
    .delete()
    .eq('id', step_id);
  if (error) return { success: false, error };
  return { success: true };
}

// Helper: delete expired guest conversations
async function deleteGuestExpired() {
  // Find expired guest conversations
  const { data: expired, error } = await supabase
    .from('conversations')
    .select('id')
    .eq('is_guest', true)
    .eq('status', 'expired');
  if (error) return { success: false, error };
  if (!expired.length) return { success: true, data: [] };
  // Delete conversations (cascades to chunks/steps)
  const ids = expired.map(c => c.id);
  const { error: delError } = await supabase
    .from('conversations')
    .delete()
    .in('id', ids);
  if (delError) return { success: false, error: delError };
  return { success: true, data: ids };
}

module.exports = {
  getActiveConversation,
  createConversation,
  appendChunk,
  addStep,
  updateStep,
  deleteStep,
  deleteGuestExpired,
  updateLastMessageAt,
  getConversationById,
  getChunks,
  getSteps,
};

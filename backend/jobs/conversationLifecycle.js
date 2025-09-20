// Cron job for conversation lifecycle management
const conversationService = require('../services/conversations/conversationService');

// Scheduled job: delete guest conversations older than 24h every hour
setInterval(async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  // Find expired guest conversations
  const { data: guests, error } = await conversationService.supabase
    .from('conversations')
    .select('id, created_at')
    .eq('is_guest', true);
  if (error) {
    console.error('Error finding guest conversations:', error);
    return;
  }
  const expired = guests.filter(c => new Date(c.created_at) < cutoff).map(c => c.id);
  if (expired.length) {
    const { error: delError } = await conversationService.supabase
      .from('conversations')
      .delete()
      .in('id', expired);
    if (delError) {
      console.error('Error deleting expired guests:', delError);
    } else {
      console.log(`[Guest Cleanup] Deleted ${expired.length} guest conversations older than 24h.`);
    }
  } else {
    console.log('[Guest Cleanup] No expired guest conversations found.');
  }
}, 60 * 60 * 1000); // every hour

module.exports = {};

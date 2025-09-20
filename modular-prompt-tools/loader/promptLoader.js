// promptLoader.js
// Loads prompts by ID, overlays persona and slang, supports Pinecone + Supabase lookup

async function loadPromptById(promptId, { persona, slang } = {}) {
  // TODO: Fetch base prompt from Supabase or Pinecone by promptId
  let prompt = `[PROMPT:${promptId}]`;
  // TODO: Overlay persona block
  if (persona) prompt += `\n[PERSONA:${persona}]`;
  // TODO: Overlay slang/pronunciation block
  if (slang) prompt += `\n[SLANG:${slang}]`;
  return prompt;
}

export { loadPromptById };

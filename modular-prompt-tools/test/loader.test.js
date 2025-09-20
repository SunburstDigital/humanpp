// loader.test.js
// Stub test for promptLoader
const { loadPromptById } = require('../loader/promptLoader.js');

test('loadPromptById overlays persona and slang', async () => {
  const prompt = await loadPromptById('testPrompt', { persona: 'friendly', slang: 'Aussie' });
  expect(prompt).toContain('[PROMPT:testPrompt]');
  expect(prompt).toContain('[PERSONA:friendly]');
  expect(prompt).toContain('[SLANG:Aussie]');
});

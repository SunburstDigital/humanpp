// bookViewing.test.js
// Stub test for bookViewing tool
const bookViewing = require('../tools/real-estate/bookPropertyViewing.js');

test('bookViewing returns ok', async () => {
  const result = await bookViewing({ name: 'Alice', propertyId: 123 });
  expect(result.ok).toBe(true);
  expect(result.message).toMatch(/Viewing booked/);
});

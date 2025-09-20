# Test Coverage and Usage

## Running Tests

- Run all tests:
  ```sh
  npm test
  ```
- Run a specific test file:
  ```sh
  npm test -- backend/test/conversations.test.js
  ```

## What is Covered
- All conversation API routes (webhook inbound, outbound send, fetch, steps)
- Service logic for conversations, steps, and chunks
- Error handling for all endpoints

## Adding New Tests
- Place new test files in `backend/test/`
- Use Jest and mock dependencies as shown in `conversations.test.js`
- Structure tests with `describe` and `it` blocks

## Mocking
- Use `jest.mock()` for service and utility dependencies
- See `conversations.test.js` for examples

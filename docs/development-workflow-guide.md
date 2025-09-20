# Development Workflow

## Starting the Backend
- Start in production mode:
  ```sh
  npm start
  ```
- Start in development mode (with auto-reload):
  ```sh
  npm run dev
  ```

## Adding Endpoints or Helpers
- Add new route files in `backend/routes/`
- Add new service/helper files in `backend/services/` or `backend/utils/`
- Export with `module.exports` (CommonJS)

## Mocking in Tests
- Use `jest.mock()` for all external dependencies
- See `backend/test/conversations.test.js` for patterns

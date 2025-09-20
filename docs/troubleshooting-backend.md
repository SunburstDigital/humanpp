# Troubleshooting

## Common Issues

### 1. Jest Syntax Errors ("Unexpected token")
- Ensure `package.json` does NOT have `"type": "module"`.
- Make sure `jest.config.js` uses CommonJS syntax (`module.exports = { ... }`).
- All backend and test files should use `require`/`module.exports` (CommonJS).

### 2. Test File Corruption
- If a test file is corrupted or has hidden characters:
  - Create a new file and copy the test code into it.
  - Delete the corrupted file and rename the new one.

### 3. Adding New Dependencies
- Install with `npm install <package>`
- If using in tests, mock with `jest.mock()`

### 4. Database/Integration Errors
- Check `.env` for correct Supabase and Pinecone credentials
- Ensure services are reachable from your environment

## Resetting a Corrupted Test File
1. Create a new `.js` file in `backend/test/`
2. Copy the working test code into it
3. Delete the old/corrupted file
4. Rename the new file to the canonical name

# Copilot Instructions for Dependencies

- If you see `MODULE_NOT_FOUND` for a `require('...')` or `import ...`, 
  suggest running:
  npm install <package-name>

- Always check that `package.json` includes the package in `"dependencies"`.
- Example: if file-server.js requires `serve-index`, ensure package.json has:
  "serve-index": "^1.9.1"

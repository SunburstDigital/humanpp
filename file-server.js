// file-server.js
const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

const app = express();
const PUBLIC_DIR = path.join(__dirname, '.'); // serve your repo root, adjust if needed

// Block dotfiles (like .env) explicitly
app.use((req, res, next) => {
  const basename = path.basename(req.path);
  if (basename.startsWith('.')) {
    return res.status(404).send('Not found');
  }
  next();
});

// Serve static files, denying dotfiles
app.use('/', serveStatic(PUBLIC_DIR, {
  dotfiles: 'deny',
  index: false
}));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Secure file server running on port ${PORT}`);
});

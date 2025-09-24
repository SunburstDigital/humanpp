// ======================================================================================
// file-server.js — VS Code Style Repo Browser with Back Link
// ======================================================================================

const express = require("express");
const path = require("path");
const fs = require("fs");
const serveStatic = require("serve-static");
const marked = require("marked");
const hljs = require("highlight.js");

const app = express();
const PUBLIC_DIR = path.join(__dirname, ".");

// Markdown renderer setup
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});

// Block dotfiles
app.use((req, res, next) => {
  const basename = path.basename(req.path);
  if (basename.startsWith(".")) {
    return res.status(404).send("Not found");
  }
  next();
});

// Static files (CSS, images, etc.)
app.use("/", serveStatic(PUBLIC_DIR, { dotfiles: "deny" }));

// Catch-all
app.get(/.*/, (req, res, next) => {
  const filePath = path.join(PUBLIC_DIR, req.path);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();

    // Markdown
    if (ext === ".md") {
      const md = fs.readFileSync(filePath, "utf8");
      const html = marked.parse(md);
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <title>${path.basename(filePath)}</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown-light.min.css">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
          <style>
            body { margin: 2rem; font-family: 'Segoe UI', Roboto, sans-serif; background:#f9f9f9; }
            header { font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; }
            a.back { display:inline-block; margin-bottom:1rem; text-decoration:none; color:#0366d6; }
            a.back:hover { text-decoration:underline; }
          </style>
        </head>
        <body class="markdown-body">
          <a href="/" class="back">🔙 Back to Repo</a>
          <header>📘 ${path.basename(filePath)}</header>
          ${html}
        </body>
        </html>
      `);
    }

    // Code/text
    if ([".js", ".json", ".sql", ".yml", ".yaml", ".txt"].includes(ext)) {
      const code = fs.readFileSync(filePath, "utf8");
      const highlighted = hljs.highlightAuto(code).value;
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <title>${path.basename(filePath)}</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
          <style>
            body { margin: 2rem; font-family: 'Segoe UI', Roboto, sans-serif; background:#f9f9f9; }
            header { font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; }
            a.back { display:inline-block; margin-bottom:1rem; text-decoration:none; color:#0366d6; }
            a.back:hover { text-decoration:underline; }
            pre { padding: 1rem; background: #1e1e1e; color: #dcdcdc; border-radius: 8px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <a href="/" class="back">🔙 Back to Repo</a>
          <header>📄 ${path.basename(filePath)}</header>
          <pre><code>${highlighted}</code></pre>
        </body>
        </html>
      `);
    }

    // Default → raw file
    return res.sendFile(filePath);
  }

  // Directory listing
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const files = fs.readdirSync(filePath).filter(f => !f.startsWith("."));
    const list = files.map(f => {
      const full = path.join(req.path, f);
      const abs = path.join(PUBLIC_DIR, full);
      const isDir = fs.statSync(abs).isDirectory();
      return `<li class="${isDir ? "dir" : "file"}"><a href="${full}">${isDir ? "📁" : "📄"} ${f}</a></li>`;
    }).join("");

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>📂 Sunburst Repo Browser</title>
        <style>
          body { margin: 2rem; font-family: 'Segoe UI', Roboto, sans-serif; background:#f9f9f9; }
          h1 { font-size: 1.8rem; margin-bottom: 1rem; }
          ul { list-style: none; padding-left: 0; }
          li { margin: 0.3rem 0; }
          a { text-decoration: none; color: #0366d6; }
          a:hover { text-decoration: underline; }
          .dir a { font-weight: bold; }
          .file a { font-weight: normal; }
        </style>
      </head>
      <body>
        <h1>📂 Sunburst Repo Browser</h1>
        <ul>${list}</ul>
      </body>
      </html>
    `);
  }

  next();
});

// Start server
const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`📂 VS Code–style file server running at http://localhost:${PORT}`);
});

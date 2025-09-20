// services/pdf.js
const fs = require("fs");
const pdf = require("pdf-parse");

async function readPdf(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text; // extracted text
  } catch (err) {
    console.error("PDF read error:", err);
    throw err;
  }
}

module.exports = { readPdf };

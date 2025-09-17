// services/pdf.js
import fs from "fs";
import pdf from "pdf-parse";

export async function readPdf(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text; // extracted text
  } catch (err) {
    console.error("PDF read error:", err);
    throw err;
  }
}

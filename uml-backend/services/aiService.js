import axios from "axios";
import fs from "fs";
import FormData from "form-data";

import { extractTextFromImage } from "./ocrService.js";
import { buildGraph } from "./graphService.js";
import { detectPatterns } from "./patternService.js";

/**
 * AI CALL (NO DELETE HERE ❗)
 */
export async function analyzeUMLDiagram(filePath) {
  try {
    const form = new FormData();

    form.append("image", fs.createReadStream(filePath));

    const response = await axios.post(
      "http://127.0.0.1:5050/predict",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    // ❌ REMOVE DELETE FROM HERE
    // fs.unlinkSync(filePath);

    return response.data;

  } catch (error) {
    console.error(
      "AI Service Error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * FULL PIPELINE
 */
export async function fullUMLAnalysis(filePath) {
  try {
    // 1️⃣ AI (file still exists)
    const metrics = await analyzeUMLDiagram(filePath);

    // 2️⃣ OCR (NOW WORKS ✅)
    const text = await extractTextFromImage(filePath);

    // 3️⃣ Graph
    const graph = buildGraph(text);

    // 4️⃣ Pattern Detection
  const patterns = detectPatterns(text);

    // ✅ DELETE ONLY AT END
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      metrics,
      patterns,
      graph,
      rawText: text,
    };

  } catch (error) {
    console.error("Full Analysis Error:", error.message);

    // safety cleanup
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw error;
  }
}
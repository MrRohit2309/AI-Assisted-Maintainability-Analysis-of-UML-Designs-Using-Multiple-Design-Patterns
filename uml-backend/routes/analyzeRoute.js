import express from "express";
import multer from "multer";
import path from "path";

import { fullUMLAnalysis } from "../services/aiService.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/analyze-uml", upload.single("umlImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No UML image uploaded",
      });
    }

    // ✅ FIX: absolute path
    const absolutePath = path.resolve(req.file.path);

    console.log("Absolute Path:", absolutePath);

    const result = await fullUMLAnalysis(absolutePath);

    res.json(result);

  } catch (error) {
    console.error("Route Error:", error);

    res.status(500).json({
      error: "AI analysis failed",
    });
  }
});

export default router;
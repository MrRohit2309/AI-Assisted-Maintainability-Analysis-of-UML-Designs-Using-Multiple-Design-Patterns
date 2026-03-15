import express from "express";
import multer from "multer";
import { analyzeUMLDiagram } from "../services/aiService.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/analyze-uml", upload.single("umlImage"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        error: "No UML image uploaded"
      });
    }

    const metrics = await analyzeUMLDiagram(req.file.path);

    res.json(metrics);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI analysis failed"
    });
  }
});

export default router;
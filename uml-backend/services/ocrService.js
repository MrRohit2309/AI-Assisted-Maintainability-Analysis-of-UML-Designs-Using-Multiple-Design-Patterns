import Tesseract from "tesseract.js";

export const extractTextFromImage = async (imagePath) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, "eng");

    return text;
  } catch (err) {
    console.error("OCR Error:", err);
    return "";
  }
};
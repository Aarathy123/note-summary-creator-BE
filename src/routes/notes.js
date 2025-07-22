import { GoogleGenAI } from "@google/genai";
import express from "express";
import multer from "multer";
import FILE_SUMMARY_PROMPT from "../prompt/fileSummary.js";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const upload = multer({ dest: "uploads/", storage: multer.memoryStorage() });


router.post("/process-pdf", upload.single("pdf"), async (req, res) => {
  const { prompt } = req.body;
  try {
    const buffer = req.file.buffer;
    const base64Pdf = buffer.toString("base64");
    const contents = `${FILE_SUMMARY_PROMPT} <>${prompt}<> """${base64Pdf}"""`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
    });
    res.send(response.text);
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).send("Error processing PDF");
  }
});

export default router;

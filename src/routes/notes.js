import { GoogleGenAI } from "@google/genai";
import express from "express";
import multer from "multer";
import FILE_SUMMARY_PROMPT from "../prompt/fileSummary.js";
import uploadToSpaces from "../storage/client.js";
import Item from "../models/item.js";
import NOTES_PROMPT from "../prompt/notes.js";

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
    const fileName = `${Date.now()}-${req.file.originalname}`;
    await uploadToSpaces(buffer, fileName, req.file.mimetype);
    const item = new Item({
      type: "smart-summary",
      prompt: prompt,
      result: response.text,
      url: `https://${process.env.BUCKET_NAME}.nyc3.digitaloceanspaces.com/${encodeURIComponent(fileName)}`,
    });
    await item.save();
    res.send(response.text);
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).send("Error processing PDF");
  }
});


router.post("/pdf-to-visual-notes", upload.single("pdf"), async (req, res) => {
  const buffer = req.file.buffer;
  const { prompt } = req.body;
  const base64Pdf = buffer.toString("base64");

  const contents = `${NOTES_PROMPT} <>${prompt}<> """${base64Pdf}"""`;
  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: contents,
    n: 1,
    size: "1024x1024",
  });

  const fileName = `${Date.now()}-${req.file.originalname}`;
  await uploadToSpaces(buffer, fileName, req.file.mimetype);
  const base64Image = response.data[0].b64_json;
  const imageName = `${fileName}-image.png`;
  res.set("Content-Type", "image/png");
  const imageBuffer = Buffer.from(base64Image, 'base64');
  await uploadToSpaces(imageBuffer, imageName, "image/png");

  const item = new Item({
    type: "visual-notes",
    prompt: prompt,
    resultUrl: `https://${process.env.BUCKET_NAME}.nyc3.digitaloceanspaces.com/${encodeURIComponent(imageName)}`,
    url: `https://${process.env.BUCKET_NAME}.nyc3.digitaloceanspaces.com/${encodeURIComponent(fileName)}`,
  });
  await item.save();
  res.send(imageBuffer);
});

export default router;

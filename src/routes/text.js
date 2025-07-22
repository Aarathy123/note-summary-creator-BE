
import express from "express";
import { GoogleGenAI } from "@google/genai";
import Item from "../models/item.js";
import TEXT_SUMMARY_PROMPT from "../prompt/textSummary.js";

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/process-text", async (req, res) => {
  const { text, prompt } = req.body;
  const contents = `${TEXT_SUMMARY_PROMPT} <>${prompt}<> """${text}"""`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: contents,
  });
  const item = new Item({
    type: "text",
    value: text,
    summary: response.text,
  });
  await item.save();
  res.send(response.text);
});

export default router;
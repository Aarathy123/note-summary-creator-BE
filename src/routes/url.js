import { GoogleGenAI } from "@google/genai";
import express from "express";
import URL_SUMMARY_PROMPT from "../prompt/urlSummary.js";

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/process-url", async (req, res) => {
  const { url, prompt } = req.body;
  const contents = `${URL_SUMMARY_PROMPT} <>${prompt}<> """${url}"""`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: contents,
  });
  res.send(response.candidates[0].content.parts[0].text);
});

export default router;

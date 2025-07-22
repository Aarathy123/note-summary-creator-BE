import express from "express";
import { GoogleGenAI } from "@google/genai";
import Item from "../models/item.js";
import TEXT_SUMMARY_PROMPT from "../prompt/textSummary.js";
import NOTES_PROMPT from "../prompt/notes.js";
import FLASH_CARD_PROMPT from "../prompt/flashCard.js";
import INFO_GRAPHICS_PROMPT from "../prompt/infoGraphics.js";
import generateText from "../ai/generateText.js";

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/process", async (req, res) => {
  const { text, prompt, type } = req.body;
  let response;
  if (type === "smart-summary" || type === "key-points") {
    const contents = `${type === "smart-summary" ? TEXT_SUMMARY_PROMPT : KEY_POINTS_PROMPT} <>${prompt}<> """${text}"""`;
    response = await generateText(contents);
  } else if (type === "visual-notes" || type === "info-graphics" || type === "flash-cards") {
    const contents = `${type === "visual-notes" ? NOTES_PROMPT : type === "info-graphics" ? INFO_GRAPHICS_PROMPT : FLASH_CARD_PROMPT} ${
      prompt ? `<>${prompt}<>` : ""
    } """${text}"""`;
    response = await generateImage(contents);
  }
  const result = {
    type,
    input: text,
  };
  if (prompt) {
    result.prompt = prompt;
  }
  if (type === "visual-notes" || type === "info-graphics") {
    const base64Image = response[0].b64_json;
    const imageBuffer = Buffer.from(base64Image, "base64");
    const imageName = `${Date.now()}-${type}-text`;
    await uploadToSpaces(imageBuffer, imageName, "image/png");
    result.resultUrl = [
      `https://${
        process.env.BUCKET_NAME
      }.nyc3.digitaloceanspaces.com/${encodeURIComponent(imageName)}`,
    ];
    const item = new Item(result);
    await item.save();
    res.send(result);
  }
  if (type === "flash-cards") {
    response.forEach(async (image, index) => {
      const base64Image = image.b64_json;
      const imageBuffer = Buffer.from(base64Image, "base64");
      const imageName = `${Date.now()}-${type}-text`;
      await uploadToSpaces(imageBuffer, imageName, "image/png");
      result.resultUrl.push(
        `https://${
          process.env.BUCKET_NAME
        }.nyc3.digitaloceanspaces.com/${encodeURIComponent(imageName)}`
      );
      if (index === response.length - 1) {
        const item = new Item(result);
        await item.save();
        res.send(result);
      }
    });
  }
  if (type === "smart-summary" || type === "key-points") {
    result.result = response.text;
    const item = new Item(result);
    await item.save();
    res.send(response.text);
  }
});

export default router;

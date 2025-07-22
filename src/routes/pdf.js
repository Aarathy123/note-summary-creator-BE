import express from "express";
import multer from "multer";

import FILE_SUMMARY_PROMPT from "../prompt/fileSummary.js";
import uploadToSpaces from "../storage/client.js";
import Item from "../models/item.js";
import NOTES_PROMPT from "../prompt/notes.js";
import generateImage from "../ai/generateImage.js";
import FLASH_CARD_PROMPT from "../prompt/flashCard.js";
import INFO_GRAPHICS_PROMPT from "../prompt/infoGraphics.js";
import KEY_POINTS_PROMPT from "../prompt/keyPoints.js";
import generateText from "../ai/generateText.js";
import SOCIAL_MEDIA_POST_PROMPT from "../prompt/socialMediaPost.js";

const router = express.Router();
const upload = multer({ limits: {
  fileSize: 5 * 1024 * 1024 // 5MB
} });

router.post("/process",  upload.single("file"), async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) {
      return res.status(400).send("Type is required");
    }
    
    if (!req.file) {
      return res.status(400).send("File is required");
    }
    
    const buffer = req.file.buffer;
    const base64Pdf = buffer.toString("base64");
    let response;
    const contents = `${FILE_SUMMARY_PROMPT} """${base64Pdf}"""`;
    response = await generateText(contents);
    if (type === "visual-notes") {
      const contents = `${NOTES_PROMPT} """${response}"""`;
      response = await generateImage(contents);
    } else if (type === "flash-cards") {
      const contents = `${FLASH_CARD_PROMPT} """${response}"""`;
      response = await generateImage(contents, 2);
    } else if (type === "info-graphics") {
      const contents = `${INFO_GRAPHICS_PROMPT} """${response}"""`;
      response = await generateImage(contents);
    } else if (type === "key-points") {
      const contents = `${KEY_POINTS_PROMPT} """${response}"""`;
      response = await generateText(contents);
    } else if (type === "social-media-post") {
      const contents = `${SOCIAL_MEDIA_POST_PROMPT} """${response}"""`;
      response = await generateText(contents);
    }
    const fileName = `${Date.now()}-${req.file.originalname}`;
    await uploadToSpaces(buffer, fileName, req.file.mimetype);
    const result = {
      type,
      inputUrl: `https://${
        process.env.BUCKET_NAME
      }.nyc3.digitaloceanspaces.com/${encodeURIComponent(fileName)}`,
      resultUrl: [],
    };
    if (type === "visual-notes" || type === "info-graphics") {
      const base64Image = response[0].b64_json;
      const imageName = `${fileName}-image.png`;
      const imageBuffer = Buffer.from(base64Image, "base64");
      await uploadToSpaces(imageBuffer, imageName, "image/png");
      result.resultUrl = [`https://${
        process.env.BUCKET_NAME
      }.nyc3.digitaloceanspaces.com/${encodeURIComponent(imageName)}`];
      const item = new Item(result);
      await item.save();
      res.send(result);  
    }
    if (type === "flash-cards") {
      response.forEach(async (image, index) => {
        const base64Image = image.b64_json;
        const imageBuffer = Buffer.from(base64Image, "base64");
        const imageName = `${fileName}-image-${index}.png`;
        await uploadToSpaces(imageBuffer, imageName, "image/png");
        result.resultUrl.push(`https://${
          process.env.BUCKET_NAME
        }.nyc3.digitaloceanspaces.com/${encodeURIComponent(imageName)}`);
        if (index === response.length - 1) {
          const item = new Item(result);
          await item.save();
          res.send(result);
        }
      })
    }
    if (type === "smart-summary" || type === "key-points" || type === "social-media-post") {
      result.result = response;
      const item = new Item(result);
      await item.save();
      res.send(result);
    }
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).send("Error processing PDF");
  }
});

export default router;

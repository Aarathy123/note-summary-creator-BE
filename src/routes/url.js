import express from "express";
import URL_SUMMARY_PROMPT from "../prompt/urlSummary.js";
import Item from "../models/item.js";
import FLASH_CARD_PROMPT from "../prompt/flashCard.js";
import NOTES_PROMPT from "../prompt/notes.js";
import generateImage from "../ai/generateImage.js";
import uploadToSpaces from "../storage/client.js";
import INFO_GRAPHICS_PROMPT from "../prompt/infoGraphics.js";
import generateText from "../ai/generateText.js";
import KEY_POINTS_PROMPT from "../prompt/keyPoints.js";
import SOCIAL_MEDIA_POST_PROMPT from "../prompt/socialMediaPost.js";

const router = express.Router();


router.post("/process", async (req, res) => {
  const { url, prompt, type } = req.body;
  let response;
  if (type === "smart-summary") {
    const contents = `${URL_SUMMARY_PROMPT} ${prompt ? `<>${prompt}<>` : ""} """${url}"""`;
    response = await generateText(contents);
  } else if (type === "visual-notes") {
    const contents = `${NOTES_PROMPT} ${prompt ? `<>${prompt}<>` : ""} """${url}"""`;
    response = await generateImage(contents);
  }
  if (type === "flash-cards") {
    const contents = `${FLASH_CARD_PROMPT} ${prompt ? `<>${prompt}<>` : ""} """${url}"""`;
    response = await generateImage(contents, 2);
  }
  if (type === "info-graphics") {
    const contents = `${INFO_GRAPHICS_PROMPT} ${prompt ? `<>${prompt}<>` : ""} """${url}"""`;
    response = await generateImage(contents);
  }
  if (type === "key-points") {
    const contents = `${KEY_POINTS_PROMPT} ${prompt ? `<>${prompt}<>` : ""} """${url}"""`;
    response = await generateText(contents);
  }
  if (type === "social-media-post") {
    const contents = `${SOCIAL_MEDIA_POST_PROMPT} ${prompt ? `<>${prompt}<>` : ""} """${url}"""`;
    response = await generateText(contents);
  }
  const result = {
    type,
    prompt: prompt,
    inputUrl: url,
    resultUrl: [],
  }
  if (type === "visual-notes" || type === "info-graphics") {

    const fileName = `${Date.now()}-${type}-url`;
    const base64Image = response[0].b64_json;
    const imageBuffer = Buffer.from(base64Image, "base64");
    await uploadToSpaces(imageBuffer, fileName, "image/png");
    result.resultUrl = [`https://${
        process.env.BUCKET_NAME
      }.nyc3.digitaloceanspaces.com/${encodeURIComponent(imageName)}`];
    const item = new Item(result);
    await item.save();
    res.send(result);
  }
  if (type === "flash-cards") {
    response?.forEach(async (image, index) => {
      const base64Image = image.b64_json;
      const imageBuffer = Buffer.from(base64Image, "base64");
      const fileName = `${Date.now()}-${type}-url`;
      await uploadToSpaces(imageBuffer, fileName, "image/png");
      console.log(`https://${
        process.env.BUCKET_NAME
      }.nyc3.digitaloceanspaces.com/${encodeURIComponent(fileName)}`)
      result.resultUrl.push(`https://${
        process.env.BUCKET_NAME
      }.nyc3.digitaloceanspaces.com/${encodeURIComponent(fileName)}`);
      if (index === response.length - 1) {
        const item = new Item(result);
        await item.save();
        res.send(result);
      }
    })
  }
  if (type === "smart-summary") {
    result.result = response.candidates[0].content.parts[0].text;
    const item = new Item(result);
    await item.save();
    res.send(result);
  }
  if (type === "key-points" || type === "social-media-post") {
    result.result = response;
    const item = new Item(result);
    await item.save();
    res.send(result);
  }
  
});



export default router;

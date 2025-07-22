import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const generateText = async (text) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: text,
  });
  return response.text;
};

export default generateText;
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

const generateImage = async (contents, n = 1) => {
    const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: contents,
        n,
        size: "1024x1024",
      });
      return response.data;
};

export default generateImage;
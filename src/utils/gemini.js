require("dotenv").config();  // ✅ Make sure to load env

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.AI_KEY;

if (!apiKey) {
  console.error("❌ Gemini API key is missing! Please set AI_KEY in your .env file.");
  throw new Error("Missing Gemini API key");
}

const genAI = new GoogleGenerativeAI(apiKey);


async function generateFromGemini(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",  
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = generateFromGemini;

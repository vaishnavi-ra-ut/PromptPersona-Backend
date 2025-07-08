require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.AI_KEY);

async function generateFromGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",  
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("Gemini AI failed to respond");
  }
}

module.exports = generateFromGemini;

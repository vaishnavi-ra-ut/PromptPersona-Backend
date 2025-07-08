const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const generateFromGemini = require("../utils/gemini");

router.post("/generate", userAuth, async (req, res) => {
  const { message, personaPrompt } = req.body;

  if (!message || !personaPrompt) {
    return res.status(400).json({ error: "Missing input or persona" });
  }

  const prompt = `
${personaPrompt}
Stay in character. Keep the response short, clear, and specific.
Ensure your response is complete and does not end mid-sentence.
Keep your responses brief and focused. Aim for 1-2 small paragraphs.
You are a helpful AI assistant. Your task is to respond to user messages based on the provided persona prompt.
 Additional instructions:
- If the user's message contains spelling or grammar mistakes, try your best to understand it and respond accordingly.
- If the message is unclear or ambiguous, kindly ask for clarification.
- Never return a blank or empty reply.
Now respond to the user message:
"${message}"
`;

  try {
    const reply = await generateFromGemini(prompt);
    res.json({ reply });
  } catch (err) {
    console.error("🔥 AI route failed:", err);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

module.exports = router;

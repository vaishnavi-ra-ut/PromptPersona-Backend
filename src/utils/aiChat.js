const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const generateFromGemini = require("./gemini");

router.post("/generate", userAuth, async (req, res) => {
  const { message, personaPrompt } = req.body;

  if (!message || !personaPrompt) {
    return res.status(400).json({ error: "Missing input or persona" });
  }

  const combinedPrompt = `
You are an AI persona with the following instructions:
${personaPrompt}

Now, respond to the user message below:
"${message}"
`;

  try {
    const aiReply = await generateFromGemini(combinedPrompt);
    res.json({ reply: aiReply });
  } catch (err) {
    console.error("🔥 AI route failed:", err);
    res.status(500).json({ error: err.message || "Failed to generate AI response" });
  }
});


module.exports = router;

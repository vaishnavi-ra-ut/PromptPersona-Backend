// src/utils/aiChat.js
const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const generateFromGemini = require("../utils/gemini");
const Message = require("../models/Message");

router.post("/generate", userAuth, async (req, res) => {
  const { message, personaPrompt, chatId } = req.body;

  if (!message || !personaPrompt || !chatId) {
    return res.status(400).json({ error: "Missing input, persona, or chat ID" });
  }

  try {
    // Step 1: Fetch last 5 messages for chat context
    const recentMessages = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const historyText = recentMessages
      .reverse()
      .map((msg) => `${msg.sender === "user" ? "User" : "AI"}: ${msg.content}`)
      .join("\n");

    // Step 2: Final formatted prompt
    const finalPrompt = `
${personaPrompt}

Conversation so far:
${historyText}

Now respond to the user's latest message:
"${message}"

⚠️ Stay in character. Keep your reply focused, concise, and on-topic.
- Handle spelling mistakes gracefully.
- If unclear, ask user to clarify.
- Never return a blank or half answer.
- Keep it short and readable.
`;

    // Step 3: Generate response from Gemini
    const aiReply = await generateFromGemini(finalPrompt);

    if (!aiReply || !aiReply.trim()) {
      return res.status(500).json({ error: "AI generated an empty response" });
    }

    // Step 4: Save user message
    await Message.create({
      chat: chatId,
      sender: "user",
      content: message
    });

    // Step 5: Save AI reply
    await Message.create({
      chat: chatId,
      sender: "ai",
      content: aiReply
    });

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("🔥 AI route failed:", err);
    res.status(500).json({ error: "Failed to generate AI response. Try rephrasing your message." });
  }
});

module.exports = router;

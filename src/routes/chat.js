const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const userAuth = require("../middlewares/userAuth");



// @route POST /api/chat/start
// @desc Start a new chat with selected persona
// @access Private
router.post("/start", userAuth, async (req, res) => {
  try {
    const { persona } = req.body;

    if (!persona || !persona.name || !persona.prompt) {
      return res.status(400).json({ error: "Invalid persona data" });
    }

    const newChat = new Chat({
      user: req.user._id,
      persona,
      messages: []
    });

    await newChat.save();

    res.status(201).json({
      message: "Chat started successfully",
      chat: newChat
    });
  } catch (err) {
      console.log("Chat start error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// @route POST /api/chat/chatId/message
// @desc Send messages to the
// @access Private
router.post("/:chatId/message", userAuth, async (req, res) => {
  try {
    const { sender, content } = req.body;

    if (!sender || !content) {
      return res.status(400).json({ error: "Missing message fields" });
    }

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const newMessage = new Message({
      chat: chat._id,
      sender,
      content
    });

    await newMessage.save();

    // Add message to chat
    chat.messages.push(newMessage._id);
    await chat.save();

    res.status(201).json({ message: "Message added", data: newMessage });
  } catch (err) {
    console.log("Add message error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// @route GET /api/chat/history/:chatId
// @desc To get the chat history
// @access Private
router.get("/history/:chatId", userAuth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("messages")
      .lean();

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Optional security: only owner can access
    if (chat.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json({ chat });

  } catch (err) {
    console.log("Get chat error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// @route GET /api/chat/user-chats
// @desc To see all the chats till now with different personas
// @access Private
router.get("/user-chats", userAuth, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select("persona _id createdAt updatedAt") 
      .lean();

    res.json({ chats });
    
  } catch (err) {
    console.log("Get all chats error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;

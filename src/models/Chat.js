const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    persona: {
      name: String,
      description: String,
      prompt: String,
      icon: String,
      avatar: String,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);

const mongoose = require("mongoose");

const personaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: "🤖"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null 
  },
  createdByName: {
    type: String,
    default: "Anonymous"
  },
    avatar: {
      type: String,
      default: "https://i.postimg.cc/RZrtWmbz/freepik-a-funny-avatar-of-an-animal-wearing-glasses-and-a-22489-removebg-preview.png",
    },
    category: {
      type: String,
      default: "Your Personas",
    }
}, { timestamps: true });

module.exports = mongoose.model("Persona", personaSchema);

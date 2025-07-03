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
    default: null // default personas will have no creator
  },
  createdByName: {
    type: String,
    default: "Anonymous"
  }
}, { timestamps: true });

module.exports = mongoose.model("Persona", personaSchema);

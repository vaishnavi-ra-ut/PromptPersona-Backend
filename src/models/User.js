const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 10,
    max: 120
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"]
  },
  profilePic: {
  type: String, 
}
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./src/routes/auth");
const profileRoutes = require("./src/routes/profile");
const personaRoutes = require("./src/routes/persona");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");


dotenv.config();

const app = express();

app.use(express.json()); 
app.use(cors());   
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/personas", personaRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("PromptPersona backend is live! 🧠");
});

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });


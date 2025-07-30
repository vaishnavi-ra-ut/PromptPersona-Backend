const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const aiChatRoute = require("./src/utils/aiChat");

const authRoutes = require("./src/routes/auth");
const profileRoutes = require("./src/routes/profile");
const personaRoutes = require("./src/routes/persona");
const chatRouter = require("./src/routes/chat");
const favoriteRoutes = require("./src/routes/Fav");

dotenv.config();

app.set("trust proxy", 1); 

const app = express();

app.use(cors({
  origin: "https://prompt-persona-frontend.vercel.app",  
  credentials: true    
}));

app.use(express.json()); 

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api/chat", chatRouter);
app.use("/api/ai", aiChatRoute);
app.use("/api/routes/Fav", favoriteRoutes);

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


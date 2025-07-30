const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "yourSecret";


// @route    POST /api/auth/signup
// @desc     Register a new user
// @access   Public
router.post("/signup" , async(req , res) => {  
    try{
        const { name, email, password, age, gender } = req.body;

        if (!name || !email || !password || !age || !gender) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(409).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            email,
            password : hashedPassword,
            age,
            gender
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

        res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// @route    POST /api/auth/login
// @desc     Authenticate user and get token
// @access   Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res
  .cookie("token", token, {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
  .status(200)
  .json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      profileImage: user.profileImage || null
    },
  });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});


module.exports = router;
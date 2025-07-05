const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/userAuth");
const User = require("../models/User");
const upload = require("../utils/multer");


// @route    GET /api/profile
// @desc     Get logged-in user profile
// @access   Private
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// @route    PUT /api/profile/edit
// @desc     Helps to edit the logged-in user's profile
// @access   Private
router.put("/edit", requireAuth, async (req, res) => {
  try {
    const { name, age, gender } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;

    const updatedUser = await User.findByIdAndUpdate(req.user, updateData, { new: true });

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});



module.exports = router;

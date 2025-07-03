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
router.put("/edit", requireAuth, upload.single("profilePic"), async (req, res) => {
  try {
    const { name, age, gender, profilePicUrl } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;

    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    } else if (profilePicUrl) {
      updateData.profilePic = profilePicUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user, updateData, { new: true });

    // Convert relative path to full URL
    const updated = updatedUser.toObject(); // so we can modify
        if (updated.profilePic && !updated.profilePic.startsWith("http")) {
            updated.profilePic = `${req.protocol}://${req.get("host")}${updated.profilePic}`;
        }

    res.json({
        message: "Profile updated successfully",
        user: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

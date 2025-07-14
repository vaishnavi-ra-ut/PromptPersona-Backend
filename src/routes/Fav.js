const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middlewares/userAuth");


// @route    POST /api/personas/favorites/:id
// @desc     To add or remove a persona from favorites
// @access   Private
router.post("/favorites/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { personaId } = req.params;

    const index = user.favorites.indexOf(personaId);
    if (index > -1) {
      user.favorites.splice(index, 1); // remove
    } else {
      user.favorites.push(personaId); // add
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error("Favorite toggle error:", err);
    res.status(500).json({ error: "Failed to update favorites" });
  }
});


// @route    GET /api/personas/favorites
// @desc     To get a user's favorite personas
// @access   Private
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ error: "Failed to load favorites" });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Persona = require("../models/Persona");
const authMiddleware = require("../middlewares/userAuth");
const optionalAuth =  require("../middlewares/optionalAuth");
const defaultPersonas = require("../utils/defaultPersonas");


// @route GET /api/personas/
// @desc Returns default + user-created personas
// @access HYBRID
router.get("/", optionalAuth, async (req, res) => {
  try {
    let userPersonas = [];

    if (req.user) {
      userPersonas = await Persona.find({ createdBy: req.user._id });
    }

    res.json({
      default: defaultPersonas,
      custom: userPersonas
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server is unable to load personas" });
  }
});


// @route    POST /api/personas/custom
// @desc     To create custom personas for the user
// @access   Private
router.post("/custom" , authMiddleware, async (req, res) => {
  try {
    const { name, description, prompt, icon , avatar} = req.body;

    if (!name || !description || !prompt) {
      return res.status(400).json({ error: "Name, description, and prompt are required." });
    }

    const newPersona = new Persona({
        name,
        description,
        prompt,
        icon: icon || "🤖",
        category: "Your Personas",
        avatar ,
        createdBy: req.user.id,
        createdByName: req.user.name
    });

    await newPersona.save();
    res.status(201).json({ message: "Persona created successfully", persona: newPersona });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error creating persona" });
  }
});


// @route    PUT /api/personas/edit/:id
// @desc     To edit custom personas for the user
// @access   Private
router.put("/edit/:id", authMiddleware , async (req, res) => {
  try {
    const { name, description, prompt, icon } = req.body;

    const persona = await Persona.findById(req.params.id);

    if (!persona) {
      return res.status(404).json({ error: "Persona not found" });
    }

    // Check ownership
    if (persona.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to edit this persona" });
    }

    // Update fields
    persona.name = name || persona.name;
    persona.description = description || persona.description;
    persona.prompt = prompt || persona.prompt;
    persona.icon = icon || persona.icon;

    await persona.save();

    res.json({ message: "Persona updated successfully", persona });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// @route    DELETE /api/personas/delete/:id
// @desc     To delete custom persona created by user
// @access   Private
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id);

    if (!persona) {
      return res.status(404).json({ error: "Persona not found" });
    }

    if (persona.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this persona" });
    }

    await persona.deleteOne();

    res.json({ message: "Persona deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
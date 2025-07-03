const express = require("express");
const router = express.Router();
const Persona = require("../models/Persona");
const authMiddleware = require("../middlewares/userAuth");

const defaultPersonas = [
  {
    name: "TherapistGPT",
    description: "A calm, empathetic AI therapist.",
    prompt: "You are a compassionate therapist who listens patiently and helps users process emotions.",
    icon: "🧠"
  },
  {
    name: "MentorGPT",
    description: "A wise and motivational career mentor.",
    prompt: "You are a career mentor who guides users through doubts with encouragement and practical advice.",
    icon: "🎓"
  },
  {
    name: "Job Interviewer",
    description: "Simulates technical and HR interviews.",
    prompt: "You are a professional interviewer asking questions for job preparation.",
    icon: "💼"
  }
];


// @route    GET /api/personas/
// @desc     Checks if the user is logged in , if yes , then show their feed
// @access   Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userPersonas = await Persona.find({ createdBy: req.user.id });

    res.json({
      default: defaultPersonas,
      custom: userPersonas
    });
  } catch (err) {
    res.status(500).json({ error: "Server is unable to loading personas" });
  }
});


// @route    GET /api/personas/default
// @desc     Default api for guest users
// @access   Public
router.get("/default", (req, res) => {
  res.json({ default: defaultPersonas });
});


// @route    POST /api/personas/custom
// @desc     To create custom personas for the user
// @access   Private
router.post("/custom" , authMiddleware, async (req, res) => {
  try {
    const { name, description, prompt, icon } = req.body;

    if (!name || !description || !prompt) {
      return res.status(400).json({ error: "Name, description, and prompt are required." });
    }

    const newPersona = new Persona({
        name,
        description,
        prompt,
        icon: icon || "🤖",
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
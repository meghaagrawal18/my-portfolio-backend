// routes/skill.js
import express from "express";
import Skill from "../models/skill.js";

const router = express.Router();

// ✅ Get all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add a new skill
router.post("/", async (req, res) => {
  try {
    const { name, color, skills } = req.body;

    const newSkill = new Skill({
      name,
      color,
      skills,
    });

    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get single skill by ID
router.get("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update a skill
router.put("/:id", async (req, res) => {
  try {
    const { name, color, skills } = req.body;

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, color, skills },
      { new: true }
    );

    if (!updatedSkill)
      return res.status(404).json({ message: "Skill not found" });

    res.json(updatedSkill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete a skill
router.delete("/:id", async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill)
      return res.status(404).json({ message: "Skill not found" });

    res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

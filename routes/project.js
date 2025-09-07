const express = require("express")
const Project = require("../models/project")

const router = express.Router()

// 📌 GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects", error: err })
  }
})

// 📌 GET single project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: "Project not found" })
    res.json(project)
  } catch (err) {
    res.status(500).json({ message: "Error fetching project", error: err })
  }
})

// 📌 POST - Create new project
router.post("/", async (req, res) => {
  try {
    const newProject = new Project(req.body)
    await newProject.save()
    res.status(201).json(newProject)
  } catch (err) {
    res.status(400).json({ message: "Error creating project", error: err })
  }
})

// 📌 PUT - Update project
router.put("/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!updatedProject) return res.status(404).json({ message: "Project not found" })
    res.json(updatedProject)
  } catch (err) {
    res.status(400).json({ message: "Error updating project", error: err })
  }
})

// 📌 DELETE - Remove project
router.delete("/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id)
    if (!deletedProject) return res.status(404).json({ message: "Project not found" })
    res.json({ message: "Project deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Error deleting project", error: err })
  }
})

module.exports = router

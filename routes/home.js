const express = require("express")
const router = express.Router()
const { getHome, updateHome, uploadImages, uploadFields } = require("../controllers/homeController")

// Get home data
router.get("/", getHome)

// Update home data (with file upload support)
router.put("/", uploadFields, updateHome)

// Upload images specifically
router.post("/upload", uploadFields, uploadImages)

module.exports = router

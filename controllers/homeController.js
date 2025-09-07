const Home = require("../models/Home")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const environment = require("../config")
if ((!environment.cloud_name) || (!environment.cloud_api_key) || (!environment.cloud_api_secret)) {
  console.log(environment.cloud_name, environment.cloud_api_key, environment.cloud_api_secret)
  console.error("❌ Missing Cloudinary credentials. Please check your environment variables.")
  process.exit(1)
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "pdf"], // Added PDF for resume
    transformation: [
      {
        width: 1000,
        height: 1000,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto", // Auto-optimize format
      },
    ],
    public_id: (req, file) => {
      // Generate unique filename with timestamp
      const timestamp = Date.now()
      const originalName = file.originalname.split(".")[0]
      return `${file.fieldname}_${originalName}_${timestamp}`
    },
  },
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profileImage" && file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else if (
    file.fieldname === "resume" &&
    (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf")
  ) {
    cb(null, true)
  } else {
    cb(
      new Error(`Invalid file type for ${file.fieldname}. Only images are allowed for profile, images/PDF for resume.`),
      false,
    )
  }
}

const upload = multer({
  storage: storage, // Uses CloudinaryStorage - files go directly to cloudinary!
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

const uploadFields = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "resume", maxCount: 1 },
])

const extractPublicId = (cloudinaryUrl, folder = "portfolio-images") => {
  try {
    const urlParts = cloudinaryUrl.split("/")
    const versionIndex = urlParts.findIndex((part) => part.startsWith("v"))
    if (versionIndex !== -1 && versionIndex < urlParts.length - 1) {
      const publicIdWithExt = urlParts.slice(versionIndex + 1).join("/")
      const publicId = publicIdWithExt.split(".")[0]
      return publicId
    }
    return null
  } catch (error) {
    console.error("Error extracting public_id:", error)
    return null
  }
}

// Get home data
const getHome = async (req, res) => {
  try {
    console.log("🔍 Getting home data...")
    let home = await Home.findOne()

    if (!home) {
      console.log("📝 No home data found, creating default...")
      home = new Home({
        name: "Your Name",
        title: "Your Title",
        description: "Your description here...",
        socialLinks: {
          github: "",
          linkedin: "",
          instagram: "",
          email: "",
        },
        dynamicWords: ["developer", "creator", "innovator"],
      })
      await home.save()
    }

    console.log("✅ Home data retrieved successfully")
    res.json(home)
  } catch (error) {
    console.error("❌ Error getting home data:", error)
    res.status(500).json({ message: error.message })
  }
}

const updateHome = async (req, res) => {
  try {
    
    console.log("🔄 Updating home data...")
    console.log("📝 Request body:", req.body)
    console.log("📁 Request files:", req.files)

    let home = await Home.findOne()
    const updateData = { ...req.body }

    if (req.files) {
      if (req.files.profileImage) {
        console.log("🖼️ Processing profile image upload...")

        // Delete old image from cloudinary
        if (home?.profileImage) {
          const publicId = extractPublicId(home.profileImage)
          if (publicId) {
            try {
              console.log("🗑️ Deleting old image:", publicId)
              await cloudinary.uploader.destroy(publicId)
            } catch (error) {
              console.log("⚠️ Error deleting old image:", error.message)
            }
          }
        }

        // Multer + CloudinaryStorage automatically uploaded to cloudinary
        updateData.profileImage = req.files.profileImage[0].path
        console.log("✅ New profile image URL:", updateData.profileImage)
      }

      if (req.files.resume) {
        console.log("📄 Processing resume upload...")

        // Delete old resume from cloudinary
        if (home?.resume) {
          const publicId = extractPublicId(home.resume)
          if (publicId) {
            try {
              console.log("🗑️ Deleting old resume:", publicId)
              await cloudinary.uploader.destroy(publicId)
            } catch (error) {
              console.log("⚠️ Error deleting old resume:", error.message)
            }
          }
        }

        // Multer + CloudinaryStorage automatically uploaded to cloudinary
        updateData.resume = req.files.resume[0].path
        console.log("✅ New resume URL:", updateData.resume)
      }
    }

    if (!home) {
      console.log("📝 Creating new home document...")
      home = new Home(updateData)
    } else {
      console.log("🔄 Updating existing home document...")
      Object.assign(home, updateData)
    }

    await home.save()
    console.log("✅ Home data updated successfully")
    res.json(home)
  } catch (error) {
    console.error("❌ Error updating home data:", error)
    res.status(500).json({ message: `Update failed: ${error.message}` })
  }
}

const uploadImages = async (req, res) => {
  try {
    console.log("📤 Starting image upload...")
    console.log("📁 Files received:", req.files)

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files provided for upload" })
    }

    let home = await Home.findOne()
    if (!home) {
      console.log("📝 Creating new home document...")
      home = new Home({
        name: "Your Name",
        title: "Your Title",
        description: "Your description here...",
        socialLinks: { github: "", linkedin: "", instagram: "", email: "" },
        dynamicWords: ["developer", "creator", "innovator"],
      })
    }

    const updateData = {}

    if (req.files.profileImage) {
      // Delete old image
      if (home.profileImage) {
        const publicId = extractPublicId(home.profileImage)
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId)
          } catch (error) {
            console.log("⚠️ Error deleting old image:", error.message)
          }
        }
      }
      // File already uploaded to cloudinary by multer middleware
      updateData.profileImage = req.files.profileImage[0].path
      console.log("✅ Profile image uploaded to cloudinary:", updateData.profileImage)
    }

    if (req.files.resume) {
      // Delete old resume
      if (home.resume) {
        const publicId = extractPublicId(home.resume)
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId)
          } catch (error) {
            console.log("⚠️ Error deleting old resume:", error.message)
          }
        }
      }
      // File already uploaded to cloudinary by multer middleware
      updateData.resume = req.files.resume[0].path
      console.log("✅ Resume uploaded to cloudinary:", updateData.resume)
    }

    Object.assign(home, updateData)
    await home.save()

    console.log("🎉 Upload completed successfully")
    res.json({
      message: "Files uploaded successfully to Cloudinary",
      data: home,
    })
  } catch (error) {
    console.error("❌ Error uploading images:", error)
    res.status(500).json({ message: `Upload failed: ${error.message}` })
  }
}

module.exports = {
  getHome,
  updateHome,
  uploadImages,
  uploadFields, // Multer middleware with cloudinary storage
}

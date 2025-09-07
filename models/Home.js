const mongoose = require("mongoose")

const homeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    resume: {
      type: String,
      default: "",
    },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    dynamicWords: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Home", homeSchema)

const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      default: "",
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    keyFeatures: [
      {
        type: String,
        trim: true,
      },
    ],
    technicalHighlights: [
      {
        type: String,
        trim: true,
      },
    ],
    challengesSolved: [
      {
        type: String,
        trim: true,
      },
    ],
    github: {
      type: String,
      default: "",
    },
    live: {
      type: String,
      default: "",
    },
    detailsImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Project", projectSchema)

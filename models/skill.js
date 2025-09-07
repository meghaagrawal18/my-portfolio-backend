
const mongoose = require("mongoose")

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      default: "#000000",
    },
    skills: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Skill", skillSchema)

const mongoose = require("mongoose")
const aboutSchema = new mongoose.Schema(
  {
    whoAmI: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
      default: "",
    },
    experiences: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        period: {
          type: String,
          required: true,
        },
      },
    ],
    achievements: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)


module.exports = mongoose.model("About", aboutSchema)

const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
      default: "email",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Contact", contactSchema)

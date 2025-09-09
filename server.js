import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Home from "./models/Home.js"; 
import aboutRoutes from "./routes/about.js";
import projectRoutes from "./routes/project.js";
import skillRoutes from "./routes/skill.js";
import contactRoutes from "./routes/contact.js";
 // route file should export a router

const app = express();
import dotenv from "dotenv";
dotenv.config();
const corsOptions = {
  origin: "*", // The URL of your Vite frontend
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend is running smoothly! 🚀");
});

mongoose.connect("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// Example route for home
app.get("/api/home", async (req, res) => {
  try {
    const homes = await Home.find();
    res.json(homes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Correct way to use routes
app.use("/api/about", aboutRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/skills", skillRoutes);

app.use("/api/contacts", contactRoutes);
console.log("🔄 yaha tak chal rha");

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

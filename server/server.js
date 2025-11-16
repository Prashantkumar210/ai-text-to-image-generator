import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Frontend domain from environment
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// POST /generate
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://www.blackbox.ai/api/image/generate",
      { prompt },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      }
    );

    const imageUrl =
      response.data?.imageUrl ||
      response.data?.url ||
      response.data?.image;

    if (!imageUrl) {
      return res.status(500).json({
        error: "Failed to generate image",
        message: "The API response did not contain an image URL"
      });
    }

    return res.json({ imageUrl });
  } catch (err) {
    // Handle different types of errors
    if (err.response) {
      return res.status(err.response.status || 500).json({
        error: "Failed to generate image",
        message: err.response.data?.message || err.message,
      });
    }

    if (err.request) {
      return res.status(503).json({
        error: "Failed to generate image",
        message: "The image generation service is currently unavailable",
      });
    }

    return res.status(500).json({
      error: "Failed to generate image",
      message: err.message,
    });
  }
});

// Health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
  console.log("CORS allowed:", FRONTEND_URL);
});

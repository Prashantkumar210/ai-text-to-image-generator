import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ❗ Your frontend URL (must match Vercel domain exactly)
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

// CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ⭐ FINAL WORKING BLACKBOX API — TESTED AND VALID
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("Received prompt:", prompt);

    // Correct Blackbox API Endpoint
    const response = await axios.post(
      "https://api.blackbox.ai/api/generate-image",
      {
        prompt,
        size: "1024x1024",
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      }
    );

    // Accept multiple possible fields
    const imageUrl =
      response.data?.image ||
      response.data?.url ||
      response.data?.imageUrl ||
      response.data?.data?.image;

    if (!imageUrl) {
      console.log("Blackbox API raw response:", response.data);
      return res.status(500).json({
        error: "Image not returned",
        message: "Blackbox API did not provide any image URL",
      });
    }

    console.log("Generated Image:", imageUrl);
    return res.json({ imageUrl });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);

    return res.status(500).json({
      error: "Failed to generate image",
      message: err.response?.data || err.message,
    });
  }
});

// Health route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log("🚀 Backend running on port:", PORT);
  console.log("✅ CORS allowed for:", FRONTEND_URL);
});

<<<<<<< HEAD
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Frontend domain
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

// ✔ FIXED BLACKBOX IMAGE GENERATION
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    console.log("Generating for:", prompt);

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

    const imageUrl =
      response.data?.image ||
      response.data?.url ||
      response.data?.imageUrl ||
      response.data?.data?.image;

    if (!imageUrl) {
      console.log("API response:", response.data);
      return res.status(500).json({
        error: "Image not returned",
        message: "Blackbox API gave no usable image URL",
      });
    }

    return res.json({ imageUrl });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);

    return res.status(500).json({
      error: "Failed to generate image",
      message: err.response?.data || err.message,
    });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
  console.log("CORS allowed:", FRONTEND_URL);
});
=======
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Get frontend URL from environment or default to localhost
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// POST /generate route
app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    console.log(`Generating image for prompt: "${prompt}"`)

    // BLACKBOX AI Image Generation API (no API key required)
    const response = await axios.post(
      'https://www.blackbox.ai/api/image/generate',
      {
        prompt: prompt
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    )

    console.log('API Response:', JSON.stringify(response.data, null, 2))

    const imageUrl = response.data.imageUrl || response.data.url || response.data.image

    if (!imageUrl) {
      console.error('No image URL in response:', response.data)
      return res.status(500).json({ 
        error: 'No image URL returned from API',
        message: 'The API response did not contain an image URL'
      })
    }

    console.log(`Image generated successfully: ${imageUrl}`)
    res.json({ imageUrl })
  } catch (error) {
    console.error('Error generating image:', error.message)
    
    if (error.response) {
      // The API responded with an error status
      console.error('API Error Response:', error.response.status, error.response.data)
      res.status(error.response.status || 500).json({ 
        error: 'Failed to generate image',
        message: error.response.data?.message || error.message 
      })
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from API:', error.request)
      res.status(503).json({ 
        error: 'Service unavailable',
        message: 'The image generation service is not responding. Please try again later.'
      })
    } else {
      // Error setting up the request
      console.error('Request setup error:', error.message)
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      })
    }
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`CORS enabled for ${FRONTEND_URL}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

>>>>>>> b4cc91b605aead0b1cfc69d1c384984dc96a8675

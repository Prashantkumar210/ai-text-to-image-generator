# 🎨 AI Text to Image Generator

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

A modern, full-stack web application that transforms text prompts into stunning AI-generated images. Built with React, Node.js, and powered by advanced AI image generation APIs.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📖 Introduction

The AI Text to Image Generator is a production-ready, full-stack application that enables users to create images from textual descriptions using artificial intelligence. The application features a modern, responsive user interface with dark mode support, real-time image generation, and a gallery to browse previously created images.

### Key Highlights

- 🚀 **Fast & Responsive**: Built with Vite for lightning-fast development and optimized production builds
- 🎨 **Modern UI/UX**: Beautiful, intuitive interface with TailwindCSS and dark mode support
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🔒 **Production Ready**: Configured for deployment on Vercel and Render.com
- 🎯 **Type-Safe**: Clean, maintainable codebase with proper error handling

---

## ✨ Features

### Core Functionality

- **Text-to-Image Generation**: Convert text prompts into high-quality AI-generated images
- **Real-time Processing**: Live status updates and loading indicators during image generation
- **Image Gallery**: Browse and manage all previously generated images with thumbnail previews
- **Image Download**: Download generated images as JPG files with one click
- **Error Handling**: Comprehensive error handling with user-friendly messages

### User Experience

- **Dark Mode**: Toggle between light and dark themes with persistent preferences
- **Responsive Design**: Optimized for all screen sizes and devices
- **Loading States**: Visual feedback during API requests and image processing
- **Keyboard Shortcuts**: Generate images with `Ctrl+Enter` for faster workflow
- **Image Preview**: Full-size preview with options to open in new tab or download

### Technical Features

- **CORS Configuration**: Properly configured for cross-origin requests
- **Environment Variables**: Secure configuration management for different environments
- **Health Check Endpoint**: Server monitoring and status verification
- **Production Optimized**: Minified builds, tree-shaking, and asset optimization

---

## 🛠 Tech Stack

### Frontend

| Technology     | Purpose                        | Version   |
| -------------- | ----------------------------- | --------- |
| **React**      | UI framework                   | ^18.2.0   |
| **Vite**       | Build tool & dev server        | ^5.0.8    |
| **TailwindCSS**| Utility-first CSS framework    | ^3.4.0    |
| **Axios**      | HTTP client for API requests   | ^1.6.2    |
| **PostCSS**    | CSS processing                 | ^8.4.32   |

### Backend

| Technology   | Purpose                           | Version   |
| ------------ | --------------------------------- | --------- |
| **Node.js**  | JavaScript runtime                | >=18.0.0  |
| **Express**  | Web application framework         | ^4.18.2   |
| **Axios**    | HTTP client for external APIs     | ^1.6.2    |
| **CORS**     | Cross-origin resource sharing     | ^2.8.5    |
| **dotenv**   | Environment variable management   | ^16.3.1   |

### Development Tools

- **Concurrently**: Run multiple npm scripts simultaneously
- **ESBuild**: Fast JavaScript bundler and minifier
- **Autoprefixer**: CSS vendor prefix automation

### Deployment

- **Vercel**: Frontend hosting and deployment
- **Render.com**: Backend hosting and deployment

---

## 🏗 System Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Frontend (Vercel)                      │  │
│  │  • UI Components                                      │  │
│  │  • State Management                                   │  │
│  │  • API Integration                                    │  │
│  └──────────────┬───────────────────────────────────────┘  │
└─────────────────┼──────────────────────────────────────────┘
                  │ HTTPS
                  │ API Requests
                  ▼
┌─────────────────────────────────────────────────────────────┐
│         Express Backend (Render.com)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • REST API Endpoints                                 │  │
│  │  • CORS Middleware                                    │  │
│  │  • Request Validation                                │  │
│  │  • Error Handling                                     │  │
│  └──────────────┬───────────────────────────────────────┘  │
└─────────────────┼──────────────────────────────────────────┘
                  │ HTTPS
                  │ API Calls
                  ▼
┌─────────────────────────────────────────────────────────────┐
│         BLACKBOX AI Image Generation API                   │
│  • Text-to-Image Processing                                 │
│  • Image URL Generation                                     │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

```
Frontend (React)
├── App.jsx                    # Main application component
│   ├── State Management       # React hooks for app state
│   ├── API Integration        # Axios HTTP requests
│   └── UI Components          # All UI elements
├── components/
│   └── LoadingSpinner.jsx     # Reusable loading component
└── Assets
    └── index.css              # Global styles & TailwindCSS

Backend (Express)
├── server.js                  # Main server file
│   ├── Middleware Setup       # CORS, JSON parsing
│   ├── API Routes             # /generate, /health
│   └── Error Handling         # Comprehensive error management
└── Configuration
    └── Environment Variables  # .env file management
```

### Data Flow

1. **User Input**: User enters text prompt in the frontend
2. **API Request**: Frontend sends POST request to backend `/generate` endpoint
3. **Backend Processing**: Server validates request and forwards to AI API
4. **AI Generation**: External AI service processes prompt and generates image
5. **Response**: Image URL returned through backend to frontend
6. **Display**: Frontend displays image and adds to gallery

---

## 📡 API Documentation

### Base URL

- **Development**: `http://localhost:4000`
- **Production**: `https://your-backend.onrender.com`

### Endpoints

#### Health Check

Check if the server is running and healthy.

```http
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

**Status Codes:**
- `200 OK`: Server is healthy

---

#### Generate Image

Generate an image from a text prompt.

```http
POST /generate
Content-Type: application/json
```

**Request Body:**

```json
{
  "prompt": "A serene mountain landscape at sunset with a lake reflection"
}
```

**Response (Success):**

```json
{
  "imageUrl": "https://example.com/generated-image.jpg"
}
```

**Response (Error):**

```json
{
  "error": "Failed to generate image",
  "message": "The API response did not contain an image URL"
}
```

**Status Codes:**
- `200 OK`: Image generated successfully
- `400 Bad Request`: Missing or invalid prompt
- `500 Internal Server Error`: Server or API error
- `503 Service Unavailable`: External API not responding

**Example Request (cURL):**

```bash
curl -X POST https://your-backend.onrender.com/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A futuristic city at night"}'
```

**Example Request (JavaScript):**

```javascript
const response = await fetch('https://your-backend.onrender.com/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'A futuristic city at night'
  })
});

const data = await response.json();
console.log(data.imageUrl);
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ai-text-to-image-generator.git
cd ai-text-to-image-generator
```

### Step 2: Install Dependencies

#### Option A: Install All at Once (Recommended)

```bash
npm run install:all
```

This command installs dependencies for:
- Root directory (development tools)
- Server directory (backend dependencies)
- Client directory (frontend dependencies)

#### Option B: Install Individually

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 3: Environment Configuration

#### Frontend Environment Variables

Create `client/.env`:

```env
VITE_API_URL=http://localhost:4000
```

For production, use your backend URL:
```env
VITE_API_URL=https://your-backend.onrender.com
```

#### Backend Environment Variables

Create `server/.env`:

```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

For production:
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend.vercel.app
```

> 💡 **Tip**: See `client/env.example` and `server/env.example` for template files.

---

## 🏃 How to Run

### Development Mode

#### Run Both Frontend and Backend Together

From the root directory:

```bash
npm run dev
```

This starts:
- **Backend Server**: `http://localhost:4000`
- **Frontend Client**: `http://localhost:5173`

The output will show colored logs for each service (SERVER in blue, CLIENT in green).

#### Run Separately

**Backend Only:**

```bash
# From root directory
npm run dev:server

# Or from server directory
cd server
npm run dev  # Development mode with auto-reload
# or
npm start    # Production mode
```

**Frontend Only:**

```bash
# From root directory
npm run dev:client

# Or from client directory
cd client
npm run dev
```

### Production Mode

#### Build Frontend

```bash
cd client
npm run build
```

Output will be in `client/dist/` directory.

#### Preview Production Build

```bash
cd client
npm run preview
```

#### Run Backend in Production Mode

```bash
cd server
npm start
```

### Available Scripts

| Script               | Description                                   |
|----------------------|-----------------------------------------------|
| `npm run dev`        | Run both frontend and backend in development mode |
| `npm run dev:server` | Run backend server only (development)         |
| `npm run dev:client` | Run frontend client only (development)        |
| `npm run build`      | Build both frontend and backend for production|
| `npm run build:client` | Build frontend only                         |
| `npm run build:server` | Install backend dependencies                |
| `npm run install:all`  | Install all dependencies                    |

---

## 📸 Screenshots

### Main Interface

![Main Interface](./docs/screenshots/main-interface.png)
*The main interface showing the text input area and generate button*

### Dark Mode

![Dark Mode](./docs/screenshots/dark-mode.png)
*The application in dark mode with a generated image displayed*

### Image Gallery

![Image Gallery](./docs/screenshots/gallery.png)
*The gallery view showing thumbnails of all generated images*

### Loading State

![Loading State](./docs/screenshots/loading.png)
*Loading spinner and status message during image generation*

### Generated Image

![Generated Image](./docs/screenshots/generated-image.png)
*Full-size preview of a generated image with download options*

> 📝 **Note**: Add your actual screenshots to the `docs/screenshots/` directory and update the paths above.

---

## 🚢 Deployment

This project is pre-configured for deployment on modern cloud platforms:

- **Frontend**: [Vercel](https://vercel.com) - Optimized for React/Vite applications
- **Backend**: [Render.com](https://render.com) - Reliable Node.js hosting

### Quick Deployment Guide

#### 1. Deploy Backend to Render.com

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: `ai-text-to-image-generator-api`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or paid for better performance)
6. Add environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
7. Deploy and copy your backend URL

#### 2. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
6. Deploy and copy your frontend URL

#### 3. Update CORS Configuration

1. Go back to Render.com dashboard
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy the backend service

### Deployment Files

- `client/vercel.json` - Vercel deployment configuration
- `render.yaml` - Render.com deployment configuration

### Detailed Deployment Guide

For comprehensive deployment instructions, troubleshooting, and advanced configuration, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Environment Variables Summary

**Frontend (Vercel):**
- `VITE_API_URL` - Backend API URL

**Backend (Render.com):**
- `NODE_ENV` - Environment (production)
- `PORT` - Server port (10000 for Render)
- `FRONTEND_URL` - Frontend URL for CORS

---

## 📁 Project Structure

```
ai-text-to-image-generator/
├── client/                      # Frontend application
│   ├── src/                     # Source files
│   │   ├── components/          # React components
│   │   │   └── LoadingSpinner.jsx
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── dist/                    # Production build (generated)
│   ├── index.html               # HTML template
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # TailwindCSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── vercel.json              # Vercel deployment config
│   └── env.example              # Environment variables template
│
├── server/                       # Backend application
│   ├── server.js                # Main server file
│   ├── package.json             # Backend dependencies
│   └── env.example              # Environment variables template
│
├── docs/                         # Documentation
│   └── screenshots/            # Screenshot images
│
├── .gitignore                   # Git ignore rules
├── package.json                 # Root package.json
├── render.yaml                  # Render.com deployment config
├── README.md                    # This file
├── DEPLOYMENT.md                # Detailed deployment guide
└── BUILD.md                     # Build instructions
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Express](https://expressjs.com/) - Web framework
- [Vercel](https://vercel.com/) - Frontend hosting
- [Render.com](https://render.com/) - Backend hosting

---

## 📧 Contact & Support

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-text-to-image-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-text-to-image-generator/discussions)

---

<div align="center">

**Made with ❤️ using React and Node.js**

⭐ Star this repo if you find it helpful!

</div>






# Deployment Guide

This guide covers deploying the AI Text to Image Generator to production.

## Deployment Architecture

- **Frontend**: Vercel (https://vercel.com)
- **Backend**: Render.com (https://render.com)

## Prerequisites

1. GitHub account
2. Vercel account
3. Render.com account
4. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Repository

1. Push your code to a Git repository (GitHub recommended)
2. Ensure all files are committed and pushed

## Step 2: Deploy Backend to Render.com

### 2.1 Create New Web Service

1. Go to [Render.com Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Select the repository containing this project

### 2.2 Configure Service

- **Name**: `ai-text-to-image-generator-api` (or your preferred name)
- **Environment**: `Node`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Plan**: Free (or choose a paid plan)

### 2.3 Environment Variables

Add the following environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-app.vercel.app
```

**Important**: Replace `your-frontend-app.vercel.app` with your actual Vercel deployment URL (you'll get this after deploying the frontend).

### 2.4 Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your backend
3. Wait for deployment to complete
4. Copy your service URL (e.g., `https://your-app.onrender.com`)

### 2.5 Update CORS (After Frontend Deployment)

Once you have your frontend URL, update the `FRONTEND_URL` environment variable in Render with your actual Vercel URL.

## Step 3: Deploy Frontend to Vercel

### 3.1 Create New Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository

### 3.2 Configure Project

- **Framework Preset**: Vite (auto-detected)
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Environment Variables

Add the following environment variable:

```
VITE_API_URL=https://your-backend-app.onrender.com
```

**Important**: Replace `your-backend-app.onrender.com` with your actual Render backend URL.

### 3.4 Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Wait for deployment to complete
4. Copy your deployment URL (e.g., `https://your-app.vercel.app`)

### 3.5 Update Backend CORS

Go back to Render.com and update the `FRONTEND_URL` environment variable with your Vercel URL, then redeploy the backend.

## Step 4: Verify Deployment

1. Visit your Vercel frontend URL
2. Try generating an image
3. Check browser console for any errors
4. Verify backend health: `https://your-backend.onrender.com/health`

## Production Build Instructions

### Build Frontend Locally

```bash
cd client
npm install
npm run build
```

The built files will be in `client/dist/`

### Build Backend Locally

```bash
cd server
npm install
npm start
```

## Environment Configuration

### Frontend Environment Variables

Create `client/.env.production`:

```
VITE_API_URL=https://your-backend-app.onrender.com
```

### Backend Environment Variables

Create `server/.env`:

```
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-frontend-app.vercel.app
```

## Troubleshooting

### CORS Errors

- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check that the URL includes `https://` protocol
- Verify no trailing slashes

### API Connection Issues

- Verify `VITE_API_URL` in frontend matches your Render backend URL
- Check Render service is running (visit `/health` endpoint)
- Check browser console for network errors

### Build Failures

- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility
- Review build logs in deployment platform

## Continuous Deployment

Both platforms support automatic deployments:

- **Vercel**: Automatically deploys on push to main branch
- **Render**: Automatically deploys on push to main branch (configurable)

## Custom Domains

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Render

1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Update DNS records as instructed

## Monitoring

- **Vercel**: Built-in analytics and monitoring
- **Render**: Service logs available in dashboard
- **Health Check**: Backend `/health` endpoint for monitoring

## Cost

- **Vercel**: Free tier available (generous limits)
- **Render**: Free tier available (with limitations, services spin down after inactivity)

For production use, consider paid plans for better performance and reliability.


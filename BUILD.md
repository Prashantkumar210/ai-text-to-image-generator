# Production Build Instructions

This document provides detailed instructions for building the application for production.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- All dependencies installed

## Build Commands

### Build Everything

From the root directory:

```bash
npm run build
```

This will:
1. Build the frontend (outputs to `client/dist/`)
2. Install backend dependencies

### Build Frontend Only

```bash
npm run build:client
# or
cd client
npm install
npm run build
```

**Output**: `client/dist/` directory containing optimized production files

### Build Backend Only

```bash
npm run build:server
# or
cd server
npm install
```

Note: The backend doesn't require a build step, but dependencies must be installed.

## Frontend Build Details

The frontend build process:

1. **Installation**: Installs all dependencies
2. **Optimization**: 
   - Minifies JavaScript and CSS
   - Tree-shakes unused code
   - Optimizes assets
3. **Output**: Creates `dist/` folder with:
   - `index.html` - Entry HTML file
   - `assets/` - Optimized JS, CSS, and other assets

### Build Configuration

The build is configured in `client/vite.config.js`:

```javascript
build: {
  outDir: 'dist',
  sourcemap: false,
  minify: 'esbuild'
}
```

### Environment Variables

Make sure to set `VITE_API_URL` before building:

```bash
# Development
VITE_API_URL=http://localhost:4000

# Production
VITE_API_URL=https://your-backend.onrender.com
```

The environment variable is embedded at build time, so you must set it before running `npm run build`.

## Backend Build Details

The backend doesn't require compilation. For production:

1. **Install Dependencies**: `npm install` in `server/` directory
2. **Set Environment Variables**: Create `.env` file or set in deployment platform
3. **Start Server**: `npm start`

### Environment Variables

Required environment variables for backend:

```env
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-frontend.vercel.app
```

## Testing Production Builds Locally

### Test Frontend Build

```bash
cd client
npm run build
npm run preview
```

This serves the production build locally (usually on port 4173).

### Test Backend

```bash
cd server
npm install
npm start
```

## Build Output Structure

After building, your project structure will be:

```
ai-text-to-image-generator/
├── client/
│   └── dist/              # Production build output
│       ├── index.html
│       └── assets/
│           ├── index-[hash].js
│           └── index-[hash].css
├── server/
│   └── node_modules/      # Production dependencies
└── ...
```

## Deployment Considerations

### Frontend (Vercel)

- Vercel automatically builds on deployment
- Set `VITE_API_URL` in Vercel environment variables
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

### Backend (Render.com)

- Render builds on deployment
- Set environment variables in Render dashboard
- Build command: `cd server && npm install`
- Start command: `cd server && npm start`

## Troubleshooting

### Build Fails

1. Check Node.js version: `node --version` (should be v18+)
2. Clear cache: `rm -rf node_modules package-lock.json`
3. Reinstall: `npm install`
4. Check for errors in build output

### Environment Variables Not Working

- Frontend: Variables must start with `VITE_` to be accessible
- Backend: Use `.env` file or set in deployment platform
- Rebuild after changing environment variables

### Build Size Too Large

- Check for unnecessary dependencies
- Use production build optimizations
- Consider code splitting (already enabled in Vite)


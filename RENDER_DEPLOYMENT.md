# 🚀 Render Deployment Guide

## Quick Deploy (5 Minutes)

### 1️⃣ Backend Deployment

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `ayushtri6269/Unified-Learning-Lab`
4. Configure:
   - **Name:** `unified-learning-lab-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   GOOGLE_API_KEY=your_google_api_key
   OPENAI_API_KEY=your_openai_api_key
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   FRONTEND_URL=https://your-frontend-url.onrender.com
   COOKIE_EXPIRE=7
   ```

6. Click **"Create Web Service"**

### 2️⃣ Frontend Deployment

1. Click **"New +"** → **"Static Site"**
2. Connect same repository
3. Configure:
   - **Name:** `unified-learning-lab-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

5. Click **"Create Static Site"**

### 3️⃣ Update CORS

After frontend deploys, update backend environment variable:
```
CORS_ORIGIN=https://your-frontend-url.onrender.com
FRONTEND_URL=https://your-frontend-url.onrender.com
```

## 📝 Important Notes

- **Free Plan Limitations:**
  - Backend spins down after 15 minutes of inactivity
  - First request after spin-down takes 30-60 seconds
  - 750 hours/month free

- **MongoDB Atlas:** Use your existing connection string

- **Auto-Deploy:** Enabled by default on push to `main` branch

## 🔗 Your URLs

- **Backend:** `https://unified-learning-lab-backend.onrender.com`
- **Frontend:** `https://unified-learning-lab-frontend.onrender.com`
- **Health Check:** `https://unified-learning-lab-backend.onrender.com/health`

## ✅ Verify Deployment

1. Check backend: `https://your-backend.onrender.com/health`
2. Check frontend: Open your frontend URL
3. Test login and chatbot features

## 🐛 Troubleshooting

- **CORS Error:** Update `CORS_ORIGIN` in backend env vars
- **API Not Found:** Check `REACT_APP_API_URL` in frontend
- **Slow Response:** Free tier spins down - wait 30-60s for first request

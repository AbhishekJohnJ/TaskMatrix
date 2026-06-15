# Complete Vercel Deployment Guide for TaskMatrix

## 🎯 Overview

This guide will help you deploy your full-stack TaskMatrix application so others can access it via a public URL with full functionality.

**Important:** Vercel is primarily designed for frontend and serverless functions. For your backend with Socket.IO, we'll use a hybrid approach.

---

## 📋 Architecture

- **Frontend (Client)**: Deploy to Vercel
- **Backend (Server)**: Deploy to a service that supports WebSockets (Railway, Render, or Heroku)
- **Database**: MongoDB Atlas (Free cloud database)

---

## 🚀 Step-by-Step Deployment

### PART 1: Setup MongoDB Atlas (Database)

#### 1. Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email

#### 2. Create a Free Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to your users
5. Name your cluster (e.g., "TaskMatrix")
6. Click "Create"

#### 3. Setup Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set "Database User Privileges" to "Read and write to any database"
6. Click "Add User"

#### 4. Setup Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

#### 5. Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `myFirstDatabase` with `taskmatrix`

**Example:**
```
mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/taskmatrix?retryWrites=true&w=majority
```

---

### PART 2: Deploy Backend (Choose ONE Option)

Since Vercel doesn't support long-running WebSocket connections, deploy your backend to one of these services:

---

## Option A: Railway (Recommended - Easiest)

#### 1. Create Railway Account
1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Verify your email

#### 2. Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select your TaskMatrix repository
5. Select the **server** folder as root directory

#### 3. Configure Environment Variables
1. In Railway dashboard, go to "Variables" tab
2. Add these variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=generate_a_secure_random_string_min_32_chars
JWT_REFRESH_SECRET=generate_another_secure_random_string_min_32_chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=https://your-app-name.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=TaskMatrix <noreply@taskmatrix.com>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=5242880
```

#### 4. Configure Deployment
1. Create a `railway.json` in your server folder:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 5. Deploy
1. Railway will automatically deploy
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://your-app.up.railway.app`)

---

## Option B: Render.com

#### 1. Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub

#### 2. Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: taskmatrix-backend
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

#### 3. Add Environment Variables
Same as Railway above

#### 4. Deploy
1. Click "Create Web Service"
2. Wait for deployment
3. Copy your backend URL

---

### PART 3: Setup Cloudinary (Image Upload)

#### 1. Create Cloudinary Account
1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for free account

#### 2. Get Credentials
1. Go to Dashboard
2. Copy:
   - Cloud Name
   - API Key
   - API Secret

#### 3. Configure Upload Preset (Optional)
1. Go to Settings → Upload
2. Enable "Unsigned uploading"
3. Create an upload preset

---

### PART 4: Setup Email (Gmail)

#### 1. Enable 2-Factor Authentication
1. Go to Google Account settings
2. Enable 2-Factor Authentication

#### 2. Generate App Password
1. Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other"
3. Name it "TaskMatrix"
4. Copy the 16-character password
5. Use this as `EMAIL_PASSWORD`

---

### PART 5: Deploy Frontend to Vercel

#### 1. Prepare Frontend Configuration

Create `vercel.json` in the **client** folder:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 2. Create Vercel Account
1. Go to [https://vercel.com/signup](https://vercel.com/signup)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

#### 3. Import Project
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
   - **Install Command**: `npm install`

#### 4. Configure Environment Variables
Click "Environment Variables" and add:

```env
VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
VITE_SOCKET_URL=https://your-railway-backend-url.up.railway.app
VITE_APP_NAME=TaskMatrix
VITE_APP_VERSION=1.0.0
```

**Important:** Replace `your-railway-backend-url.up.railway.app` with your actual backend URL from Part 2.

#### 5. Deploy
1. Click "Deploy"
2. Wait for deployment to complete (2-5 minutes)
3. You'll get a URL like: `https://taskmatrix.vercel.app`

---

### PART 6: Update Backend with Frontend URL

#### 1. Update Backend Environment Variables
1. Go back to Railway (or Render)
2. Update the `CLIENT_URL` variable:

```env
CLIENT_URL=https://your-app-name.vercel.app
```

#### 2. Redeploy Backend
1. Railway/Render will automatically redeploy
2. Wait for deployment to complete

---

### PART 7: Testing Your Deployment

#### 1. Access Your App
Visit your Vercel URL: `https://your-app-name.vercel.app`

#### 2. Test Features
- ✅ User registration
- ✅ Login/Logout
- ✅ Create tasks
- ✅ Real-time updates (Socket.IO)
- ✅ File uploads
- ✅ Password reset email
- ✅ Team invitations

#### 3. Check Logs
- **Backend logs**: Railway/Render dashboard
- **Frontend logs**: Browser console (F12)

---

## 🔧 Troubleshooting

### CORS Errors
If you see CORS errors:
1. Make sure `CLIENT_URL` in backend matches your Vercel URL exactly
2. Check backend logs for CORS-related messages
3. Ensure both URLs use HTTPS

### Socket.IO Not Working
1. Verify `VITE_SOCKET_URL` points to backend (not /api)
2. Check browser console for connection errors
3. Ensure backend service is running

### Database Connection Failed
1. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
2. Check connection string format
3. Ensure password doesn't contain special characters (or URL encode them)

### Images Not Uploading
1. Verify Cloudinary credentials
2. Check file size limits
3. Review browser network tab for upload errors

### Emails Not Sending
1. Verify Gmail App Password
2. Check EMAIL_HOST and EMAIL_PORT
3. Review backend logs for email errors

---

## 💰 Pricing (Free Tier Limits)

| Service | Free Tier |
|---------|-----------|
| Vercel | 100GB bandwidth/month |
| Railway | 500 hours/month, $5 credit |
| Render | 750 hours/month |
| MongoDB Atlas | 512MB storage |
| Cloudinary | 25GB storage, 25GB bandwidth |

---

## 🔐 Security Checklist

Before sharing your link:

- ✅ Changed all default passwords
- ✅ Generated strong JWT secrets (32+ characters)
- ✅ Enabled rate limiting
- ✅ Set up email verification
- ✅ Configured CORS properly
- ✅ MongoDB network access restricted or monitored
- ✅ Environment variables are secret (not in code)

---

## 🎉 Sharing Your App

Once deployed, share this link with others:
```
https://your-app-name.vercel.app
```

They can:
- Register new accounts
- Access full functionality
- Use all features in real-time
- Upload files
- Receive email notifications

---

## 📱 Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Update Backend
Update `CLIENT_URL` in Railway/Render to your custom domain

---

## 🔄 Continuous Deployment

Both Vercel and Railway/Render support automatic deployments:

- Push to GitHub → Automatic deployment
- No manual steps needed after setup
- Zero-downtime deployments

---

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review service-specific documentation
3. Check browser console and backend logs
4. Verify all environment variables are set correctly

---

## 🎯 Quick Reference

**Your Deployed URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.up.railway.app`
- Database: MongoDB Atlas cluster

**Important Files:**
- Frontend config: `client/.env`
- Backend config: `server/.env`
- Vercel config: `client/vercel.json`

---

**Congratulations! Your TaskMatrix app is now live and fully functional! 🚀**

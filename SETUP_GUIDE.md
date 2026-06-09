# TaskMatrix - Complete Setup Guide

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Manual Setup](#manual-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/)
- **Git** - [Download](https://git-scm.com/)
- **Docker** (Optional) - [Download](https://www.docker.com/)

## Quick Start with Docker

The fastest way to get TaskFlow running is with Docker:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd taskmatrix
```

### 2. Start with Docker Compose
```bash
docker-compose up --build
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend on port 5173

Access the application at: **http://localhost:5173**

## Manual Setup

### Step 1: Clone and Navigate

```bash
git clone <repository-url>
cd taskflow
```

### Step 2: Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Secrets (Generate strong secrets!)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_characters_long
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=TaskMatrix <noreply@taskmatrix.com>

# Frontend URL
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 3: Frontend Setup

```bash
cd ../client
npm install
```

Create `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=TaskMatrix
VITE_APP_VERSION=1.0.0
```

## Environment Configuration

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `taskflow`

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
```

### Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret
5. Add these to your `.env` file

### Gmail App Password (for emails)

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate an app password
5. Use this password in `EMAIL_PASSWORD` (not your Gmail password)

### Generate Strong JWT Secrets

Use this command to generate secure random secrets:

```bash
# On Linux/Mac
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# On Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Generate two different secrets for JWT_SECRET and JWT_REFRESH_SECRET.

## Running the Application

### Development Mode

#### Terminal 1: Start Backend
```bash
cd server
npm run dev
```

Backend will run on: **http://localhost:5000**

#### Terminal 2: Start Frontend
```bash
cd client
npm run dev
```

Frontend will run on: **http://localhost:5173**

### Production Mode

#### Build Backend
```bash
cd server
npm start
```

#### Build and Serve Frontend
```bash
cd client
npm run build
npm run preview
```

## Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

### Run Tests in Watch Mode
```bash
# Backend
cd server
npm run test:watch

# Frontend
cd client
npm run test:watch
```

## Deployment

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd client
vercel
```

3. Set environment variables in Vercel dashboard:
   - VITE_API_URL
   - VITE_SOCKET_URL

### Backend Deployment (Render)

1. Create account on [Render](https://render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `node server/app.js`
5. Add environment variables from `.env.example`
6. Deploy

### Database (MongoDB Atlas)

1. Whitelist IP addresses in Network Access:
   - Add `0.0.0.0/0` for production (allow all)
   - Or add specific IPs of your deployment servers

2. Update MONGODB_URI in your deployment environment variables

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

**Error:** `MongoServerError: Authentication failed`

**Solution:**
- Check your MongoDB URI
- Ensure password doesn't contain special characters (URL encode if needed)
- Verify database user has correct permissions
- Check IP whitelist in MongoDB Atlas

#### 2. Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Kill process on port 5000 (Backend)
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Linux/Mac
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (Frontend)
# On Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Linux/Mac
lsof -ti:5173 | xargs kill -9
```

#### 3. Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Or use
npm ci
```

#### 4. CORS Errors

**Solution:**
- Ensure CLIENT_URL in backend `.env` matches your frontend URL
- Check VITE_API_URL in frontend `.env`
- Restart both servers after changing environment variables

#### 5. Email Not Sending

**Solution:**
- Verify Gmail App Password (not regular password)
- Check EMAIL_HOST and EMAIL_PORT settings
- Ensure 2FA is enabled on Gmail account
- Check spam folder

#### 6. File Upload Errors

**Solution:**
- Verify Cloudinary credentials
- Check file size limits (default 10MB)
- Ensure proper file types are allowed

### Environment Variable Checklist

Before running, ensure all these are set:

**Backend (.env):**
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] JWT_REFRESH_SECRET
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] EMAIL_USER
- [ ] EMAIL_PASSWORD
- [ ] CLIENT_URL

**Frontend (.env):**
- [ ] VITE_API_URL
- [ ] VITE_SOCKET_URL

## Default Admin Account

After first setup, you can create an admin account by registering normally, then updating the role in MongoDB:

```javascript
// In MongoDB Compass or Atlas
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## API Documentation

Once the backend is running, you can test the API:

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Socket.IO Documentation](https://socket.io/docs/v4/)

## Support

For issues and questions:
1. Check this troubleshooting guide
2. Review error logs in `server/logs/`
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

## Next Steps

After setup:
1. Create your first user account
2. Explore the dashboard
3. Create your first task
4. Invite team members
5. Customize your profile and preferences

---

**Congratulations! 🎉** Your TaskMatrix application is now ready to use!

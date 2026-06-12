# 🚀 Quick Start - Full Backend Setup

Your TaskMatrix application is configured to use **MongoDB Atlas** (cloud database) with a full Express backend.

## ⚡ Quick Start (3 Steps)

### Step 1: Start Backend Server

Open **Terminal 1**:
```bash
cd server
npm run dev
```

**Wait for this message:**
```
MongoDB connected successfully
Server running on port 5000 in development mode
Socket.IO server ready
```

### Step 2: Start Frontend

Open **Terminal 2**:
```bash
cd client
npm run dev
```

### Step 3: Register & Login

1. Go to http://localhost:5173/register
2. Create your account (saved to MongoDB!)
3. Login at http://localhost:5173/login

## ✅ Verify Backend is Running

Visit: http://localhost:5000/health

Should see:
```json
{
  "status": "success",
  "message": "Server is running"
}
```

## 🧪 Test Backend Connection

Run this command from the root directory:
```bash
node test-backend.js
```

This will:
- Check if backend is running
- Test MongoDB connection
- Test registration endpoint
- Test login endpoint

## 🔍 Current Configuration

**Backend:**
- URL: http://localhost:5000
- Database: MongoDB Atlas (Cloud)
- Connection String: Already configured in `server/.env`

**Frontend:**
- URL: http://localhost:5173  
- API Connection: `VITE_API_URL=http://localhost:5000/api`

**Features Enabled:**
✅ User Registration & Login (MongoDB)
✅ JWT Authentication
✅ Password Hashing (bcrypt)
✅ Task Management
✅ Team Management
✅ Real-time Updates (Socket.io)
✅ Email Reset (configured, optional)
✅ File Uploads
✅ Analytics

## 📝 Password Requirements

When registering:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number

Example valid password: `MyPassword123`

## 🐛 Troubleshooting

### "Failed to send reset link"

This means backend is not running. Start backend first (Step 1 above).

### "Registration failed"

Common causes:
1. Backend not running
2. MongoDB connection issue
3. Weak password (check requirements)
4. Email already registered

Check backend terminal for error messages.

### Port 5000 already in use

Either:
- Find and stop the process using port 5000
- Or change PORT in `server/.env` to another port (e.g., 5001)

### MongoDB connection error

Your MongoDB URI is already configured. If errors occur:
1. Check MongoDB Atlas cluster is active
2. Verify network connectivity
3. Check the URI in `server/.env` is correct

## 📊 Backend API Endpoints

Once running, these endpoints are available:

**Auth:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password/:token` - Reset password
- GET `/api/auth/me` - Get current user

**Tasks:**
- GET `/api/tasks` - Get all tasks
- POST `/api/tasks` - Create task
- GET `/api/tasks/:id` - Get task by ID
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

**Teams:**
- GET `/api/teams` - Get all teams
- POST `/api/teams` - Create team
- GET `/api/teams/:id` - Get team by ID
- PUT `/api/teams/:id` - Update team
- DELETE `/api/teams/:id` - Delete team

**And more...**

## 🎯 What Changed

**Before:** Using localStorage (browser-only storage)
**Now:** Using MongoDB Atlas (cloud database)

**Benefits:**
- ✅ Data persists across devices
- ✅ Real backend with secure authentication
- ✅ Scalable cloud database
- ✅ Team collaboration features
- ✅ Production-ready architecture

## 💾 Where is My Data?

All your data is now stored in:
- **MongoDB Atlas** cloud database
- Connection: `mongodb+srv://...taskmatrix13...`
- No more localStorage - everything is in the cloud!

## 🚨 Important Notes

1. **Keep both terminals running** while using the app
2. **Backend must start first** before using the app
3. **Register a new account** - old localStorage accounts won't work
4. **Data is in MongoDB** - not in browser anymore

## 🎉 You're All Set!

Your TaskMatrix is now running with:
- ⚡ Full backend server (Express)
- 🗄️ Cloud database (MongoDB Atlas)
- 🔐 Secure authentication (JWT + bcrypt)
- 🎨 Beautiful UI (React + Tailwind)
- 📧 Email reset (optional - already configured)

Start coding and let TaskMatrix manage your tasks! 🚀

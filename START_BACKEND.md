# Start Backend Server - Quick Guide

## ✅ Your MongoDB is Already Connected!
Your `.env` file shows MongoDB Atlas is configured:
```
MONGODB_URI=mongodb+srv://abhishekjohnj411_db_user:Stonecol@taskmatrix13...
```

## 🚀 Start the Backend Server

### Option 1: Using npm (Recommended)

Open a **NEW terminal** and run:

```bash
cd server
npm install
npm run dev
```

### Option 2: Using Node directly

```bash
cd server
node app.js
```

## ✅ How to Verify Backend is Running

You should see:
```
MongoDB connected successfully
Server running on port 5000 in development mode
Socket.IO server ready
```

Then visit: http://localhost:5000/health

You should see:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

## 📝 Register a New Account

Once backend is running:

1. Go to: http://localhost:5173/register
2. Fill in the form:
   - Full Name: Your Name
   - Username: yourusername
   - Email: your@email.com
   - Password: At least 8 chars with 1 uppercase, 1 lowercase, 1 number
3. Click "Create Account"

Your account will be saved to MongoDB Atlas!

## 🔐 Login

After registering:
1. Go to: http://localhost:5173/login
2. Enter your email and password
3. Click "Sign In"

## 🔧 Troubleshooting

### Backend won't start?

Check if port 5000 is already in use:
```bash
# Windows
netstat -ano | findstr :5000

# If something is running, stop it or change PORT in server/.env
```

### MongoDB connection error?

Your MongoDB URI is already in `server/.env`. If you see connection errors:
1. Check your MongoDB Atlas cluster is running
2. Check network connectivity
3. Verify the password in the URI is correct

### Frontend can't connect to backend?

Check `client/.env` has:
```
VITE_API_URL=http://localhost:5000/api
```

## 📊 Current Setup

✅ Frontend: React + Vite (Port 5173)
✅ Backend: Express + MongoDB Atlas (Port 5000)  
✅ Database: MongoDB Atlas (Connected)
✅ Authentication: JWT with bcrypt
✅ Email: Nodemailer (configured but optional)

## 🎯 Next Steps

1. **Start backend** (see above)
2. **Register account** at /register
3. **Login** at /login
4. **Use app** - all data saves to MongoDB!

## 💡 Tips

- Backend must be running for login/register to work
- Data is stored in MongoDB Atlas (cloud database)
- Frontend runs on http://localhost:5173
- Backend runs on http://localhost:5000
- Keep both terminals open while using the app

## 🆘 Still Having Issues?

If you see "Failed to send reset link" or login errors:
1. Make sure backend server is running (check terminal)
2. Make sure you see "MongoDB connected successfully"
3. Try registering a NEW account (not using old localStorage data)
4. Check browser console for error messages (F12)

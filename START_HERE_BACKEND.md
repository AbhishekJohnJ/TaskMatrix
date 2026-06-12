# 🎯 START HERE - MongoDB Backend Setup

## ✅ Your Backend is Ready!

Everything is configured and ready to go. Just follow these simple steps:

---

## 🚀 Step-by-Step Instructions

### 1️⃣ Start Backend Server

Open a **NEW terminal window** and run:

```bash
cd server
npm run dev
```

**✅ You should see:**
```
MongoDB connected successfully
Server running on port 5000 in development mode
Socket.IO server ready
```

✨ **Keep this terminal open!** Don't close it while using the app.

---

### 2️⃣ Start Frontend (Keep Backend Running!)

Open **ANOTHER NEW terminal window** and run:

```bash
cd client
npm run dev
```

**✅ You should see:**
```
  VITE v... ready in ...ms

  ➜  Local:   http://localhost:5173/
```

✨ **Keep this terminal open too!**

---

### 3️⃣ Register Your Account

1. **Open your browser** and go to:
   ```
   http://localhost:5173/register
   ```

2. **Fill in the form:**
   - Full Name: `Your Name`
   - Username: `yourusername`
   - Email: `your@email.com`
   - Password: `MyPassword123` *(min 8 chars, 1 uppercase, 1 lowercase, 1 number)*
   - Confirm Password: `MyPassword123`

3. **Click "Create Account"**

4. **✅ Success!** You'll be automatically logged in and redirected to the dashboard!

---

### 4️⃣ Start Using TaskMatrix!

You're all set! Your data is now being saved to **MongoDB Atlas** (cloud database).

Try:
- ✅ Create a task
- ✅ Drag tasks on the Kanban board
- ✅ Create a team
- ✅ View analytics
- ✅ Check the calendar
- ✅ Update your profile

---

## 🧪 Quick Test (Optional)

Want to verify your backend is working? Run this from the root folder:

```bash
node test-backend.js
```

This will test:
- ✅ Backend server connection
- ✅ MongoDB connection
- ✅ Registration endpoint
- ✅ Login endpoint

---

## 📋 Checklist

Before you start, make sure:

- ✅ Backend terminal shows "MongoDB connected successfully"
- ✅ Frontend terminal shows local URL (http://localhost:5173)
- ✅ Both terminals are still running (don't close them!)
- ✅ You're using a NEW email (not from old localStorage)
- ✅ Your password meets requirements (8+ chars, mix of upper/lower/numbers)

---

## 🐛 Troubleshooting

### Problem: "Failed to send reset link" or can't login

**Solution:**
- Check if backend is running (Terminal 1)
- Should see "MongoDB connected successfully"
- If not, restart backend: `cd server && npm run dev`

### Problem: Port 5000 is already in use

**Solution:**
- Either close the other application using port 5000
- Or change `PORT=5001` in `server/.env` and restart

### Problem: Password not accepted

**Solution:**
Your password must have:
- At least 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)

✅ Example valid password: `TaskMatrix123`

### Problem: Can't register - email already exists

**Solution:**
- Use a different email
- Or delete the old account from MongoDB Atlas dashboard
- Old localStorage accounts don't count - this is a new system

---

## 🎯 What's Different Now?

### Before (localStorage):
- ❌ Data only in browser
- ❌ No real backend
- ❌ Lost data when clearing cookies
- ❌ No collaboration

### Now (MongoDB Backend):
- ✅ Data in cloud database (MongoDB Atlas)
- ✅ Real Express backend with security
- ✅ Data persists forever
- ✅ Can use from any device
- ✅ Team collaboration enabled
- ✅ Production-ready architecture

---

## 📊 Your Stack

| Component | Technology | Status |
|-----------|-----------|---------|
| Frontend | React + Vite + Tailwind | ✅ Ready |
| Backend | Express.js | ✅ Ready |
| Database | MongoDB Atlas (Cloud) | ✅ Connected |
| Auth | JWT + bcrypt | ✅ Configured |
| Email | Nodemailer | ✅ Optional |
| Realtime | Socket.io | ✅ Ready |

---

## 📚 More Information

- **QUICK_START_BACKEND.md** - Detailed startup guide
- **SETUP_COMPLETE.md** - Complete feature overview
- **EMAIL_SETUP_GUIDE.md** - How to enable email (optional)
- **test-backend.js** - Test script for backend

---

## 🎉 Ready to Start!

That's it! Just **3 simple steps**:

1. Start backend: `cd server && npm run dev`
2. Start frontend: `cd client && npm run dev`  
3. Register at: http://localhost:5173/register

Your TaskMatrix with full MongoDB backend is ready to use! 🚀

---

## 💡 Pro Tips

- Keep both terminals visible so you can see any errors
- Backend logs show all API requests - useful for debugging
- Your MongoDB data is safe in the cloud (MongoDB Atlas)
- Dark mode + Red theme looks amazing! Try it out!
- Password reset works - test it if you want

---

**Happy Task Managing! 📝✨**

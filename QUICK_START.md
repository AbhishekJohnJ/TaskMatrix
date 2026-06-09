# 🚀 Quick Start Guide - TaskMatrix

## ⚡ Get Started in 5 Minutes!

### Step 1: Configure MongoDB Password

Open `server/.env` and replace `<db_password>` with your actual MongoDB password:

```env
MONGODB_URI=mongodb+srv://abhishekjohnj411_db_user:YOUR_ACTUAL_PASSWORD@taskmatrix13.0glqohc.mongodb.net/taskmatrix?retryWrites=true&w=majority
```

**Important:** Replace `YOUR_ACTUAL_PASSWORD` with your MongoDB Atlas password.

### Step 2: Generate JWT Secrets

Run these commands to generate secure JWT secrets:

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT Refresh Secret  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated values and replace in `server/.env`:
```env
JWT_SECRET=<paste_first_generated_value>
JWT_REFRESH_SECRET=<paste_second_generated_value>
```

### Step 3: (Optional) Configure Cloudinary

For file uploads, sign up at [Cloudinary](https://cloudinary.com/) and add your credentials to `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Note:** The app will work without this, but file uploads will fail.

### Step 4: (Optional) Configure Email

For password reset emails, configure Gmail in `server/.env`:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Add to `.env`:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
```

**Note:** The app will work without this, but password reset emails won't send.

### Step 5: Install Dependencies

```bash
# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies (in a new terminal)
cd client
npm install
```

### Step 6: Start the Application

#### Option A: Using Two Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

#### Option B: Using Docker (One Command)

```bash
# From project root
docker-compose up --build
```

### Step 7: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

### Step 8: Create Your First Account

1. Click "Register" on the login page
2. Fill in your details:
   - Full Name
   - Username
   - Email
   - Password (min 8 chars, must include uppercase, lowercase, and number)
3. Click "Create Account"
4. You'll be automatically logged in!

## 🎯 Test the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }'
```

## 📝 Environment Variables Checklist

### ✅ Required (Must Configure):
- [ ] MongoDB password in `MONGODB_URI`
- [ ] `JWT_SECRET` (generate new)
- [ ] `JWT_REFRESH_SECRET` (generate new)

### ⚠️ Optional (App works without these):
- [ ] Cloudinary credentials (for file uploads)
- [ ] Email credentials (for password reset)

## 🔧 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: Authentication failed`

**Solutions:**
1. Ensure you replaced `<db_password>` with your actual password
2. Make sure the password doesn't contain special characters (or URL-encode them)
3. Check that your IP is whitelisted in MongoDB Atlas (add `0.0.0.0/0` for testing)

### Port Already in Use

**Backend (Port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Frontend (Port 5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### Module Not Found

```bash
# Delete node_modules and reinstall
cd server
rm -rf node_modules
npm install

cd ../client
rm -rf node_modules
npm install
```

## 🎉 What's Next?

After logging in, you can:

1. **Explore the Dashboard** - See your task statistics
2. **Create Your First Task** - Click "New Task" button
3. **Try Kanban Board** - Drag and drop tasks between columns
4. **Create a Team** - Invite colleagues to collaborate
5. **Check Analytics** - View productivity charts
6. **Customize Profile** - Upload profile picture, change theme
7. **Enable Dark Mode** - Toggle in the header

## 🌟 Key Features to Try

- ✅ **Create Tasks** - With status, priority, due dates, and tags
- ✅ **Kanban Board** - Visual task management with drag-and-drop
- ✅ **Real-time Updates** - See changes instantly (open in 2 browsers!)
- ✅ **Comments** - Collaborate on tasks with team members
- ✅ **Notifications** - Get notified when assigned tasks
- ✅ **Analytics** - Track your productivity
- ✅ **Dark Mode** - Easy on the eyes
- ✅ **Calendar View** - See tasks by date
- ✅ **Search & Filter** - Find tasks quickly

## 📚 Need More Help?

- **Detailed Setup:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Architecture:** See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- **API Docs:** See [README.md](./README.md#api-documentation)

## 🔐 Create Admin Account (Optional)

1. Register normally through the UI
2. Connect to MongoDB (using MongoDB Compass or Atlas web interface)
3. Run this command in the MongoDB shell:

```javascript
db.users.updateOne(
  { email: "your_email@example.com" },
  { $set: { role: "admin" } }
)
```

Now you have admin privileges! 🎉

---

**Congratulations!** 🎊 Your TaskMatrix application is now running!

Need help? Check the troubleshooting section or review the detailed setup guide.

# ⚡ Quick Deploy Guide - TaskMatrix

## TL;DR - What You're Doing

You're deploying a full-stack app where:
- **Frontend** (React) → Vercel (free)
- **Backend** (Node.js + Socket.IO) → Railway (free)
- **Database** (MongoDB) → MongoDB Atlas (free)

**Total time: 30-45 minutes**

---

## 🎯 3 Main Steps

### 1️⃣ Setup MongoDB (5 minutes)

1. Go to **mongodb.com/cloud/atlas** → Sign up
2. Create **FREE** cluster
3. Create database user + password
4. Network Access → **Allow from anywhere**
5. Get connection string → Replace `<password>` with your password

**You'll need:** Connection string like:
```
mongodb+srv://myuser:mypass123@cluster0.abc.mongodb.net/taskmatrix
```

---

### 2️⃣ Deploy Backend to Railway (10 minutes)

1. Go to **railway.app** → Sign up with GitHub
2. **New Project** → Deploy from GitHub repo
3. Select your repo → Root directory: **server**
4. Add environment variables:

**Quick copy-paste template:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=paste_your_mongodb_connection_string_here
JWT_SECRET=paste_random_32_character_string_here
JWT_REFRESH_SECRET=paste_another_random_32_character_string_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=https://your-app.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password_here
EMAIL_FROM=TaskMatrix <noreply@taskmatrix.com>
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Generate random secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Deploy → Copy your backend URL

---

### 3️⃣ Deploy Frontend to Vercel (10 minutes)

1. Go to **vercel.com** → Sign up with GitHub
2. **Import Project** → Select your repo
3. Configure:
   - Root Directory: **client**
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. Add environment variables:
```env
VITE_API_URL=https://your-railway-backend.up.railway.app/api
VITE_SOCKET_URL=https://your-railway-backend.up.railway.app
VITE_APP_NAME=TaskMatrix
VITE_APP_VERSION=1.0.0
```

5. **Deploy**

6. Go back to Railway → Update backend `CLIENT_URL` to your Vercel URL

---

## 🎉 Done!

Your app is live at: `https://your-app.vercel.app`

Test it:
1. Register a new user
2. Create a task
3. Open in another browser → See real-time updates

---

## Optional Add-ons

### For Image Uploads (Cloudinary)
1. Go to **cloudinary.com** → Sign up
2. Dashboard → Copy credentials
3. Add to Railway environment variables

### For Email (Gmail)
1. Enable 2FA on Gmail
2. Generate App Password: **myaccount.google.com/apppasswords**
3. Add to Railway environment variables

---

## Troubleshooting

**CORS Error?**
- Make sure `CLIENT_URL` in Railway matches your Vercel URL exactly

**Can't connect to database?**
- Check MongoDB Atlas network access is set to 0.0.0.0/0
- Verify connection string password is correct

**Backend not responding?**
- Check Railway logs for errors
- Verify all environment variables are set

---

## Cost

Everything is **FREE** with these limits:
- Vercel: 100GB bandwidth/month
- Railway: $5 credit/month (≈500 hours)
- MongoDB Atlas: 512MB storage

This is enough for **hundreds of users**.

---

## Security Notes

✅ All sensitive data goes in environment variables
✅ Never commit .env files
✅ Use strong random JWT secrets
✅ Use Gmail App Password, not regular password

---

**Need detailed instructions? Check `VERCEL_DEPLOYMENT_GUIDE.md`**

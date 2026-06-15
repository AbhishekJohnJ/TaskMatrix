# 🚀 Deployment Checklist for TaskMatrix

## Before You Start

- [ ] GitHub repository is up to date
- [ ] All code is committed and pushed
- [ ] Local development works correctly

---

## Step 1: MongoDB Atlas Setup ☁️

- [ ] Create MongoDB Atlas account
- [ ] Create free M0 cluster
- [ ] Create database user with password
- [ ] Set network access to 0.0.0.0/0 (Allow from anywhere)
- [ ] Copy connection string
- [ ] Replace `<password>` in connection string
- [ ] Test connection string locally

**Connection String Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskmatrix?retryWrites=true&w=majority
```

---

## Step 2: Cloudinary Setup 🖼️

- [ ] Create Cloudinary account (free)
- [ ] Copy Cloud Name
- [ ] Copy API Key
- [ ] Copy API Secret
- [ ] Save credentials securely

---

## Step 3: Gmail App Password Setup 📧

- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App Password (16 characters)
- [ ] Save App Password securely

---

## Step 4: Generate JWT Secrets 🔐

Generate two random strings (32+ characters each):

**Option 1 - Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2 - Online Generator:**
Visit: https://randomkeygen.com/

- [ ] Generate JWT_SECRET
- [ ] Generate JWT_REFRESH_SECRET
- [ ] Save both securely

---

## Step 5: Deploy Backend 🔧

### Railway (Recommended)

- [ ] Create Railway account with GitHub
- [ ] Create new project from GitHub repo
- [ ] Set root directory to `server`
- [ ] Add all environment variables (see below)
- [ ] Wait for deployment to complete
- [ ] Copy backend URL (e.g., `https://taskmatrix-production.up.railway.app`)
- [ ] Test backend health: `https://your-url/health`

### Environment Variables for Backend:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<your_generated_jwt_secret_32_chars_min>
JWT_REFRESH_SECRET=<your_generated_jwt_refresh_secret_32_chars_min>
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=https://your-app-name.vercel.app
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your_gmail_address>
EMAIL_PASSWORD=<your_gmail_app_password>
EMAIL_FROM=TaskMatrix <noreply@taskmatrix.com>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=5242880
```

---

## Step 6: Deploy Frontend to Vercel 🎨

- [ ] Create Vercel account with GitHub
- [ ] Import your GitHub repository
- [ ] Set root directory to `client`
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Add environment variables (see below)
- [ ] Deploy
- [ ] Copy Vercel URL (e.g., `https://taskmatrix.vercel.app`)

### Environment Variables for Frontend:

```env
VITE_API_URL=<your_railway_backend_url>/api
VITE_SOCKET_URL=<your_railway_backend_url>
VITE_APP_NAME=TaskMatrix
VITE_APP_VERSION=1.0.0
```

**Example:**
```env
VITE_API_URL=https://taskmatrix-production.up.railway.app/api
VITE_SOCKET_URL=https://taskmatrix-production.up.railway.app
VITE_APP_NAME=TaskMatrix
VITE_APP_VERSION=1.0.0
```

---

## Step 7: Update Backend with Frontend URL 🔄

- [ ] Go back to Railway backend settings
- [ ] Update `CLIENT_URL` to your Vercel URL
- [ ] Save and redeploy
- [ ] Wait for backend to restart

---

## Step 8: Testing 🧪

### Test Basic Functionality:

- [ ] Frontend loads correctly
- [ ] Backend health check works: `https://your-backend-url/health`
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Create a task
- [ ] Edit a task
- [ ] Delete a task

### Test Advanced Features:

- [ ] File upload (profile picture)
- [ ] Real-time updates (open two browsers)
- [ ] Email notifications (password reset)
- [ ] Team creation
- [ ] Team invitations
- [ ] Comments on tasks
- [ ] Calendar view
- [ ] Analytics page

### Check Browser Console:

- [ ] No CORS errors
- [ ] No 404 errors
- [ ] Socket.IO connects successfully
- [ ] API calls work correctly

---

## Step 9: Share Your App 🌍

Your app is now live! Share this URL:

```
https://your-app-name.vercel.app
```

Others can:
- ✅ Register accounts
- ✅ Create and manage tasks
- ✅ Join teams
- ✅ Upload files
- ✅ Receive real-time updates
- ✅ Get email notifications

---

## Common Issues & Quick Fixes 🔧

### Issue: CORS Error
**Fix:** Make sure `CLIENT_URL` in backend exactly matches your Vercel URL (including https://)

### Issue: Socket.IO Not Connecting
**Fix:** Verify `VITE_SOCKET_URL` points to backend root (not /api)

### Issue: 502 Bad Gateway
**Fix:** Check backend logs in Railway. Usually means backend crashed - check MONGODB_URI

### Issue: Images Not Uploading
**Fix:** Verify Cloudinary credentials are correct

### Issue: Emails Not Sending
**Fix:** Use Gmail App Password, not regular password

---

## Security Reminders 🔒

- ✅ Never commit .env files to GitHub
- ✅ Use strong JWT secrets (32+ characters)
- ✅ MongoDB Atlas network access is monitored
- ✅ Rate limiting is enabled
- ✅ All environment variables are in Railway/Vercel, not in code

---

## Monitoring Your App 📊

### Check Backend Health:
```
https://your-backend-url/health
```

### View Logs:
- **Railway**: Dashboard → Logs tab
- **Vercel**: Project → Logs
- **MongoDB**: Atlas → Metrics

---

## Free Tier Limits 💰

| Service | Free Tier | Enough For |
|---------|-----------|------------|
| Vercel | 100GB bandwidth/month | ~10,000 users/month |
| Railway | $5 credit/month | ~500 hours |
| MongoDB Atlas | 512MB storage | ~5,000 users |
| Cloudinary | 25GB storage | ~50,000 images |

---

## Next Steps 🎯

1. [ ] Set up custom domain (optional)
2. [ ] Configure monitoring/analytics
3. [ ] Set up automated backups
4. [ ] Create admin user
5. [ ] Invite team members

---

## Support Resources 📚

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

**Ready to deploy? Start with Step 1! 🚀**

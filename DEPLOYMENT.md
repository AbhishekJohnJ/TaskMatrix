# TaskMatrix Deployment Guide

## Issues Fixed

### 1. ✅ GitHub Actions Workflow
- **Problem**: The workflow was trying to run tests that don't exist yet
- **Solution**: Changed test jobs to build jobs that only verify the code compiles

### 2. ✅ Docker Compose Network
- **Problem**: Network name mismatch (taskflow-network vs taskmatrix-network)
- **Solution**: Standardized all networks to `taskmatrix-network`

## Deployment Options

### Option 1: Docker Compose (Local/VPS)

1. **Prerequisites**:
   - Docker and Docker Compose installed
   - MongoDB credentials configured

2. **Steps**:
   ```bash
   # Build and start all services
   docker-compose up -d

   # View logs
   docker-compose logs -f

   # Stop services
   docker-compose down
   ```

3. **Access**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017

### Option 2: Cloud Deployment (Vercel + Render)

#### Frontend (Vercel)

1. **Set up Vercel**:
   - Connect your GitHub repository to Vercel
   - Select the `client` folder as the root directory
   - Vercel will auto-detect Vite configuration

2. **Environment Variables** (Vercel Dashboard):
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   VITE_APP_NAME=TaskMatrix
   VITE_APP_VERSION=1.0.0
   ```

3. **GitHub Secrets Required**:
   - `VERCEL_TOKEN`: Get from Vercel account settings
   - `VERCEL_ORG_ID`: Get from Vercel project settings
   - `VERCEL_PROJECT_ID`: Get from Vercel project settings

#### Backend (Render)

1. **Set up Render**:
   - Create a new Web Service
   - Connect your GitHub repository
   - Select the `server` folder as the root directory
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Environment Variables** (Render Dashboard):
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_32_char_minimum_key
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_32_char_min
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   CLIENT_URL=https://your-frontend-url.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=TaskMatrix <noreply@taskmatrix.com>
   ```

3. **GitHub Secrets Required**:
   - `RENDER_API_KEY`: Get from Render account settings
   - `RENDER_SERVICE_ID`: Get from your Render service URL

## Setting Up GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions:

### For Vercel:
1. `VERCEL_TOKEN`: https://vercel.com/account/tokens
2. `VERCEL_ORG_ID`: Found in Vercel project settings
3. `VERCEL_PROJECT_ID`: Found in Vercel project settings

### For Render:
1. `RENDER_API_KEY`: https://dashboard.render.com/u/settings#api-keys
2. `RENDER_SERVICE_ID`: Found in your Render service URL (e.g., `srv-xxxxx`)

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Add to `MONGODB_URI` environment variable

### Option 2: Local MongoDB (Development)
```bash
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:latest
```

Connection string: `mongodb://admin:admin123@localhost:27017/taskmatrix?authSource=admin`

## Troubleshooting

### Issue: Deployment fails with "npm test" error
**Solution**: Make sure you've pushed the updated `.github/workflows/deploy.yml` file

### Issue: CORS errors on frontend
**Solution**: 
- Verify `CLIENT_URL` in backend matches your frontend URL
- Check that backend URL in frontend `.env` is correct

### Issue: MongoDB connection fails
**Solution**:
- Verify MongoDB connection string is correct
- Check if IP is whitelisted in MongoDB Atlas
- Ensure username/password are URL-encoded

### Issue: Environment variables not working
**Solution**:
- Frontend: Variables must start with `VITE_`
- Backend: Check `.env` file exists and is loaded
- Cloud: Verify all variables are set in platform dashboard

### Issue: Socket.IO not connecting
**Solution**:
- Ensure `VITE_SOCKET_URL` matches backend URL
- Check CORS settings in backend
- Verify WebSocket is not blocked by firewall

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Backend health check responds: `https://your-backend-url/health`
- [ ] User registration works
- [ ] User login works
- [ ] Real-time notifications work (Socket.IO)
- [ ] File uploads work (Cloudinary)
- [ ] Email notifications work
- [ ] All API endpoints respond correctly

## Monitoring

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Need Help?

Check the logs:
- **Vercel**: https://vercel.com/dashboard → Your Project → Deployments → Logs
- **Render**: https://dashboard.render.com → Your Service → Logs
- **GitHub Actions**: Repository → Actions tab

## Next Steps

1. Push your changes to trigger deployment:
   ```bash
   git add .
   git commit -m "Fix deployment configuration"
   git push origin main
   ```

2. Monitor the deployment in GitHub Actions tab

3. Once deployed, test all functionality

4. Set up monitoring and alerts for production

# Troubleshooting Guide - Team Features

## Common Issues and Solutions

### 1. "Failed to load team" Error

This error appears when the frontend cannot connect to the backend API.

#### Quick Fix Checklist:
```bash
# 1. Check if backend is running
cd server
npm start

# 2. Check if MongoDB is running
# Make sure your MongoDB connection is active

# 3. Verify environment variables
# Check server/.env has valid MONGODB_URI
# Check client/.env has VITE_API_URL=http://localhost:5000/api

# 4. Test backend health
node check-backend.js
```

#### Detailed Steps:

**Step 1: Start Backend Server**
```bash
cd server
npm install  # if first time
npm start
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

**Step 2: Verify MongoDB Connection**
- Check `server/.env` has correct `MONGODB_URI`
- Default local: `mongodb://localhost:27017/taskmatrix`
- Or use MongoDB Atlas connection string

**Step 3: Test API Connection**
Open browser and visit:
- `http://localhost:5000/api/` 
- Should see a response (even if it's an error, it means server is running)

**Step 4: Check Frontend .env**
File: `client/.env`
```
VITE_API_URL=http://localhost:5000/api
```

**Step 5: Restart Frontend**
```bash
cd client
npm run dev
```

### 2. "User not found with that email" Error

This is **normal behavior** - you can only invite users who are already registered.

#### Solution:
1. Ask the person to register first at `/register`
2. Use their registered email address
3. Then add them to the team

#### Test with Multiple Accounts:
```bash
# Option 1: Use different browsers
- Chrome: Login as user1@test.com
- Firefox: Login as user2@test.com

# Option 2: Use incognito/private windows
- Regular window: user1@test.com
- Incognito: user2@test.com

# Option 3: Use different profiles
- Chrome Profile 1: user1@test.com  
- Chrome Profile 2: user2@test.com
```

### 3. Teams Not Loading / Showing Empty

#### Possible Causes:

**A. Not Logged In**
- Check if you're authenticated
- Token might be expired
- Solution: Logout and login again

**B. No Teams Created Yet**
- Normal for new users
- Click "+ New Team" to create first team

**C. API Authentication Issue**
```javascript
// Check browser console (F12) for errors
// Look for 401 Unauthorized or 403 Forbidden
```

**D. Database Empty**
- If this is fresh install, database is empty
- Create teams and they'll appear

### 4. Cannot See Team Tasks

#### Checklist:
1. Are you a member of the team?
   - Check Team Detail page shows you in members list
   
2. Has the team leader created any tasks?
   - Only team leader can create team tasks initially
   
3. Are you on the right page?
   - Navigate to Teams → Click team name → See team tasks

### 5. Cannot Take Tasks

#### Reasons:

**A. Not a Team Member**
- Only team members can take tasks
- Ask team leader to add you

**B. Task Already Assigned**
- Task shows someone's name = already assigned
- Cannot take assigned tasks

**C. Task Not Available**
- Leader might have created it as directly assigned
- Only "Available" tasks can be taken

**D. You're the Team Leader**
- Leaders see "Assign" button instead of "Take Task"
- Leaders assign tasks to others

### 6. Team Badge Not Showing

Team badge (purple badge with team name) only shows on:
- Tasks that have `team` property set
- Tasks created as "team tasks"

#### How to Create Team Task:
1. Go to Team Detail page
2. Click "Create Task" button (only team leaders see this)
3. Fill in task details
4. Task will automatically be a team task

#### Regular tasks won't show team badge because:
- Created from Tasks page (not team-specific)
- Created from Kanban board (not team-specific)
- Need to be created from Team Detail page

### 7. Notifications Not Working

#### Check:
1. Browser notifications enabled?
2. Socket.io connection established?
3. Backend socket server running?

#### Test:
```bash
# Backend console should show:
Socket client connected: <socket-id>
```

### 8. Cannot Assign Tasks

Only team **leaders/owners** can assign tasks.

#### Check Your Role:
- Owner: You created the team
- Member: You were invited

#### If you're a member:
- You can only "take" available tasks
- Cannot assign to others
- Ask team leader to assign tasks

### 9. Database Connection Issues

#### MongoDB Not Running:
```bash
# Check MongoDB status
# Windows:
services.msc → Look for MongoDB

# Mac:
brew services list

# Linux:
sudo systemctl status mongod
```

#### Connection String Issues:
File: `server/.env`
```env
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/taskmatrix

# MongoDB Atlas (cloud):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmatrix

# With authentication:
MONGODB_URI=mongodb://username:password@localhost:27017/taskmatrix
```

### 10. Port Already in Use

```bash
# Error: Port 5000 is already in use

# Solution 1: Kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Solution 2: Change port in server
# Edit server/.env:
PORT=5001
# Also update client/.env:
VITE_API_URL=http://localhost:5001/api
```

## Quick Diagnostic Commands

```bash
# Check if backend is running
curl http://localhost:5000/api/

# Check if MongoDB is accessible
# From server directory:
node test-connection.js

# View all teams in database
node view-database.js

# Check backend health
node check-backend.js
```

## Step-by-Step: Fresh Start

If nothing works, try complete reset:

```bash
# 1. Stop all servers
# Press Ctrl+C in all terminal windows

# 2. Clear browser data
# Open DevTools (F12) → Application → Clear storage

# 3. Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client  
rm -rf node_modules package-lock.json
npm install

# 4. Check environment files
# Verify server/.env has MongoDB connection
# Verify client/.env has correct API URL

# 5. Start MongoDB
# Make sure MongoDB is running first

# 6. Start backend
cd server
npm start

# 7. Start frontend (new terminal)
cd client
npm run dev

# 8. Register new user
# Go to http://localhost:5173/register

# 9. Create team and test
```

## Need More Help?

### Check Logs:

**Backend Logs:**
- Terminal where you ran `npm start` in server folder
- Look for error messages
- MongoDB connection status

**Frontend Logs:**
- Browser Console (F12 → Console tab)
- Network tab (F12 → Network) - check failed requests
- Look for 404, 401, 500 errors

**MongoDB Logs:**
- Check MongoDB logs for connection issues

### Common Error Codes:

- **404 Not Found**: Endpoint doesn't exist or wrong URL
- **401 Unauthorized**: Not logged in or token expired
- **403 Forbidden**: Don't have permission
- **500 Internal Server Error**: Backend crash, check server logs
- **ECONNREFUSED**: Backend server not running

### Debug Mode:

Add to `server/.env`:
```env
NODE_ENV=development
DEBUG=*
```

This will show detailed logs for debugging.

## Still Having Issues?

1. Check all files were created correctly
2. Verify MongoDB is running and accessible  
3. Ensure ports 5000 and 5173 are not blocked by firewall
4. Try running in incognito mode to rule out browser cache
5. Check all environment variables are set correctly
6. Verify you're using compatible Node.js version (v14+ recommended)

## Testing Invitation Flow End-to-End

```bash
# Terminal 1: Backend
cd server && npm start

# Terminal 2: Frontend  
cd client && npm run dev

# Browser 1 (Chrome): User 1 (Team Leader)
1. Register: leader@test.com / password123
2. Create team "Alpha Team"
3. Add member: member@test.com

# Browser 2 (Firefox): User 2 (Team Member)
1. Register: member@test.com / password123
2. Check Teams page - should see "Alpha Team"
3. Click team - should see you're a member
4. Leader creates task and makes it available
5. You should see "Take Task" button

# Browser 1: Leader
1. Create task "Test Task"
2. Don't assign to anyone (leave as available)
3. Should see in Available Tasks section

# Browser 2: Member
1. Refresh team page
2. Click "Take Task"
3. Task should now be assigned to you

# Browser 1: Leader
1. Should see task now assigned to member
2. Member drags task to completed in Kanban
3. Leader gets notification ✅
```

This complete flow verifies the entire team task system is working!

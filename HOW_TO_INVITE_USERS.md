# 🎯 How to Invite Users to Your Team

## Quick Answer
**You can only invite users who already have a TaskMatrix account.**

Enter their registered email address, and they'll be added immediately to your team!

---

## 📋 Complete Step-by-Step Guide

### Part 1: Preparation (One-time setup)

#### ✅ Step 1: Make Sure Your Backend is Running
```bash
# Open terminal in project root
cd server
npm start
```

You should see:
```
✓ Server running on port 5000
✓ MongoDB connected successfully
```

#### ✅ Step 2: Make Sure Your Frontend is Running
```bash
# Open new terminal in project root
cd client
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**💡 Pro Tip:** Use `start-everything.bat` to start both at once!

---

### Part 2: Testing the Invitation System

#### 📝 Scenario: You want to invite your colleague "John" to your team

##### **Step 1: John Needs to Register First** (Critical!)

**John's Actions:**
1. Open browser → Go to `http://localhost:5173/register`
2. Fill registration form:
   - Full Name: `John Doe`
   - Username: `johndoe`
   - Email: `john@company.com` ⭐ (Remember this!)
   - Password: `SecurePass123`
3. Click "Register"
4. Login with credentials

##### **Step 2: You Create the Team**

**Your Actions:**
1. Login to your account
2. Click "Teams" in sidebar
3. Click "+ New Team" button
4. Fill in:
   - Team Name: `Project Alpha`
   - Description: `Our awesome project`
5. Click "Create Team"

##### **Step 3: You Invite John**

**Your Actions:**
1. Click on "Project Alpha" team card
2. You're now on Team Detail page
3. Click "Add Member" button (top right)
4. Read the blue note: "You can only invite users who are already registered"
5. Enter John's email: `john@company.com` ⭐
6. Click "Add Member"

**What Happens:**
- ✅ Success message: "Member added successfully!"
- 🔔 John receives notification: "You've been added to Project Alpha"
- 👥 John appears in team members list
- 📧 John can now see the team in his Teams page

##### **Step 4: John Sees He's Been Added**

**John's Actions:**
1. Check notification bell icon (top right)
2. See notification: "Added to Team - [Your Name] added you to Project Alpha"
3. Go to Teams page
4. See "Project Alpha" in teams list
5. Click on it to view team details

---

## 🎓 Common Scenarios

### Scenario 1: Testing with Multiple Test Accounts

```bash
# User 1: Team Leader
Email: leader@test.com
Password: Test123!

# User 2: Team Member
Email: member1@test.com
Password: Test123!

# User 3: Another Member
Email: member2@test.com  
Password: Test123!
```

**Steps:**
1. Register all 3 accounts (use incognito windows or different browsers)
2. Login as leader@test.com
3. Create team
4. Add member1@test.com
5. Add member2@test.com
6. Switch to member accounts to verify they see the team

### Scenario 2: Real-World Team Setup

You have 5 colleagues working on a project:

**Week 1: Get Everyone Registered**
```
Day 1: Share registration link with team
       → http://localhost:5173/register
       
Day 2: Everyone creates accounts
       Alice: alice@company.com
       Bob: bob@company.com
       Carol: carol@company.com
       Dave: dave@company.com
       Eve: eve@company.com
```

**Week 1: Create Team Structure**
```
You (Team Leader):
1. Create "Q4 Launch Team"
2. Add all 5 members using their emails
3. Create team tasks and assign them
```

**Week 2: Start Collaborating**
```
- Assign specific tasks to members
- Create available tasks for anyone to take
- Track progress on team dashboard
- Get notified when tasks are completed
```

---

## ❌ Common Mistakes & Solutions

### Mistake 1: Trying to Invite Unregistered User
```
❌ Error: "User not found with that email"
```
**Solution:** 
- User must register first
- Then use their registered email

### Mistake 2: Typo in Email Address
```
❌ Trying to add: jon@company.com
✅ Correct email: john@company.com
```
**Solution:**
- Double-check email spelling
- Copy-paste to avoid typos
- Ask user to confirm their registered email

### Mistake 3: Using Different Email
```
User registered with: john.doe@gmail.com
You're trying to add: john@company.com
```
**Solution:**
- Ask user which email they used to register
- Use that exact email address

### Mistake 4: Already a Member
```
❌ Error: "User is already a member"
```
**Solution:**
- Check team members list
- User is already in the team
- No need to add again

---

## 🔧 Troubleshooting

### Issue: "Failed to load team"

**Cause:** Backend not running or connection issue

**Fix:**
```bash
# Terminal 1: Check if backend is running
cd server
npm start

# Terminal 2: Check if you can reach API
curl http://localhost:5000/api/

# If not working, check server/.env has:
MONGODB_URI=mongodb://localhost:27017/taskmatrix
PORT=5000
```

### Issue: Can't See Invited Member in List

**Cause:** Page not refreshed or API error

**Fix:**
```bash
1. Refresh the page (F5)
2. Check browser console (F12) for errors
3. Check team members section
4. Try adding again if member not there
```

### Issue: Member Can't See Team

**Cause:** Member not logged in or cache issue

**Fix:**
```bash
1. Member logs out and logs back in
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check if invitation actually succeeded (leader should see member in list)
4. Try invitation again
```

---

## 🚀 Quick Test Script

Run this to test everything works:

```javascript
// TEST PLAN
// ========

// Browser 1: Register and Login as Leader
1. Go to /register
2. Email: testleader@test.com, Password: Test123!
3. Login
4. Create team "Test Team"
5. Keep this window open

// Browser 2: Register as Member (use incognito/different browser)
1. Go to /register
2. Email: testmember@test.com, Password: Test123!  
3. Login
4. Don't close this window

// Browser 1: Invite Member
1. Click "Test Team"
2. Click "Add Member"
3. Enter: testmember@test.com
4. Click "Add Member"
5. Should see success message ✅
6. Should see testmember in members list ✅

// Browser 2: Verify Membership
1. Check notification bell (should have notification) ✅
2. Go to Teams page
3. Should see "Test Team" ✅
4. Click team
5. Should see self in members list ✅

// Browser 1: Create Team Task
1. In "Test Team" page
2. Click "Create Task"
3. Title: "Test Task"
4. Don't assign to anyone (leave available)
5. Click "Create Task"
6. Should appear in team tasks ✅

// Browser 2: Take the Task
1. Refresh team page
2. Should see "Test Task" in Available Tasks section ✅
3. Click "Take Task"
4. Task should now be assigned to you ✅

// Browser 1: Verify Task Taken
1. Refresh team page
2. Task should show assigned to testmember ✅
3. No longer in available section ✅

// PASS: All checks ✅ = System working perfectly!
// FAIL: Any ❌ = Check troubleshooting section
```

---

## 📊 Understanding the Workflow

```
┌─────────────────────────────────────────────┐
│  INVITATION WORKFLOW                        │
└─────────────────────────────────────────────┘

Step 1: User Registration
┌──────────┐
│  Person  │ → Registers → Creates Account
└──────────┘              (email + password)
                                ↓
                        ┌──────────────┐
                        │ Registered   │
                        │ User in DB   │
                        └──────────────┘

Step 2: Team Creation  
┌──────────┐
│  Leader  │ → Creates → Team
└──────────┘
                                ↓
                        ┌──────────────┐
                        │   Team in    │
                        │      DB      │
                        └──────────────┘

Step 3: Invitation
┌──────────┐
│  Leader  │ → Enters Email → System Checks DB
└──────────┘                         │
                                     ├─ Found? → Add to Team ✅
                                     │              ↓
                                     │    Send Notification 🔔
                                     │              ↓
                                     │    Member Sees Team 👥
                                     │
                                     └─ Not Found? → Error ❌
                                                "User not found"

Step 4: Collaboration
┌──────────┐                        ┌──────────┐
│  Leader  │ ← → Team Tasks ← →     │  Member  │
└──────────┘                        └──────────┘
     │                                    │
     ├─ Create Tasks                     ├─ Take Tasks
     ├─ Assign Tasks                     ├─ Complete Tasks
     └─ Get Notifications                └─ Update Status
```

---

## ✨ Pro Tips

### Tip 1: Create a Team Roster First
Before inviting, make a list:
```
Team: "Project Phoenix"
Members to invite:
☐ alice@company.com
☐ bob@company.com  
☐ carol@company.com
☐ dave@company.com
```

### Tip 2: Send Registration Link First
Before inviting, send to team:
```
"Hey team! 

Please register at: http://localhost:5173/register

I'll add you to our project team once you're registered.

- [Your Name]"
```

### Tip 3: Verify Emails Before Adding
Ask team members:
```
"What email did you use to register?"
```

This prevents typos and failed invitations!

### Tip 4: Use Test Accounts for Learning
Create test accounts to practice:
```
testuser1@test.com
testuser2@test.com
testuser3@test.com
```

Practice inviting, creating tasks, etc. without affecting real data.

---

## 🎉 Success Criteria

You know everything is working when:

✅ You can add registered users to your team
✅ Added users see the team in their Teams page
✅ Added users receive notifications
✅ Team members can see team tasks
✅ You get notified when members complete tasks
✅ Team badges appear on team tasks
✅ Members can take available tasks

---

## 📞 Still Need Help?

1. ✅ Check `TROUBLESHOOTING.md` for detailed fixes
2. ✅ Run `node check-backend.js` to verify backend
3. ✅ Check browser console (F12) for errors
4. ✅ Verify MongoDB is running
5. ✅ Make sure both frontend and backend are started

**Remember:** The system works perfectly when:
- ✅ Backend is running
- ✅ MongoDB is connected
- ✅ Users are already registered
- ✅ You use their registered email addresses

Good luck building your teams! 🚀

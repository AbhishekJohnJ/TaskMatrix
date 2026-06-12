# Team Invitation Guide

## How to Invite Team Members

### Prerequisites
Before you can invite someone to your team, they **must be registered** in the system with an account.

### Step-by-Step Process

#### 1. **Ensure Users Are Registered**
- Each team member must first create an account on TaskMatrix
- They need to complete the registration process with their email address
- You can only invite users who have an existing account

#### 2. **Create a Team**
1. Navigate to the **Teams** page
2. Click the **"+ New Team"** button
3. Fill in:
   - Team Name (required)
   - Team Description (optional)
4. Click **"Create Team"**

#### 3. **Invite Team Members**
1. Click on your team to open **Team Detail** page
2. Click the **"Add Member"** button (top right)
3. Enter the **registered user's email address**
4. Click **"Add Member"**

#### 4. **What Happens After Invitation**
- If the email is registered:
  - ✅ User is immediately added to the team
  - 🔔 User receives a notification about being added to the team
  - 👥 User can now see the team in their Teams list
  
- If the email is NOT registered:
  - ❌ Error: "User not found with that email"
  - 💡 Ask them to register first, then try again

### Current System Behavior

**Direct Addition (Current Implementation)**
- Users are added immediately when their email is found
- No pending invitation or acceptance step
- Instant team membership

### Troubleshooting

#### "Failed to load team" Error
**Possible causes:**
1. Backend server is not running
   - Solution: Start the backend server (`cd server && npm start`)
   
2. Wrong API URL in frontend
   - Check `client/.env` has: `VITE_API_URL=http://localhost:5000/api`
   
3. Database connection issues
   - Check MongoDB is running
   - Verify `.env` connection string in `server/.env`

#### "User not found with that email"
**Possible causes:**
1. User hasn't registered yet
   - Solution: Have them create an account first
   
2. Email address is misspelled
   - Solution: Double-check the email address
   
3. User registered with a different email
   - Solution: Confirm the correct email with the user

#### "User is already a member"
- User is already part of this team
- Check the team members list to confirm

### Team Member Roles

When invited, users are automatically assigned the **"member"** role:
- **Owner**: Creator of the team (you)
  - Can create/assign/manage all team tasks
  - Can add/remove members
  - Can delete the team
  
- **Member**: Invited users
  - Can view team tasks
  - Can take available tasks
  - Can update their assigned tasks
  - Cannot manage team settings

### Quick Start Example

**Scenario:** You want to create a team for a project with 2 colleagues

1. **Have your colleagues register:**
   - alice@company.com → Creates account
   - bob@company.com → Creates account

2. **You create the team:**
   - Name: "Project Alpha"
   - Description: "Q4 Product Launch"

3. **You add members:**
   - Add Member → alice@company.com ✅
   - Add Member → bob@company.com ✅

4. **Create and assign tasks:**
   - Create task "Design mockups" → Assign to Alice
   - Create task "Backend API" → Assign to Bob
   - Create task "Testing" → Leave available for team

5. **Team collaboration:**
   - Alice and Bob can see all team tasks
   - They can take available tasks
   - You get notified when they complete tasks

### Future Enhancement Ideas

The current system could be enhanced with:
- Email invitations to non-registered users
- Invitation links with token-based acceptance
- Pending invitations list
- Invitation expiration
- User ability to accept/decline invitations
- Manager role between Owner and Member

For now, the simple direct-add approach works great for teams where all members are already registered users!

## Testing the System

### Test Scenario 1: Successful Invitation
```
1. Register 2 test accounts:
   - user1@test.com
   - user2@test.com

2. Login as user1@test.com
3. Create team "Test Team"
4. Click "Add Member"
5. Enter user2@test.com
6. Should succeed ✅
7. Logout and login as user2@test.com
8. Should see "Test Team" in teams list
9. Should see notification about being added
```

### Test Scenario 2: User Not Found
```
1. Login as team owner
2. Try to add nonexistent@test.com
3. Should get error: "User not found with that email" ❌
4. This is expected behavior
```

### Test Scenario 3: Already a Member
```
1. Add user1@test.com to team
2. Try to add user1@test.com again
3. Should get error: "User is already a member" ❌
4. This prevents duplicate memberships
```

## Summary

✅ **What Works:**
- Adding registered users to teams instantly
- Notifications when added to team
- Team members see all team tasks
- Leaders can assign tasks
- Members can take available tasks

❌ **Current Limitation:**
- Can only invite users who are already registered
- No email invitation for new users (would require email server setup)

💡 **Workaround:**
- Share registration link with new team members
- Have them create accounts first
- Then invite them using their registered email

This approach works perfectly for internal teams or when you know all members are already users of the system!

# Team Tasks Feature Implementation

## Overview
Implemented comprehensive team task management features allowing team leaders to create, assign, and manage tasks while team members can view and take available tasks.

## Features Implemented

### 1. **Team Task Creation & Management (Team Leaders)**
- Team leaders can create team-specific tasks from the Team Detail page
- Option to assign tasks directly to specific team members
- Option to make tasks available for any team member to take
- Tasks are marked with `isTeamTask: true` and linked to the team

### 2. **Task Assignment System**
- **Leader Assignment**: Team leaders can assign tasks to specific team members
- **Self-Assignment**: Team members can "take" available unassigned tasks
- Assigned tasks are automatically removed from the available pool
- Assignment tracking with `assignedBy` field to know who assigned the task

### 3. **Team Task Visibility**
- Team tasks display with a purple team badge showing the team name
- Badge appears in both Tasks page and Kanban Board
- Visual distinction between personal tasks and team tasks
- Team icon included in the badge for quick recognition

### 4. **Notification System**
- Team leader receives notification when a task is completed by a team member
- Team leader receives notification when a member takes an available task
- Team members receive notifications when assigned to tasks
- Real-time socket notifications for instant updates

### 5. **Team Detail Dashboard**
- Displays all team tasks with current status
- Shows available tasks section for team members
- "Take Task" button for unassigned available tasks
- "Assign" button for team leaders to assign tasks
- Task statistics including total tasks, available tasks, and completed tasks

## Backend Changes

### Models (server/models/Task.js)
Added new fields to Task schema:
```javascript
isTeamTask: Boolean           // Identifies team tasks
assignedBy: ObjectId          // Who assigned the task
availableForTeam: Boolean     // Can team members take this task
```

### Controllers (server/controllers/task.controller.js)
New endpoints:
- `getTeamTasks(teamId)` - Get all tasks for a specific team
- `getAvailableTeamTasks(teamId)` - Get unassigned tasks available to take
- `assignTeamTask(taskId, assignedTo)` - Team leader assigns task to member
- `takeTeamTask(taskId)` - Team member takes an available task

Enhanced `updateTask` to:
- Check team manager permissions
- Send notification to team leader when task is completed
- Properly populate team information

### Controllers (server/controllers/team.controller.js)
New endpoint:
- `createTeamTask(teamId, taskData)` - Create a team task from team page

### Routes
**server/routes/task.routes.js**:
- `GET /tasks/team/:teamId` - Get team tasks
- `GET /tasks/team/:teamId/available` - Get available team tasks
- `PATCH /tasks/:id/assign` - Assign task to member
- `PATCH /tasks/:id/take` - Take available task

**server/routes/team.routes.js**:
- `POST /teams/:id/tasks` - Create team task

## Frontend Changes

### Services
**client/src/services/teamService.js** (new file):
- Complete team management service
- `createTeamTask()` method for creating team tasks

**client/src/services/taskService.js**:
- `getTeamTasks(teamId)`
- `getAvailableTeamTasks(teamId)`
- `assignTeamTask(taskId, assignedTo)`
- `takeTeamTask(taskId)`

### Pages

**client/src/pages/TeamDetail.jsx**:
- Complete redesign with team task management
- "Create Task" button for team leaders
- All team tasks list with status and assignment info
- "Available Tasks to Take" section for team members
- "Assign" button on unassigned tasks (for leaders)
- "Take Task" button on available tasks (for members)
- Team statistics dashboard

**client/src/pages/Tasks.jsx**:
- Added team badge display on team tasks
- Purple badge with team icon and name
- Integrated with existing task list

**client/src/pages/KanbanBoard.jsx**:
- Added team badge to task cards
- Same purple badge styling as Tasks page
- Team tasks clearly identifiable while dragging

**client/src/pages/Teams.jsx**:
- Migrated from localStorage to real API
- Uses teamService for all operations
- Loading states and error handling

## Workflow

### Team Leader Flow:
1. Create team and invite members via email
2. Create team tasks from Team Detail page
3. Choose to either:
   - Assign directly to a specific member, OR
   - Leave unassigned for members to take
4. Monitor task progress
5. Receive notifications when:
   - Member takes an available task
   - Member completes a task

### Team Member Flow:
1. Join team via email invitation
2. View team tasks on Team Detail page
3. See "Available Tasks" section
4. Click "Take Task" to self-assign
5. Work on task and update status
6. Drag to "completed" in Kanban Board
7. Team leader gets notified automatically

## Key Features

### Permission System:
- Team leaders can create, assign, and manage all team tasks
- Team members can only take available tasks and update their assigned tasks
- Task update permissions check for creator, assignee, or team manager role

### Visual Indicators:
- Purple team badge with team name on all team tasks
- "Available" green badge on unassigned team tasks
- Clear role indicators (owner, manager, member) on team members
- Status and priority badges consistent with existing design

### Real-time Updates:
- Socket.io integration for instant notifications
- Task updates broadcast to all team members
- Notification system alerts for key actions

## Database Schema
No migration needed - new fields are optional and have defaults:
- `isTeamTask`: defaults to `false`
- `assignedBy`: defaults to `null`
- `availableForTeam`: defaults to `false`

## Testing Checklist
- [ ] Team leader can create team tasks
- [ ] Team leader can assign tasks to specific members
- [ ] Team leader can create available tasks for team to take
- [ ] Team members can see available tasks
- [ ] Team members can take available tasks
- [ ] Team badges appear on Tasks page
- [ ] Team badges appear on Kanban Board
- [ ] Team leader receives completion notifications
- [ ] Team leader receives task-taken notifications
- [ ] Task status updates work correctly
- [ ] Permission system prevents unauthorized actions

## Future Enhancements
- Task comments and attachments for team collaboration
- Task templates for recurring team tasks
- Team task analytics and reporting
- Bulk task assignment
- Task dependencies within team projects
- Team task calendar view
- Task priority voting by team members

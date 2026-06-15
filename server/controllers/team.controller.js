const Team = require('../models/Team');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

// Create team
exports.createTeam = async (req, res) => {
  try {
    const teamData = {
      ...req.body,
      owner: req.user.id
    };
    
    const team = await Team.create(teamData);
    await team.populate('owner members.user', 'fullName username profilePicture');
    
    await ActivityLog.logActivity({
      user: req.user.id,
      action: 'team_created',
      description: `Created team: ${team.name}`,
      relatedTeam: team._id,
      ipAddress: req.ip
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Team created successfully',
      data: { team }
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating team'
    });
  }
};

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    })
      .populate('owner', 'fullName username profilePicture')
      .populate('members.user', 'fullName username profilePicture')
      .sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      data: { teams, count: teams.length }
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching teams'
    });
  }
};

// Get single team
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('owner', 'fullName username profilePicture email')
      .populate('members.user', 'fullName username profilePicture email')
      .populate('invitations.invitedBy', 'fullName username');
    
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }
    
    // Check if user is owner
    const isOwner = team.owner._id.toString() === req.user.id.toString();
    
    // Check if user is in members list
    const isMember = team.members.some(member => {
      const memberId = member.user._id || member.user;
      return memberId.toString() === req.user.id.toString();
    });
    
    if (!isOwner && !isMember && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have access to this team'
      });
    }
    
    res.json({
      status: 'success',
      data: { team }
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching team'
    });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }
    
    if (!team.canManage(req.user.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to update this team'
      });
    }
    
    Object.assign(team, req.body);
    await team.save();
    
    res.json({
      status: 'success',
      message: 'Team updated successfully',
      data: { team }
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating team'
    });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }
    
    if (team.owner.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only team owner can delete the team'
      });
    }
    
    await team.deleteOne();
    
    res.json({
      status: 'success',
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting team'
    });
  }
};

// Invite member
exports.inviteMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }
    
    if (!team.canManage(req.user.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to invite members'
      });
    }
    
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found with that email'
      });
    }
    
    if (team.isMember(user._id)) {
      return res.status(400).json({
        status: 'error',
        message: 'User is already a member'
      });
    }
    
    team.addMember(user._id, 'member');
    await team.save();
    
    // Send notification to invited user
    await Notification.createNotification({
      recipient: user._id,
      sender: req.user.id,
      type: 'team_member_added',
      title: 'Added to Team',
      message: `${req.user.fullName} added you to team "${team.name}"`,
      relatedTeam: team._id,
      actionUrl: `/teams/${team._id}`,
      priority: 'high'
    });
    
    await team.populate('owner', 'fullName username profilePicture email');
    await team.populate('members.user', 'fullName username profilePicture email');
    
    res.json({
      status: 'success',
      message: 'Member added successfully',
      data: { team }
    });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error inviting member'
    });
  }
};

// Remove member
exports.removeMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }
    
    if (!team.canManage(req.user.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to remove members'
      });
    }
    
    team.removeMember(req.params.userId);
    await team.save();
    
    res.json({
      status: 'success',
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error removing member'
    });
  }
};

// Create team task (team leader splits tasks)
exports.createTeamTask = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }
    
    // Check if user is owner
    const isOwner = team.owner.toString() === req.user.id.toString();
    
    // Check if user is manager
    const memberRecord = team.members.find(m => {
      const memberId = m.user._id || m.user;
      return memberId.toString() === req.user.id.toString();
    });
    const isManager = memberRecord && (memberRecord.role === 'manager' || memberRecord.role === 'owner');
    
    if (!isOwner && !isManager) {
      return res.status(403).json({
        status: 'error',
        message: 'Only team leaders/managers can create team tasks'
      });
    }
    
    const Task = require('../models/Task');
    
    // Clean up the request body
    const taskData = {
      title: req.body.title,
      description: req.body.description || '',
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate || null,
      tags: req.body.tags || [],
      team: id,
      isTeamTask: true,
      createdBy: req.user.id
    };
    
    // Handle assignment
    if (req.body.assignedTo && req.body.assignedTo !== '') {
      taskData.assignedTo = req.body.assignedTo;
      taskData.availableForTeam = false;
    } else {
      taskData.assignedTo = null;
      taskData.availableForTeam = true;
    }
    
    const task = await Task.create(taskData);
    await task.populate('createdBy assignedTo', 'fullName username profilePicture');
    await task.populate('team', 'name color');
    
    // If task is assigned, notify the assignee
    if (task.assignedTo) {
      await Notification.createNotification({
        recipient: task.assignedTo._id,
        sender: req.user.id,
        type: 'task_assigned',
        title: 'Team Task Assigned',
        message: `${req.user.fullName} assigned you a team task: ${task.title}`,
        relatedTask: task._id,
        relatedTeam: team._id,
        actionUrl: `/tasks/${task._id}`
      });
      
      const io = req.app.get('io');
      if (io && io.emitToUser) {
        io.emitToUser(task.assignedTo._id, 'notification', {
          type: 'task_assigned',
          task: task
        });
      }
    }
    
    // Notify all team members about new available task
    if (task.availableForTeam && !task.assignedTo) {
      const ActivityLog = require('../models/ActivityLog');
      await ActivityLog.logActivity({
        user: req.user.id,
        action: 'team_task_created',
        description: `Created available team task: ${task.title}`,
        relatedTask: task._id,
        relatedTeam: team._id,
        ipAddress: req.ip
      });
    }
    
    res.status(201).json({
      status: 'success',
      message: 'Team task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Create team task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating team task'
    });
  }
};

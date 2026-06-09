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
    
    if (!team.isMember(req.user.id) && req.user.role !== 'admin') {
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
    
    await Notification.createNotification({
      recipient: user._id,
      sender: req.user.id,
      type: 'team_joined',
      title: 'Added to Team',
      message: `${req.user.fullName} added you to team "${team.name}"`,
      relatedTeam: team._id,
      actionUrl: `/teams/${team._id}`
    });
    
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

const User = require('../models/User');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching profile'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['fullName', 'username', 'bio'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    // Check if username is taken
    if (updates.username && updates.username !== req.user.username) {
      const existingUser = await User.findOne({ username: updates.username });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Username already taken'
        });
      }
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );
    
    // Log activity
    await ActivityLog.logActivity({
      user: req.user.id,
      action: 'profile_updated',
      description: `${user.fullName} updated profile`,
      ipAddress: req.ip
    });
    
    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating profile'
    });
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.path },
      { new: true }
    );
    
    res.json({
      status: 'success',
      message: 'Profile picture updated successfully',
      data: { profilePicture: user.profilePicture }
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating profile picture'
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select('+password');
    
    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Log activity
    await ActivityLog.logActivity({
      user: req.user.id,
      action: 'password_changed',
      description: `${user.fullName} changed password`,
      ipAddress: req.ip
    });
    
    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error changing password'
    });
  }
};

// Update preferences
exports.updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (req.body.theme) {
      user.preferences.theme = req.body.theme;
    }
    
    if (req.body.language) {
      user.preferences.language = req.body.language;
    }
    
    if (req.body.notifications) {
      Object.assign(user.preferences.notifications, req.body.notifications);
    }
    
    await user.save();
    
    res.json({
      status: 'success',
      message: 'Preferences updated successfully',
      data: { preferences: user.preferences }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating preferences'
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [totalTasks, completedTasks, pendingTasks, inProgressTasks, overdueTasks] = await Promise.all([
      Task.countDocuments({
        $or: [{ createdBy: userId }, { assignedTo: userId }]
      }),
      Task.countDocuments({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
        status: 'completed'
      }),
      Task.countDocuments({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
        status: 'todo'
      }),
      Task.countDocuments({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
        status: 'in-progress'
      }),
      Task.countDocuments({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
        status: { $nin: ['completed', 'archived'] },
        dueDate: { $lt: new Date() }
      })
    ]);
    
    res.json({
      status: 'success',
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching statistics'
    });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      data: { users, count: users.length }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching users'
    });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting user'
    });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query must be at least 2 characters'
      });
    }
    
    const users = await User.find({
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    })
      .select('fullName username email profilePicture')
      .limit(10);
    
    res.json({
      status: 'success',
      data: { users }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error searching users'
    });
  }
};

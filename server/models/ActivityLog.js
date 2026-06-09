const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'task_created',
      'task_updated',
      'task_deleted',
      'task_completed',
      'task_archived',
      'task_assigned',
      'comment_added',
      'comment_updated',
      'comment_deleted',
      'team_created',
      'team_updated',
      'team_deleted',
      'member_added',
      'member_removed',
      'file_uploaded',
      'user_login',
      'user_logout',
      'profile_updated',
      'password_changed'
    ],
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  relatedTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  relatedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },
  changes: {
    before: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    after: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ relatedTask: 1 });
activityLogSchema.index({ relatedTeam: 1 });
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // Auto-delete after 90 days

// Static method to log activity
activityLogSchema.statics.logActivity = async function(data) {
  try {
    const activity = await this.create(data);
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

// Static method to get user activities
activityLogSchema.statics.getUserActivities = async function(userId, page = 1, limit = 20, filters = {}) {
  const skip = (page - 1) * limit;
  
  const query = { user: userId };
  
  if (filters.action) {
    query.action = filters.action;
  }
  
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.createdAt.$lte = new Date(filters.endDate);
    }
  }
  
  const activities = await this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'fullName username profilePicture')
    .populate('relatedTask', 'title status')
    .populate('relatedTeam', 'name')
    .populate('relatedUser', 'fullName username');
  
  const total = await this.countDocuments(query);
  
  return {
    activities,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get team activities
activityLogSchema.statics.getTeamActivities = async function(teamId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  const activities = await this.find({ relatedTeam: teamId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'fullName username profilePicture')
    .populate('relatedTask', 'title status');
  
  const total = await this.countDocuments({ relatedTeam: teamId });
  
  return {
    activities,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;

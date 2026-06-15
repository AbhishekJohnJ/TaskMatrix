const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  type: {
    type: String,
    enum: [
      'task_assigned',
      'task_updated',
      'task_completed',
      'task_commented',
      'task_due_soon',
      'task_overdue',
      'task_taken',
      'team_invitation',
      'team_joined',
      'team_left',
      'team_member_added',
      'mention',
      'system_announcement'
    ],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
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
  relatedComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  actionUrl: {
    type: String,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  }
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // Auto-delete after 30 days

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  try {
    const notification = await this.create(data);
    await notification.populate('sender recipient', 'fullName username profilePicture');
    return notification;
  } catch (error) {
    throw error;
  }
};

// Static method to mark as read
notificationSchema.statics.markAsRead = async function(notificationId, userId) {
  return this.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({
    recipient: userId,
    isRead: false
  });
};

// Static method to get notifications with pagination
notificationSchema.statics.getUserNotifications = async function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  const notifications = await this.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'fullName username profilePicture')
    .populate('relatedTask', 'title status')
    .populate('relatedTeam', 'name');
  
  const total = await this.countDocuments({ recipient: userId });
  
  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

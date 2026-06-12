const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'completed', 'archived'],
    default: 'todo',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  dueDate: {
    type: Date,
    default: null,
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  attachments: [{
    filename: String,
    url: String,
    publicId: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null,
    index: true
  },
  isTeamTask: {
    type: Boolean,
    default: false,
    index: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  availableForTeam: {
    type: Boolean,
    default: false
  },
  position: {
    type: Number,
    default: 0
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  estimatedHours: {
    type: Number,
    default: null
  },
  actualHours: {
    type: Number,
    default: null
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  checklist: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  customFields: {
    type: Map,
    of: String,
    default: new Map()
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ team: 1, status: 1 });
taskSchema.index({ dueDate: 1, status: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for comments
taskSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'task'
});

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed') {
    return false;
  }
  return new Date() > this.dueDate;
});

// Update completedAt when status changes to completed
taskSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
      this.progress = 100;
    } else if (this.status !== 'completed') {
      this.completedAt = null;
    }
  }
  next();
});

// Static method to get tasks by status
taskSchema.statics.getTasksByStatus = function(userId, status) {
  return this.find({
    $or: [
      { createdBy: userId },
      { assignedTo: userId }
    ],
    status: status
  }).populate('createdBy assignedTo', 'fullName username profilePicture');
};

// Static method to get overdue tasks
taskSchema.statics.getOverdueTasks = function(userId) {
  return this.find({
    $or: [
      { createdBy: userId },
      { assignedTo: userId }
    ],
    status: { $nin: ['completed', 'archived'] },
    dueDate: { $lt: new Date() }
  }).populate('createdBy assignedTo', 'fullName username profilePicture');
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

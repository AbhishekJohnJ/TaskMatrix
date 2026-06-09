const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    maxlength: [100, 'Team name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['member', 'manager', 'owner'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  invitations: [{
    email: {
      type: String,
      required: true
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    invitedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  }],
  avatar: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: '#667eea'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowMemberInvite: {
      type: Boolean,
      default: false
    },
    defaultTaskVisibility: {
      type: String,
      enum: ['team', 'private'],
      default: 'team'
    }
  },
  stats: {
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    activeTasks: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
teamSchema.index({ owner: 1 });
teamSchema.index({ 'members.user': 1 });
teamSchema.index({ name: 'text', description: 'text' });

// Virtual for tasks
teamSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'team'
});

// Method to check if user is a member
teamSchema.methods.isMember = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString()
  );
};

// Method to check if user is owner or manager
teamSchema.methods.canManage = function(userId) {
  if (this.owner.toString() === userId.toString()) {
    return true;
  }
  
  const member = this.members.find(m => 
    m.user.toString() === userId.toString()
  );
  
  return member && (member.role === 'manager' || member.role === 'owner');
};

// Method to add member
teamSchema.methods.addMember = function(userId, role = 'member') {
  if (!this.isMember(userId)) {
    this.members.push({
      user: userId,
      role: role,
      joinedAt: new Date()
    });
  }
};

// Method to remove member
teamSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => 
    member.user.toString() !== userId.toString()
  );
};

// Pre-save middleware to ensure owner is in members
teamSchema.pre('save', function(next) {
  if (this.isNew && !this.isMember(this.owner)) {
    this.members.push({
      user: this.owner,
      role: 'owner',
      joinedAt: new Date()
    });
  }
  next();
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;

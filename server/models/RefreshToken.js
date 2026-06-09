const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  createdByIp: {
    type: String,
    default: null
  },
  revokedAt: {
    type: Date,
    default: null
  },
  revokedByIp: {
    type: String,
    default: null
  },
  replacedByToken: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for automatic deletion of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual to check if token is expired
refreshTokenSchema.virtual('isExpired').get(function() {
  return Date.now() >= this.expiresAt;
});

// Virtual to check if token is active
refreshTokenSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired && !this.revokedAt;
});

// Method to revoke token
refreshTokenSchema.methods.revoke = function(ipAddress) {
  this.revokedAt = Date.now();
  this.revokedByIp = ipAddress;
  this.isActive = false;
};

// Static method to create refresh token
refreshTokenSchema.statics.createToken = async function(userId, token, expiresAt, ipAddress) {
  return this.create({
    token,
    user: userId,
    expiresAt,
    createdByIp: ipAddress,
    isActive: true
  });
};

// Static method to revoke all user tokens
refreshTokenSchema.statics.revokeAllUserTokens = async function(userId, ipAddress) {
  return this.updateMany(
    { user: userId, isActive: true },
    { 
      revokedAt: Date.now(),
      revokedByIp: ipAddress,
      isActive: false
    }
  );
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;

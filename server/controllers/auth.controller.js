const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendEmail, emailTemplates } = require('../config/email');
const crypto = require('crypto');
const ActivityLog = require('../models/ActivityLog');

// Register new user
exports.register = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }
    
    // Create user
    const user = await User.create({
      fullName,
      username,
      email,
      password
    });
    
    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    // Save refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await RefreshToken.createToken(user._id, refreshToken, expiresAt, req.ip);
    
    // Send welcome email
    try {
      const emailContent = emailTemplates.welcome(user.fullName);
      await sendEmail({
        to: user.email,
        ...emailContent
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }
    
    // Log activity
    await ActivityLog.logActivity({
      user: user._id,
      action: 'user_login',
      description: `${user.fullName} registered and logged in`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error registering user'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated'
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    // Save refresh token
    const expiresAt = new Date(
      Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000
    );
    await RefreshToken.createToken(user._id, refreshToken, expiresAt, req.ip);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Log activity
    await ActivityLog.logActivity({
      user: user._id,
      action: 'user_login',
      description: `${user.fullName} logged in`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          preferences: user.preferences
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error logging in'
    });
  }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token is required'
      });
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Check if token exists in database
    const tokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      user: decoded.id,
      isActive: true
    });
    
    if (!tokenDoc || !tokenDoc.isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired refresh token'
      });
    }
    
    // Generate new access token
    const accessToken = generateAccessToken(decoded.id);
    
    res.json({
      status: 'success',
      data: {
        accessToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired refresh token'
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      // Revoke refresh token
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken, user: req.user.id },
        {
          revokedAt: Date.now(),
          revokedByIp: req.ip,
          isActive: false
        }
      );
    }
    
    // Log activity
    await ActivityLog.logActivity({
      user: req.user.id,
      action: 'user_logout',
      description: `${req.user.fullName} logged out`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.json({
      status: 'success',
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error logging out'
    });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal that user doesn't exist
      return res.json({
        status: 'success',
        message: 'If your email is registered, you will receive a password reset link'
      });
    }
    
    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    // Send email
    try {
      const emailContent = emailTemplates.passwordReset(resetUrl, user.fullName);
      await sendEmail({
        to: user.email,
        ...emailContent
      });
      
      res.json({
        status: 'success',
        message: 'Password reset link sent to your email'
      });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        status: 'error',
        message: 'Error sending email. Please try again later'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error processing request'
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token'
      });
    }
    
    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    // Revoke all refresh tokens
    await RefreshToken.revokeAllUserTokens(user._id, req.ip);
    
    // Log activity
    await ActivityLog.logActivity({
      user: user._id,
      action: 'password_changed',
      description: `${user.fullName} reset password`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.json({
      status: 'success',
      message: 'Password reset successful. Please login with your new password'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error resetting password'
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user'
    });
  }
};

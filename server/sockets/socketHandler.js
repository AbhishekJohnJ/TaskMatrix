const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store online users
const onlineUsers = new Map();

module.exports = (io) => {
  // Socket.IO middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.username} (${socket.id})`);
    
    // Add user to online users
    onlineUsers.set(socket.user._id.toString(), {
      socketId: socket.id,
      user: {
        _id: socket.user._id,
        username: socket.user.username,
        fullName: socket.user.fullName,
        profilePicture: socket.user.profilePicture
      }
    });
    
    // Join user's personal room
    socket.join(`user:${socket.user._id}`);
    
    // Broadcast online status
    io.emit('user:online', {
      userId: socket.user._id,
      username: socket.user.username,
      fullName: socket.user.fullName
    });
    
    // Emit current online users to the connected user
    socket.emit('users:online', Array.from(onlineUsers.values()).map(u => u.user));
    
    // Join team rooms
    socket.on('team:join', (teamId) => {
      socket.join(`team:${teamId}`);
      console.log(`User ${socket.user.username} joined team: ${teamId}`);
    });
    
    // Leave team rooms
    socket.on('team:leave', (teamId) => {
      socket.leave(`team:${teamId}`);
      console.log(`User ${socket.user.username} left team: ${teamId}`);
    });
    
    // Task events
    socket.on('task:create', (data) => {
      // Broadcast to team or assigned user
      if (data.team) {
        io.to(`team:${data.team}`).emit('task:created', data);
      }
      if (data.assignedTo) {
        io.to(`user:${data.assignedTo}`).emit('task:assigned', data);
      }
    });
    
    socket.on('task:update', (data) => {
      // Broadcast to relevant users
      if (data.team) {
        io.to(`team:${data.team}`).emit('task:updated', data);
      }
      if (data.assignedTo) {
        io.to(`user:${data.assignedTo}`).emit('task:updated', data);
      }
      if (data.createdBy) {
        io.to(`user:${data.createdBy}`).emit('task:updated', data);
      }
    });
    
    socket.on('task:delete', (data) => {
      // Broadcast to relevant users
      if (data.team) {
        io.to(`team:${data.team}`).emit('task:deleted', data);
      }
      if (data.assignedTo) {
        io.to(`user:${data.assignedTo}`).emit('task:deleted', data);
      }
    });
    
    // Comment events
    socket.on('comment:add', (data) => {
      // Broadcast to all users watching the task
      io.emit('comment:added', data);
    });
    
    socket.on('comment:update', (data) => {
      io.emit('comment:updated', data);
    });
    
    socket.on('comment:delete', (data) => {
      io.emit('comment:deleted', data);
    });
    
    // Notification events
    socket.on('notification:read', (data) => {
      socket.emit('notification:marked-read', data);
    });
    
    // Typing indicators
    socket.on('typing:start', (data) => {
      socket.broadcast.emit('user:typing', {
        userId: socket.user._id,
        username: socket.user.username,
        taskId: data.taskId
      });
    });
    
    socket.on('typing:stop', (data) => {
      socket.broadcast.emit('user:stopped-typing', {
        userId: socket.user._id,
        taskId: data.taskId
      });
    });
    
    // Disconnect event
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.username} (${socket.id})`);
      
      // Remove user from online users
      onlineUsers.delete(socket.user._id.toString());
      
      // Broadcast offline status
      io.emit('user:offline', {
        userId: socket.user._id,
        username: socket.user.username
      });
    });
    
    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
  
  // Helper function to emit to specific user
  io.emitToUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
  };
  
  // Helper function to emit to team
  io.emitToTeam = (teamId, event, data) => {
    io.to(`team:${teamId}`).emit(event, data);
  };
  
  // Helper function to get online users
  io.getOnlineUsers = () => {
    return Array.from(onlineUsers.values()).map(u => u.user);
  };
  
  // Helper function to check if user is online
  io.isUserOnline = (userId) => {
    return onlineUsers.has(userId.toString());
  };
};

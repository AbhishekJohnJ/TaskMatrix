const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

// Get task comments
exports.getTaskComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await Comment.getTaskComments(req.params.taskId, page, limit);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching comments'
    });
  }
};

// Create comment
exports.createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content, parentComment, mentions } = req.body;
    
    // Check if task exists
    const task = await Task.findById(taskId).populate('createdBy assignedTo');
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    const comment = await Comment.create({
      content,
      task: taskId,
      author: req.user.id,
      parentComment,
      mentions
    });
    
    await comment.populate('author', 'fullName username profilePicture');
    
    // Create notifications for mentions
    if (mentions && mentions.length > 0) {
      const notifications = mentions.map(userId => ({
        recipient: userId,
        sender: req.user.id,
        type: 'mention',
        title: 'You were mentioned',
        message: `${req.user.fullName} mentioned you in a comment on "${task.title}"`,
        relatedTask: taskId,
        relatedComment: comment._id,
        actionUrl: `/tasks/${taskId}`
      }));
      
      await Promise.all(notifications.map(n => Notification.createNotification(n)));
    }
    
    // Notify task owner and assignee
    const notifyUsers = [task.createdBy._id, task.assignedTo?._id].filter(
      id => id && id.toString() !== req.user.id.toString()
    );
    
    await Promise.all(notifyUsers.map(userId =>
      Notification.createNotification({
        recipient: userId,
        sender: req.user.id,
        type: 'task_commented',
        title: 'New Comment',
        message: `${req.user.fullName} commented on "${task.title}"`,
        relatedTask: taskId,
        relatedComment: comment._id,
        actionUrl: `/tasks/${taskId}`
      })
    ));
    
    // Emit socket event
    const io = req.app.get('io');
    io.emit('comment:added', { taskId, comment });
    
    res.status(201).json({
      status: 'success',
      message: 'Comment added successfully',
      data: { comment }
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating comment'
    });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: 'Comment not found'
      });
    }
    
    // Check ownership
    if (comment.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only edit your own comments'
      });
    }
    
    comment.content = req.body.content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();
    
    await comment.populate('author', 'fullName username profilePicture');
    
    // Emit socket event
    const io = req.app.get('io');
    io.emit('comment:updated', comment);
    
    res.json({
      status: 'success',
      message: 'Comment updated successfully',
      data: { comment }
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating comment'
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: 'Comment not found'
      });
    }
    
    // Check ownership or admin
    if (comment.author.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete your own comments'
      });
    }
    
    comment.isDeleted = true;
    comment.content = '[This comment has been deleted]';
    await comment.save();
    
    // Emit socket event
    const io = req.app.get('io');
    io.emit('comment:deleted', { commentId: comment._id, taskId: comment.task });
    
    res.json({
      status: 'success',
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting comment'
    });
  }
};

// Add reaction
exports.addReaction = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: 'Comment not found'
      });
    }
    
    comment.addReaction(req.user.id, req.body.emoji);
    await comment.save();
    
    res.json({
      status: 'success',
      message: 'Reaction added',
      data: { reactions: comment.reactions }
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adding reaction'
    });
  }
};

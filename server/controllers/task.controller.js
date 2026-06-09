const Task = require('../models/Task');
const User = require('../models/User');
const Team = require('../models/Team');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const { getPaginationParams, buildQueryFilters } = require('../utils/helpers');

// Create task
exports.createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const task = await Task.create(taskData);
    await task.populate('createdBy assignedTo', 'fullName username profilePicture');
    
    // Create notification if task is assigned
    if (task.assignedTo && task.assignedTo._id.toString() !== req.user.id.toString()) {
      await Notification.createNotification({
        recipient: task.assignedTo._id,
        sender: req.user.id,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `${req.user.fullName} assigned you a task: ${task.title}`,
        relatedTask: task._id,
        actionUrl: `/tasks/${task._id}`
      });
      
      // Emit socket event
      const io = req.app.get('io');
      io.emitToUser(task.assignedTo._id, 'notification', {
        type: 'task_assigned',
        task: task
      });
    }
    
    // Log activity
    await ActivityLog.logActivity({
      user: req.user.id,
      action: 'task_created',
      description: `Created task: ${task.title}`,
      relatedTask: task._id,
      relatedTeam: task.team,
      ipAddress: req.ip
    });
    
    // Emit socket event for task creation
    const io = req.app.get('io');
    if (task.team) {
      io.emitToTeam(task.team, 'task:created', task);
    }
    
    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating task'
    });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    
    // Build query
    const query = {
      $or: [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    };
    
    // Apply filters
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    
    if (req.query.team) {
      query.team = req.query.team;
    }
    
    if (req.query.tags) {
      query.tags = { $in: req.query.tags.split(',') };
    }
    
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    if (req.query.dueDateFrom || req.query.dueDateTo) {
      query.dueDate = {};
      if (req.query.dueDateFrom) {
        query.dueDate.$gte = new Date(req.query.dueDateFrom);
      }
      if (req.query.dueDateTo) {
        query.dueDate.$lte = new Date(req.query.dueDateTo);
      }
    }
    
    // Build sort
    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };
    
    // Execute query
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy assignedTo', 'fullName username profilePicture')
      .populate('team', 'name color');
    
    const total = await Task.countDocuments(query);
    
    res.json({
      status: 'success',
      data: {
        tasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching tasks'
    });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy assignedTo', 'fullName username profilePicture email')
      .populate('team', 'name color members')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'fullName username profilePicture'
        }
      });
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    // Check access
    if (req.user.role !== 'admin') {
      const hasAccess = task.createdBy._id.toString() === req.user.id.toString() ||
                        (task.assignedTo && task.assignedTo._id.toString() === req.user.id.toString()) ||
                        (task.team && await Team.findOne({ _id: task.team, 'members.user': req.user.id }));
      
      if (!hasAccess) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have access to this task'
        });
      }
    }
    
    res.json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching task'
    });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    // Check permission
    if (req.user.role !== 'admin' && 
        task.createdBy.toString() !== req.user.id.toString() && 
        (!task.assignedTo || task.assignedTo.toString() !== req.user.id.toString())) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to update this task'
      });
    }
    
    // Store old values for activity log
    const oldStatus = task.status;
    const oldAssignedTo = task.assignedTo;
    
    // Update task
    Object.assign(task, req.body);
    await task.save();
    await task.populate('createdBy assignedTo', 'fullName username profilePicture');
    
    // Create notifications for status change
    if (oldStatus !== task.status && task.assignedTo) {
      await Notification.createNotification({
        recipient: task.assignedTo._id,
        sender: req.user.id,
        type: 'task_updated',
        title: 'Task Updated',
        message: `Task "${task.title}" status changed to ${task.status}`,
        relatedTask: task._id,
        actionUrl: `/tasks/${task._id}`
      });
    }
    
    // Create notification for new assignment
    if (oldAssignedTo?.toString() !== task.assignedTo?.toString() && task.assignedTo) {
      await Notification.createNotification({
        recipient: task.assignedTo._id,
        sender: req.user.id,
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `${req.user.fullName} assigned you a task: ${task.title}`,
        relatedTask: task._id,
        actionUrl: `/tasks/${task._id}`
      });
    }
    
    // Log activity
    await ActivityLog.logActivity({
      user: req.user.id,
      action: 'task_updated',
      description: `Updated task: ${task.title}`,
      relatedTask: task._id,
      relatedTeam: task.team,
      changes: {
        before: { status: oldStatus, assignedTo: oldAssignedTo },
        after: { status: task.status, assignedTo: task.assignedTo }
      },
      ipAddress: req.ip
    });
    
    // Emit socket event
    const io = req.app.get('io');
    if (task.team) {
      io.emitToTeam(task.team, 'task:updated', task);
    }
    if (task.assignedTo) {
      io.emitToUser(task.assignedTo._id, 'task:updated', task);
    }
    
    res.json({
      status: 'success',
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating task'
    });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    // Check permission
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to delete this task'
      });
    }
    
    await task.deleteOne();
    
    // Log activity
    await ActivityLog.logActivity({
      user: req.user.id,
      action: 'task_deleted',
      description: `Deleted task: ${task.title}`,
      relatedTeam: task.team,
      ipAddress: req.ip
    });
    
    // Emit socket event
    const io = req.app.get('io');
    if (task.team) {
      io.emitToTeam(task.team, 'task:deleted', { taskId: task._id });
    }
    
    res.json({
      status: 'success',
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting task'
    });
  }
};

// Get tasks by status (for Kanban board)
exports.getTasksByStatus = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    })
      .populate('createdBy assignedTo', 'fullName username profilePicture')
      .populate('team', 'name color')
      .sort({ position: 1, createdAt: -1 });
    
    // Group by status
    const grouped = {
      todo: [],
      'in-progress': [],
      review: [],
      completed: []
    };
    
    tasks.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });
    
    res.json({
      status: 'success',
      data: grouped
    });
  } catch (error) {
    console.error('Get tasks by status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching tasks'
    });
  }
};

// Duplicate task
exports.duplicateTask = async (req, res) => {
  try {
    const originalTask = await Task.findById(req.params.id);
    
    if (!originalTask) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    const taskData = {
      title: `${originalTask.title} (Copy)`,
      description: originalTask.description,
      status: 'todo',
      priority: originalTask.priority,
      tags: originalTask.tags,
      team: originalTask.team,
      createdBy: req.user.id,
      estimatedHours: originalTask.estimatedHours
    };
    
    const newTask = await Task.create(taskData);
    await newTask.populate('createdBy', 'fullName username profilePicture');
    
    res.status(201).json({
      status: 'success',
      message: 'Task duplicated successfully',
      data: { task: newTask }
    });
  } catch (error) {
    console.error('Duplicate task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error duplicating task'
    });
  }
};

// Archive/Unarchive task
exports.archiveTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    task.isArchived = !task.isArchived;
    task.status = task.isArchived ? 'archived' : 'todo';
    await task.save();
    
    res.json({
      status: 'success',
      message: `Task ${task.isArchived ? 'archived' : 'unarchived'} successfully`,
      data: { task }
    });
  } catch (error) {
    console.error('Archive task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error archiving task'
    });
  }
};

// Upload task attachment
exports.uploadAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }
    
    const attachment = {
      filename: req.file.originalname,
      url: req.file.path,
      publicId: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedAt: new Date()
    };
    
    task.attachments.push(attachment);
    await task.save();
    
    res.json({
      status: 'success',
      message: 'Attachment uploaded successfully',
      data: { attachment }
    });
  } catch (error) {
    console.error('Upload attachment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error uploading attachment'
    });
  }
};

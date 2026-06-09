const Task = require('../models/Task');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// Get dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get task statistics
    const [
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      tasksByStatus,
      tasksByPriority,
      weeklyTasks,
      monthlyTasks
    ] = await Promise.all([
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
      }),
      // Tasks by status
      Task.aggregate([
        {
          $match: {
            $or: [{ createdBy: userId }, { assignedTo: userId }]
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      // Tasks by priority
      Task.aggregate([
        {
          $match: {
            $or: [{ createdBy: userId }, { assignedTo: userId }],
            status: { $ne: 'completed' }
          }
        },
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]),
      // Weekly completed tasks
      Task.countDocuments({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
        status: 'completed',
        completedAt: { $gte: startOfWeek }
      }),
      // Monthly completed tasks
      Task.countDocuments({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
        status: 'completed',
        completedAt: { $gte: startOfMonth }
      })
    ]);
    
    // Calculate productivity score
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const onTimeRate = completedTasks > 0 ? ((completedTasks - overdueTasks) / completedTasks) * 100 : 0;
    const productivityScore = Math.round((completionRate * 0.6) + (onTimeRate * 0.4));
    
    res.json({
      status: 'success',
      data: {
        overview: {
          totalTasks,
          completedTasks,
          pendingTasks,
          inProgressTasks,
          overdueTasks,
          completionRate: Math.round(completionRate),
          productivityScore
        },
        tasksByStatus: tasksByStatus.map(item => ({
          status: item._id,
          count: item.count
        })),
        tasksByPriority: tasksByPriority.map(item => ({
          priority: item._id,
          count: item.count
        })),
        weekly: {
          completedTasks: weeklyTasks
        },
        monthly: {
          completedTasks: monthlyTasks
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching analytics'
    });
  }
};

// Get task trends
exports.getTaskTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30' } = req.query;
    
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    
    const trends = await Task.aggregate([
      {
        $match: {
          $or: [{ createdBy: userId }, { assignedTo: userId }],
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          created: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      status: 'success',
      data: { trends }
    });
  } catch (error) {
    console.error('Get task trends error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching task trends'
    });
  }
};

// Get team analytics (Admin only)
exports.getTeamAnalytics = async (req, res) => {
  try {
    const teamStats = await User.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'assignedTasks'
        }
      },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'createdBy',
          as: 'createdTasks'
        }
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          profilePicture: 1,
          totalAssigned: { $size: '$assignedTasks' },
          totalCreated: { $size: '$createdTasks' },
          completed: {
            $size: {
              $filter: {
                input: '$assignedTasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'completed'] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $eq: ['$totalAssigned', 0] },
              0,
              { $multiply: [{ $divide: ['$completed', '$totalAssigned'] }, 100] }
            ]
          }
        }
      },
      { $sort: { completionRate: -1 } }
    ]);
    
    res.json({
      status: 'success',
      data: { teamStats }
    });
  } catch (error) {
    console.error('Get team analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching team analytics'
    });
  }
};

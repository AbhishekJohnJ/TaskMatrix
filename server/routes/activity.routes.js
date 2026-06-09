const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get user activities
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filters = {
      action: req.query.action,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const result = await ActivityLog.getUserActivities(req.user.id, page, limit, filters);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching activities'
    });
  }
});

// Get team activities
router.get('/team/:teamId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await ActivityLog.getTeamActivities(req.params.teamId, page, limit);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Get team activities error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching team activities'
    });
  }
});

module.exports = router;

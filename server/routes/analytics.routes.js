const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect, restrictTo } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/dashboard', analyticsController.getDashboardAnalytics);
router.get('/trends', analyticsController.getTaskTrends);
router.get('/team', restrictTo('admin'), analyticsController.getTeamAnalytics);

module.exports = router;

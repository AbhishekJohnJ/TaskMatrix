const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { uploadProfile } = require('../config/cloudinary');
const { updateProfileValidator, updateNotificationPreferencesValidator } = require('../validators/user.validator');
const { changePasswordValidator } = require('../validators/auth.validator');

// All routes are protected
router.use(protect);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidator, validate, userController.updateProfile);
router.put('/profile/picture', uploadProfile.single('profilePicture'), userController.updateProfilePicture);
router.put('/password', changePasswordValidator, validate, userController.changePassword);
router.put('/preferences', userController.updatePreferences);
router.get('/stats', userController.getUserStats);

// Search users
router.get('/search', userController.searchUsers);

// Admin only routes
router.get('/', restrictTo('admin'), userController.getAllUsers);
router.delete('/:id', restrictTo('admin'), userController.deleteUser);

module.exports = router;

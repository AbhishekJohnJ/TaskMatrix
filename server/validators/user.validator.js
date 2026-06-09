const { body } = require('express-validator');

exports.updateProfileValidator = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .toLowerCase(),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Invalid theme value'),
  
  body('preferences.language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Invalid language code')
];

exports.updateNotificationPreferencesValidator = [
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
  
  body('notifications.taskAssigned')
    .optional()
    .isBoolean()
    .withMessage('Task assigned notifications must be a boolean'),
  
  body('notifications.taskUpdated')
    .optional()
    .isBoolean()
    .withMessage('Task updated notifications must be a boolean'),
  
  body('notifications.dueDateReminder')
    .optional()
    .isBoolean()
    .withMessage('Due date reminder must be a boolean')
];

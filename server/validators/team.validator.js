const { body, param } = require('express-validator');

exports.createTeamValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Team name must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Invalid color format. Use hex color (e.g., #667eea)')
];

exports.updateTeamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid team ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Team name must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Invalid color format. Use hex color (e.g., #667eea)')
];

exports.teamIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid team ID')
];

exports.inviteMemberValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid team ID'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

exports.updateMemberRoleValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid team ID'),
  
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['member', 'manager', 'owner'])
    .withMessage('Invalid role. Must be one of: member, manager, owner')
];

const { body, param } = require('express-validator');

exports.createCommentValidator = [
  param('taskId')
    .isMongoId()
    .withMessage('Invalid task ID'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  
  body('parentComment')
    .optional()
    .isMongoId()
    .withMessage('Invalid parent comment ID'),
  
  body('mentions')
    .optional()
    .isArray()
    .withMessage('Mentions must be an array'),
  
  body('mentions.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID in mentions')
];

exports.updateCommentValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid comment ID'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
];

exports.commentIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid comment ID')
];

exports.addReactionValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid comment ID'),
  
  body('emoji')
    .trim()
    .notEmpty()
    .withMessage('Emoji is required')
    .isLength({ min: 1, max: 10 })
    .withMessage('Invalid emoji format')
];

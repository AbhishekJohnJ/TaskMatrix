const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  createCommentValidator,
  updateCommentValidator,
  commentIdValidator,
  addReactionValidator
} = require('../validators/comment.validator');

// All routes are protected
router.use(protect);

router.get('/task/:taskId', commentController.getTaskComments);
router.post('/task/:taskId', createCommentValidator, validate, commentController.createComment);
router.put('/:id', updateCommentValidator, validate, commentController.updateComment);
router.delete('/:id', commentIdValidator, validate, commentController.deleteComment);
router.post('/:id/reaction', addReactionValidator, validate, commentController.addReaction);

module.exports = router;

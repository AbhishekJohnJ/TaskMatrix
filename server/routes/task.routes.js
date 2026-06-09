const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { protect, restrictTo } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { uploadAttachment } = require('../config/cloudinary');
const {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
  taskQueryValidator
} = require('../validators/task.validator');

// All routes are protected
router.use(protect);

// Task routes
router.route('/')
  .get(taskQueryValidator, validate, taskController.getAllTasks)
  .post(createTaskValidator, validate, taskController.createTask);

router.get('/by-status', taskController.getTasksByStatus);

router.route('/:id')
  .get(taskIdValidator, validate, taskController.getTask)
  .put(updateTaskValidator, validate, taskController.updateTask)
  .delete(taskIdValidator, validate, taskController.deleteTask);

router.post('/:id/duplicate', taskIdValidator, validate, taskController.duplicateTask);
router.patch('/:id/archive', taskIdValidator, validate, taskController.archiveTask);

router.post('/:id/attachments', 
  taskIdValidator, 
  validate,
  uploadAttachment.single('file'),
  taskController.uploadAttachment
);

module.exports = router;

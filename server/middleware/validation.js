const { validationResult } = require('express-validator');

// Validation middleware to check for errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

// Check if user owns the resource or is admin
exports.checkOwnership = (model) => async (req, res, next) => {
  try {
    const resource = await model.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found'
      });
    }
    
    // Admin can access all resources
    if (req.user.role === 'admin') {
      req.resource = resource;
      return next();
    }
    
    // Check ownership based on model
    const isOwner = resource.createdBy?.toString() === req.user.id.toString() ||
                    resource.author?.toString() === req.user.id.toString() ||
                    resource.user?.toString() === req.user.id.toString() ||
                    resource.owner?.toString() === req.user.id.toString();
    
    if (!isOwner) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this resource'
      });
    }
    
    req.resource = resource;
    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error checking ownership'
    });
  }
};

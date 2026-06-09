const crypto = require('crypto');

// Generate random token
exports.generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash token
exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Pagination helper
exports.getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

// Build query from filters
exports.buildQueryFilters = (filters) => {
  const query = {};
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    if (value === undefined || value === null || value === '') {
      return;
    }
    
    // Handle array filters (e.g., status: ['todo', 'in-progress'])
    if (Array.isArray(value)) {
      query[key] = { $in: value };
    }
    // Handle date range
    else if (key.endsWith('From') || key.endsWith('To')) {
      const field = key.replace(/From|To$/, '');
      if (!query[field]) query[field] = {};
      
      if (key.endsWith('From')) {
        query[field].$gte = new Date(value);
      } else {
        query[field].$lte = new Date(value);
      }
    }
    // Handle search (text search)
    else if (key === 'search') {
      query.$text = { $search: value };
    }
    // Regular equality
    else {
      query[key] = value;
    }
  });
  
  return query;
};

// Format date
exports.formatDate = (date) => {
  return new Date(date).toISOString();
};

// Calculate days difference
exports.getDaysDifference = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Sanitize user input
exports.sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};

// Generate initials from name
exports.getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Check if date is overdue
exports.isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

// Calculate completion percentage
exports.calculateCompletionPercentage = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Generate random color
exports.generateRandomColor = () => {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#fee140', '#30cfd0'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Validate email format
exports.isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

// Validate password strength
exports.isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Parse sort parameter
exports.parseSortParam = (sortParam) => {
  if (!sortParam) return { createdAt: -1 };
  
  const [field, order] = sortParam.split(':');
  return { [field]: order === 'asc' ? 1 : -1 };
};

// Create slug from string
exports.createSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Local storage utilities for storing data in the browser

const STORAGE_KEYS = {
  USERS: 'taskmatrix_users',
  TASKS: 'taskmatrix_tasks',
  TEAMS: 'taskmatrix_teams',
  NOTIFICATIONS: 'taskmatrix_notifications',
  COMMENTS: 'taskmatrix_comments',
  CURRENT_USER: 'taskmatrix_current_user',
  TOKEN: 'token',
};

// Generic get/set functions
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return null;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to storage:`, error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    return false;
  }
};

// User functions
export const saveUser = (user) => {
  const users = getFromStorage(STORAGE_KEYS.USERS) || [];
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  return setToStorage(STORAGE_KEYS.USERS, users);
};

export const getUsers = () => {
  return getFromStorage(STORAGE_KEYS.USERS) || [];
};

export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

export const getCurrentUser = () => {
  return getFromStorage(STORAGE_KEYS.CURRENT_USER);
};

export const setCurrentUser = (user) => {
  return setToStorage(STORAGE_KEYS.CURRENT_USER, user);
};

export const clearCurrentUser = () => {
  removeFromStorage(STORAGE_KEYS.CURRENT_USER);
  removeFromStorage(STORAGE_KEYS.TOKEN);
};

export const updateUser = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index >= 0) {
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setToStorage(STORAGE_KEYS.USERS, users);
    
    // Update current user if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(users[index]);
      // Also update in localStorage under 'user' key for Redux
      localStorage.setItem('user', JSON.stringify(users[index]));
    }
    
    return users[index];
  }
  return null;
};

// Task functions
export const saveTasks = (tasks) => {
  return setToStorage(STORAGE_KEYS.TASKS, tasks);
};

export const getTasks = () => {
  return getFromStorage(STORAGE_KEYS.TASKS) || [];
};

export const addTask = (task) => {
  const tasks = getTasks();
  const newTask = {
    ...task,
    id: task.id || Date.now().toString(),
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const updateTask = (taskId, updates) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  
  if (index >= 0) {
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveTasks(tasks);
    return tasks[index];
  }
  return null;
};

export const deleteTask = (taskId) => {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== taskId);
  saveTasks(filtered);
  return true;
};

export const getTaskById = (taskId) => {
  const tasks = getTasks();
  return tasks.find(t => t.id === taskId);
};

// Team functions
export const saveTeams = (teams) => {
  return setToStorage(STORAGE_KEYS.TEAMS, teams);
};

export const getTeams = () => {
  return getFromStorage(STORAGE_KEYS.TEAMS) || [];
};

export const addTeam = (team) => {
  const teams = getTeams();
  const newTeam = {
    ...team,
    id: team.id || Date.now().toString(),
    createdAt: team.createdAt || new Date().toISOString(),
  };
  teams.push(newTeam);
  saveTeams(teams);
  return newTeam;
};

export const updateTeam = (teamId, updates) => {
  const teams = getTeams();
  const index = teams.findIndex(t => t.id === teamId);
  
  if (index >= 0) {
    teams[index] = { ...teams[index], ...updates };
    saveTeams(teams);
    return teams[index];
  }
  return null;
};

export const deleteTeam = (teamId) => {
  const teams = getTeams();
  const filtered = teams.filter(t => t.id !== teamId);
  saveTeams(filtered);
  return true;
};

// Notification functions
export const getNotifications = () => {
  return getFromStorage(STORAGE_KEYS.NOTIFICATIONS) || [];
};

export const addNotification = (notification) => {
  const notifications = getNotifications();
  const newNotification = {
    ...notification,
    id: notification.id || Date.now().toString(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(newNotification);
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  return newNotification;
};

export const markNotificationAsRead = (notificationId) => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === notificationId);
  
  if (index >= 0) {
    notifications[index].read = true;
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return true;
  }
  return false;
};

export const clearAllNotifications = () => {
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, []);
};

// Comment functions
export const getComments = (taskId) => {
  const allComments = getFromStorage(STORAGE_KEYS.COMMENTS) || [];
  return allComments.filter(c => c.taskId === taskId);
};

export const addComment = (comment) => {
  const comments = getFromStorage(STORAGE_KEYS.COMMENTS) || [];
  const newComment = {
    ...comment,
    id: comment.id || Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  comments.push(newComment);
  setToStorage(STORAGE_KEYS.COMMENTS, comments);
  return newComment;
};

export const deleteComment = (commentId) => {
  const comments = getFromStorage(STORAGE_KEYS.COMMENTS) || [];
  const filtered = comments.filter(c => c.id !== commentId);
  setToStorage(STORAGE_KEYS.COMMENTS, filtered);
  return true;
};

// Initialize with demo data if empty
export const initializeDemoData = (userId) => {
  const tasks = getTasks();
  
  if (tasks.length === 0) {
    const demoTasks = [
      {
        id: '1',
        title: 'Welcome to TaskMatrix',
        description: 'This is your first task! Try dragging it to different columns in the Kanban board.',
        status: 'todo',
        priority: 'high',
        assignedTo: userId,
        tags: ['demo', 'getting-started'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Explore the Dashboard',
        description: 'Check out your analytics and task statistics',
        status: 'in-progress',
        priority: 'medium',
        assignedTo: userId,
        tags: ['demo'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Create Your First Task',
        description: 'Click the "New Task" button to create your own task',
        status: 'done',
        priority: 'low',
        assignedTo: userId,
        tags: ['demo', 'completed'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    saveTasks(demoTasks);
    
    // Add welcome notification
    addNotification({
      title: 'Welcome to TaskMatrix!',
      message: 'Your account has been created successfully. Start by creating your first task!',
      type: 'success',
    });
  }
};

export default STORAGE_KEYS;

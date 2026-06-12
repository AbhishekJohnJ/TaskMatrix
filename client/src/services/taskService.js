import api from './api';

export const taskService = {
  // Get all tasks
  getAllTasks: async (params) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get single task
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Get tasks by status (Kanban)
  getTasksByStatus: async () => {
    const response = await api.get('/tasks/by-status');
    return response.data;
  },

  // Duplicate task
  duplicateTask: async (id) => {
    const response = await api.post(`/tasks/${id}/duplicate`);
    return response.data;
  },

  // Archive task
  archiveTask: async (id) => {
    const response = await api.patch(`/tasks/${id}/archive`);
    return response.data;
  },

  // Upload attachment
  uploadAttachment: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/tasks/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get team tasks
  getTeamTasks: async (teamId) => {
    const response = await api.get(`/tasks/team/${teamId}`);
    return response.data;
  },

  // Get available team tasks
  getAvailableTeamTasks: async (teamId) => {
    const response = await api.get(`/tasks/team/${teamId}/available`);
    return response.data;
  },

  // Assign team task
  assignTeamTask: async (taskId, assignedTo) => {
    const response = await api.patch(`/tasks/${taskId}/assign`, { assignedTo });
    return response.data;
  },

  // Take team task
  takeTeamTask: async (taskId) => {
    const response = await api.patch(`/tasks/${taskId}/take`);
    return response.data;
  },
};

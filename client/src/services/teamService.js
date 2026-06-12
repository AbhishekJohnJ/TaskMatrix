import api from './api';

export const teamService = {
  // Get all teams
  getAllTeams: async () => {
    const response = await api.get('/teams');
    return response.data;
  },

  // Get single team
  getTeam: async (id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },

  // Create team
  createTeam: async (teamData) => {
    const response = await api.post('/teams', teamData);
    return response.data;
  },

  // Update team
  updateTeam: async (id, teamData) => {
    const response = await api.put(`/teams/${id}`, teamData);
    return response.data;
  },

  // Delete team
  deleteTeam: async (id) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },

  // Invite member
  inviteMember: async (teamId, email) => {
    const response = await api.post(`/teams/${teamId}/invite`, { email });
    return response.data;
  },

  // Remove member
  removeMember: async (teamId, userId) => {
    const response = await api.delete(`/teams/${teamId}/members/${userId}`);
    return response.data;
  },

  // Create team task
  createTeamTask: async (teamId, taskData) => {
    const response = await api.post(`/teams/${teamId}/tasks`, taskData);
    return response.data;
  },
};

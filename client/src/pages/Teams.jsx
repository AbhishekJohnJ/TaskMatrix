import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUsers, FiMail } from 'react-icons/fi';
import { HiUserGroup, HiUser } from 'react-icons/hi';
import { getTeams, addTeam, updateTeam, deleteTeam } from '../utils/localStorage';
import toast from 'react-hot-toast';

const Teams = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: '',
  });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = () => {
    const allTeams = getTeams();
    setTeams(allTeams);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const memberEmails = formData.members
      .split(',')
      .map(m => m.trim())
      .filter(m => m);

    const teamData = {
      ...formData,
      members: memberEmails,
      createdBy: user.id,
      memberCount: memberEmails.length,
    };

    if (editingTeam) {
      updateTeam(editingTeam.id, teamData);
      toast.success('Team updated successfully!');
    } else {
      addTeam(teamData);
      toast.success('Team created successfully!');
    }

    loadTeams();
    resetForm();
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description || '',
      members: team.members ? team.members.join(', ') : '',
    });
    setShowModal(true);
  };

  const handleDeleteClick = (team) => {
    setTeamToDelete(team);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (teamToDelete) {
      deleteTeam(teamToDelete.id);
      loadTeams();
      toast.success('Team deleted successfully!');
    }
    setShowDeleteModal(false);
    setTeamToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTeamToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      members: '',
    });
    setEditingTeam(null);
    setShowModal(false);
  };

  const getTeamColor = (index) => {
    const colors = [
      'from-red-500 to-red-700',
      'from-blue-500 to-blue-700',
      'from-green-500 to-green-700',
      'from-purple-500 to-purple-700',
      'from-yellow-500 to-yellow-700',
      'from-pink-500 to-pink-700',
    ];
    return colors[index % colors.length];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teams</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your teams and collaborate effectively
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <FiPlus /> New Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className="bg-white dark:bg-black rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:border dark:border-red-600"
            onClick={() => navigate(`/teams/${team.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getTeamColor(index)} flex items-center justify-center`}>
                  <HiUserGroup className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {team.memberCount || 0} members
                  </p>
                </div>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleEdit(team)}
                  className="text-blue-600 hover:text-blue-700 p-1"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClick(team)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>

            {team.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {team.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <FiUsers size={16} />
                <span>{team.memberCount || 0}</span>
              </div>
              {team.members && team.members.length > 0 && (
                <div className="flex -space-x-2">
                  {team.members.slice(0, 3).map((member, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-white dark:border-black flex items-center justify-center"
                      title={member}
                    >
                      <HiUser className="text-gray-600 dark:text-gray-300" size={16} />
                    </div>
                  ))}
                  {team.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-black flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                      +{team.members.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiUserGroup className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No teams yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first team to start collaborating</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 inline-flex items-center gap-2"
          >
            <FiPlus /> Create Team
          </button>
        </div>
      )}

      {/* Create/Edit Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black rounded-xl p-6 max-w-md w-full dark:border dark:border-red-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {editingTeam ? 'Edit Team' : 'Create New Team'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  placeholder="Enter team description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Members (email addresses, comma separated)
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={formData.members}
                    onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                    placeholder="user1@example.com, user2@example.com"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Separate multiple emails with commas
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium"
                >
                  {editingTeam ? 'Update Team' : 'Create Team'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-950 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black rounded-xl p-6 max-w-md w-full dark:border dark:border-red-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Team</h2>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FiX size={24} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{teamToDelete?.name}"? This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-950 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;

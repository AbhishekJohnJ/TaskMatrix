import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiUser, HiMail, HiTrash, HiPlus, HiUserAdd } from 'react-icons/hi';
import { getTeams, updateTeam, getTasks } from '../utils/localStorage';
import toast from 'react-hot-toast';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [teamTasks, setTeamTasks] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    loadTeam();
    loadTeamTasks();
  }, [id]);

  const loadTeam = () => {
    const teams = getTeams();
    const foundTeam = teams.find(t => t.id === id);
    if (foundTeam) {
      setTeam(foundTeam);
    } else {
      toast.error('Team not found');
      navigate('/teams');
    }
  };

  const loadTeamTasks = () => {
    const allTasks = getTasks();
    // Filter tasks that might be assigned to team members
    setTeamTasks(allTasks.slice(0, 5)); // Show latest 5 tasks for demo
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMemberEmail && team) {
      const updatedMembers = [...(team.members || []), newMemberEmail.trim()];
      updateTeam(team.id, {
        members: updatedMembers,
        memberCount: updatedMembers.length,
      });
      toast.success('Member added successfully!');
      loadTeam();
      setNewMemberEmail('');
      setShowAddMemberModal(false);
    }
  };

  const handleRemoveMember = (email) => {
    if (team) {
      const updatedMembers = team.members.filter(m => m !== email);
      updateTeam(team.id, {
        members: updatedMembers,
        memberCount: updatedMembers.length,
      });
      toast.success('Member removed successfully!');
      loadTeam();
    }
  };

  if (!team) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading team...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'todo': 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
      'in-progress': 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
      'done': 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200',
    };
    return colors[status] || colors.todo;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/teams')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <HiArrowLeft size={20} />
          Back to Teams
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{team.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{team.description}</p>
          </div>
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <HiUserAdd /> Add Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <div className="lg:col-span-2 bg-white dark:bg-black rounded-xl p-6 shadow-sm dark:border dark:border-red-600">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Team Members ({team.memberCount || 0})
          </h2>

          {team.members && team.members.length > 0 ? (
            <div className="space-y-3">
              {team.members.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors dark:border dark:border-red-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                      <HiUser className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {email.split('@')[0]}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <HiMail size={14} />
                        {email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(email)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No members yet</p>
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 inline-flex items-center gap-2"
              >
                <HiPlus /> Add First Member
              </button>
            </div>
          )}
        </div>

        {/* Team Stats & Recent Tasks */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm dark:border dark:border-red-600">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Team Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Total Members</span>
                  <span className="font-bold text-gray-900 dark:text-white">{team.memberCount || 0}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Active Tasks</span>
                  <span className="font-bold text-gray-900 dark:text-white">{teamTasks.length}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Created</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm dark:border dark:border-red-600">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Tasks</h2>
            {teamTasks.length > 0 ? (
              <div className="space-y-2">
                {teamTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-gray-50 dark:bg-black rounded-lg dark:border dark:border-red-900"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {task.title}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">No tasks assigned yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black rounded-xl p-6 max-w-md w-full dark:border dark:border-red-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add Team Member</h2>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  placeholder="member@example.com"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setNewMemberEmail('');
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-950 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetail;

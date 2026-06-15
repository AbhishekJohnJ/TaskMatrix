import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiArrowLeft, HiUser, HiMail, HiTrash, HiPlus, HiUserAdd, HiClipboardList, HiCheckCircle } from 'react-icons/hi';
import { FiX } from 'react-icons/fi';
import { teamService } from '../services/teamService';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [team, setTeam] = useState(null);
  const [teamTasks, setTeamTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: '',
    assignedTo: '',
    availableForTeam: true,
  });

  useEffect(() => {
    loadTeam();
    loadTeamTasks();
    loadAvailableTasks();
  }, [id]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeam(id);
      setTeam(data.data?.team);
    } catch (error) {
      console.error('Load team error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to load team';
      toast.error(message);
      // Don't navigate away, let user stay to see the error
    } finally {
      setLoading(false);
    }
  };

  const loadTeamTasks = async () => {
    try {
      const data = await taskService.getTeamTasks(id);
      setTeamTasks(data.data?.tasks || []);
    } catch (error) {
      console.error('Failed to load team tasks:', error);
      // Silent fail - team might not have tasks yet
    }
  };

  const loadAvailableTasks = async () => {
    try {
      const data = await taskService.getAvailableTeamTasks(id);
      setAvailableTasks(data.data?.tasks || []);
    } catch (error) {
      console.error('Failed to load available tasks:', error);
      // Silent fail - team might not have available tasks yet
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (newMemberEmail && team) {
      try {
        await teamService.inviteMember(team._id, newMemberEmail.trim());
        toast.success('Member added successfully!');
        loadTeam();
        setNewMemberEmail('');
        setShowAddMemberModal(false);
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to add member';
        toast.error(message);
      }
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (team) {
      try {
        await teamService.removeMember(team._id, memberId);
        toast.success('Member removed successfully!');
        loadTeam();
      } catch (error) {
        toast.error('Failed to remove member');
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await teamService.createTeamTask(id, {
        ...taskFormData,
        tags: taskFormData.tags.split(',').map(t => t.trim()).filter(t => t),
      });
      toast.success('Team task created!');
      loadTeamTasks();
      loadAvailableTasks();
      setShowCreateTaskModal(false);
      setTaskFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        tags: '',
        assignedTo: '',
        availableForTeam: true,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (selectedTask && taskFormData.assignedTo) {
      try {
        await taskService.assignTeamTask(selectedTask._id, taskFormData.assignedTo);
        toast.success('Task assigned successfully!');
        loadTeamTasks();
        loadAvailableTasks();
        setShowAssignTaskModal(false);
        setSelectedTask(null);
        setTaskFormData({ ...taskFormData, assignedTo: '' });
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to assign task';
        toast.error(message);
      }
    }
  };

  const handleTakeTask = async (taskId) => {
    try {
      await taskService.takeTeamTask(taskId);
      toast.success('Task taken successfully!');
      loadTeamTasks();
      loadAvailableTasks();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to take task';
      toast.error(message);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await taskService.deleteTask(taskToDelete._id);
      toast.success('Task deleted successfully!');
      loadTeamTasks();
      loadAvailableTasks();
      setShowDeleteConfirmModal(false);
      setTaskToDelete(null);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast.error(message);
    }
  };

  const openDeleteConfirmation = (task) => {
    setTaskToDelete(task);
    setShowDeleteConfirmModal(true);
  };

  const isTeamLeader = team && user && team.owner?._id === user.id;

  if (!team) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading team...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'todo': 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
      'in-progress': 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
      'completed': 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200',
    };
    return colors[status] || colors.todo;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200',
      'medium': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200',
      'low': 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200',
    };
    return colors[priority] || colors.medium;
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
          <div className="flex gap-3">
            {isTeamLeader && (
              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <HiClipboardList /> Create Task
              </button>
            )}
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <HiUserAdd /> Add Member
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* All Team Tasks */}
          <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm dark:border dark:border-red-600">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiClipboardList />
              Team Tasks ({teamTasks.length})
            </h2>

            {teamTasks.length > 0 ? (
              <div className="space-y-3">
                {teamTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 bg-gray-50 dark:bg-black rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors dark:border dark:border-red-900"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                      <div className="flex gap-2">
                        {isTeamLeader && !task.assignedTo && (
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setShowAssignTaskModal(true);
                            }}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Assign
                          </button>
                        )}
                        {isTeamLeader && (
                          <button
                            onClick={() => openDeleteConfirmation(task)}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                            title="Delete task"
                          >
                            <HiTrash size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.assignedTo && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Assigned to: {task.assignedTo.fullName || task.assignedTo.username}
                        </span>
                      )}
                      {!task.assignedTo && task.availableForTeam && (
                        <span className="text-xs bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HiClipboardList className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No team tasks yet</p>
                {isTeamLeader && (
                  <button
                    onClick={() => setShowCreateTaskModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 inline-flex items-center gap-2"
                  >
                    <HiPlus /> Create First Task
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Available Tasks (for team members to take) */}
          {!isTeamLeader && availableTasks.length > 0 && (
            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm dark:border dark:border-green-600">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <HiCheckCircle />
                Available Tasks to Take ({availableTasks.length})
              </h2>
              <div className="space-y-3">
                {availableTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 bg-green-50 dark:bg-green-950 rounded-lg dark:border dark:border-green-800"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                      <button
                        onClick={() => handleTakeTask(task._id)}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Take Task
                      </button>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                    )}
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm dark:border dark:border-red-600">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Team Members ({team.members?.length || 0})
            </h2>

            {team.members && team.members.length > 0 ? (
              <div className="space-y-3">
                {team.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors dark:border dark:border-red-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                        <HiUser className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {member.user?.fullName || member.user?.username || 'Unknown'}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <HiMail size={14} />
                          {member.user?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                        {member.role}
                      </span>
                      {isTeamLeader && member.user?._id !== team.owner?._id && (
                        <button
                          onClick={() => handleRemoveMember(member.user._id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <HiTrash size={18} />
                        </button>
                      )}
                    </div>
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
                  <span className="font-bold text-gray-900 dark:text-white">{team.members?.length || 0}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
                  <span className="font-bold text-gray-900 dark:text-white">{teamTasks.length}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Available Tasks</span>
                  <span className="font-bold text-gray-900 dark:text-white">{availableTasks.length}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {teamTasks.filter(t => t.status === 'completed').length}
                  </span>
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
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black rounded-xl p-6 max-w-md w-full dark:border dark:border-red-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add Team Member</h2>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> You can only invite users who are already registered in the system. 
                Enter their registered email address below.
              </p>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  placeholder="member@example.com"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This must be an email of a registered user
                </p>
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

      {/* Create Team Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto dark:border dark:border-red-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Team Task</h2>
              <button onClick={() => setShowCreateTaskModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  placeholder="Task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  placeholder="Task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={taskFormData.priority}
                    onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskFormData.dueDate}
                    onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={taskFormData.tags}
                  onChange={(e) => setTaskFormData({ ...taskFormData, tags: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  placeholder="urgent, design, backend"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign To (optional)
                </label>
                <select
                  value={taskFormData.assignedTo}
                  onChange={(e) => setTaskFormData({ ...taskFormData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                >
                  <option value="">-- Make available for team --</option>
                  {team.members?.map((member) => (
                    <option key={member.user?._id} value={member.user?._id}>
                      {member.user?.fullName || member.user?.username}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave unassigned to make it available for team members to take
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateTaskModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-950 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssignTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black rounded-xl p-6 max-w-md w-full dark:border dark:border-red-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assign Task</h2>
              <button onClick={() => setShowAssignTaskModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Assigning task: <strong>{selectedTask.title}</strong>
            </p>

            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign To *
                </label>
                <select
                  required
                  value={taskFormData.assignedTo}
                  onChange={(e) => setTaskFormData({ ...taskFormData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                >
                  <option value="">-- Select team member --</option>
                  {team.members?.map((member) => (
                    <option key={member.user?._id} value={member.user?._id}>
                      {member.user?.fullName || member.user?.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Assign
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignTaskModal(false);
                    setSelectedTask(null);
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && taskToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-2xl dark:border-2 dark:border-red-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <HiTrash className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Task</h2>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Are you sure you want to delete the task:
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              "{taskToDelete.title}"
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-800 dark:text-red-300">
                ⚠️ This action cannot be undone. The task will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteTask}
                className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Delete Task
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setTaskToDelete(null);
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
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

export default TeamDetail;

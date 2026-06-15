import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data.data?.tasks || []);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (!searchQuery.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tasks.filter((task) => {
      const titleMatch = task.title?.toLowerCase().includes(query);
      const descriptionMatch = task.description?.toLowerCase().includes(query);
      const tagsMatch = task.tags?.some(tag => tag.toLowerCase().includes(query));
      const statusMatch = task.status?.toLowerCase().includes(query);
      const priorityMatch = task.priority?.toLowerCase().includes(query);
      
      return titleMatch || descriptionMatch || tagsMatch || statusMatch || priorityMatch;
    });

    setFilteredTasks(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    };

    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, taskData);
        toast.success('Task updated successfully!');
      } else {
        await taskService.createTask(taskData);
        toast.success('Task created successfully!');
      }
      await loadTasks();
      resetForm();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      tags: task.tags ? task.tags.join(', ') : '',
    });
    setShowModal(true);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await taskService.deleteTask(taskToDelete._id);
        await loadTasks();
        toast.success('Task deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      tags: '',
    });
    setEditingTask(null);
    setShowModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'low': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-red-800 bg-red-200 dark:bg-red-800 dark:text-red-200';
      case 'in-progress': return 'text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'todo': return 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <FiPlus /> New Task
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-white dark:bg-black rounded-lg px-4 py-3 shadow-sm border border-gray-200 dark:border-red-600">
          <FiSearch className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tasks by title, description, tags, status, or priority..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 w-full placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Found {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} matching "{searchQuery}"
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-3">Loading tasks...</p>
        </div>
      )}

      {/* Tasks Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task._id} className="bg-white dark:bg-black rounded-xl p-6 shadow-sm dark:border dark:border-red-600">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              {task.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{task.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                {task.team && (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    {task.team.name}
                  </span>
                )}
                {task.assignedTo && task.isTeamTask && (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {task.assignedTo.fullName || task.assignedTo.username}
                  </span>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && filteredTasks.length === 0 && tasks.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No tasks found matching your search.</p>
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No tasks yet. Create your first task!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black rounded-xl p-6 max-w-md w-full dark:border dark:border-red-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="work, urgent, bug"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  {editingTask ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-950"
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Task</h2>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FiX size={24} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
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

export default Tasks;

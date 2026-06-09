import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { getTasks, addTask, updateTask, deleteTask } from '../utils/localStorage';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
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

  const loadTasks = () => {
    const allTasks = getTasks();
    setTasks(allTasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      assignedTo: user.id,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast.success('Task updated successfully!');
    } else {
      addTask(taskData);
      toast.success('Task created successfully!');
    }

    loadTasks();
    resetForm();
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

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      loadTasks();
      toast.success('Task deleted successfully!');
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
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      case 'todo': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> New Task
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-600 hover:text-blue-700"
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
            </div>

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No tasks yet. Create your first task!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingTask ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
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
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
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

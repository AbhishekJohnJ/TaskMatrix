import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiClock, HiExclamation, HiClipboardList, HiLightningBolt, HiCheckCircle, HiSearch, HiX } from 'react-icons/hi';
import { getTasks, updateTask, addTask, deleteTask } from '../utils/localStorage';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const KanbanBoard = () => {
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState({ todo: [], 'in-progress': [], done: [] });
  const [draggedTask, setDraggedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskColumn, setNewTaskColumn] = useState('todo');
  const [filter, setFilter] = useState('all'); // all, high, medium, low
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: '',
  });

  useEffect(() => {
    loadTasks();
  }, [filter, searchQuery]);

  const loadTasks = () => {
    let allTasks = getTasks();
    
    // Apply priority filter
    if (filter !== 'all') {
      allTasks = allTasks.filter(t => t.priority === filter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allTasks = allTasks.filter((task) => {
        const titleMatch = task.title?.toLowerCase().includes(query);
        const descriptionMatch = task.description?.toLowerCase().includes(query);
        const tagsMatch = task.tags?.some(tag => tag.toLowerCase().includes(query));
        const statusMatch = task.status?.toLowerCase().includes(query);
        const priorityMatch = task.priority?.toLowerCase().includes(query);
        
        return titleMatch || descriptionMatch || tagsMatch || statusMatch || priorityMatch;
      });
    }
    
    const grouped = {
      todo: allTasks.filter(t => t.status === 'todo'),
      'in-progress': allTasks.filter(t => t.status === 'in-progress'),
      done: allTasks.filter(t => t.status === 'done'),
    };
    setTasks(grouped);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      updateTask(draggedTask.id, { status: newStatus });
      loadTasks();
      toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
    }
    setDraggedTask(null);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    addTask({
      ...formData,
      status: newTaskColumn,
      assignedTo: user.id,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    });
    loadTasks();
    toast.success('Task created!');
    setFormData({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' });
    setShowModal(false);
  };

  const handleEditTask = (e) => {
    e.preventDefault();
    updateTask(editingTask.id, {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    });
    loadTasks();
    toast.success('Task updated!');
    setShowEditModal(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' });
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    loadTasks();
    toast.success('Task deleted!');
  };

  const openModal = (column) => {
    setNewTaskColumn(column);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || '',
      tags: task.tags ? task.tags.join(', ') : '',
    });
    setShowEditModal(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-300';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200';
      case 'low': return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const columns = [
    { id: 'todo', title: 'To Do', bgColor: 'bg-red-50 dark:bg-red-950', icon: HiClipboardList, iconColor: 'text-red-600 dark:text-red-400' },
    { id: 'in-progress', title: 'In Progress', bgColor: 'bg-red-100 dark:bg-red-900', icon: HiLightningBolt, iconColor: 'text-red-700 dark:text-red-300' },
    { id: 'done', title: 'Done', bgColor: 'bg-red-200 dark:bg-red-800', icon: HiCheckCircle, iconColor: 'text-red-800 dark:text-red-200' },
  ];

  const totalTasks = tasks.todo.length + tasks['in-progress'].length + tasks.done.length;
  const completionRate = totalTasks > 0 ? Math.round((tasks.done.length / totalTasks) * 100) : 0;

  return (
    <div>
      {/* Header with filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {totalTasks} tasks • {completionRate}% complete
            </p>
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'high'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'medium'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'low'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
            }`}
          >
            Low
          </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-white dark:bg-black rounded-lg px-4 py-3 shadow-sm border border-gray-200 dark:border-red-600">
          <HiSearch className="text-gray-400" size={20} />
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
              <HiX size={18} />
            </button>
          )}
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Found {totalTasks} task{totalTasks !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className={`${column.bgColor} rounded-xl p-4`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <column.icon className={`${column.iconColor} text-2xl`} size={28} />
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{column.title}</h2>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tasks[column.id].length} tasks
                  </span>
                </div>
              </div>
              <button
                onClick={() => openModal(column.id)}
                className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <HiPlus className="text-gray-700 dark:text-gray-300" size={20} />
              </button>
            </div>

            <div
              className="space-y-3 min-h-[600px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {tasks[column.id].map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white dark:bg-black rounded-lg p-4 shadow-sm cursor-move hover:shadow-md transition-all dark:border dark:border-red-900 ${getPriorityColor(task.priority)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex-1">{task.title}</h3>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <HiPencil size={14} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <HiTrash size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Task metadata */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityBadgeColor(task.priority)}`}>
                      {task.priority}
                    </span>

                    {task.dueDate && (
                      <div className={`flex items-center gap-1 text-xs ${
                        isOverdue(task.dueDate) && task.status !== 'done'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {isOverdue(task.dueDate) && task.status !== 'done' ? (
                          <HiExclamation size={12} />
                        ) : (
                          <HiClock size={12} />
                        )}
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {tasks[column.id].length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No tasks</p>
                  <p className="text-xs mt-1">Drag tasks here or click + to add</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <TaskFormModal
          title="Create Task"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateTask}
          onClose={() => {
            setShowModal(false);
            setFormData({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' });
          }}
        />
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <TaskFormModal
          title="Edit Task"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditTask}
          onClose={() => {
            setShowEditModal(false);
            setEditingTask(null);
            setFormData({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' });
          }}
          isEdit
        />
      )}
    </div>
  );
};

// Task Form Modal Component
const TaskFormModal = ({ title, formData, setFormData, onSubmit, onClose, isEdit }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-black rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto dark:border dark:border-red-600">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
            placeholder="Enter task title"
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
            placeholder="Enter task description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority *
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
            placeholder="urgent, bug, feature"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            {isEdit ? 'Update Task' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-950 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default KanbanBoard;

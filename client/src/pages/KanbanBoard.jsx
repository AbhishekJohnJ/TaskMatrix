import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiClock, HiExclamation, HiClipboardList, HiLightningBolt, HiCheckCircle, HiSearch, HiX } from 'react-icons/hi';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const KanbanBoard = () => {
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState({ todo: [], 'in-progress': [], completed: [] });
  const [draggedTask, setDraggedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskColumn, setNewTaskColumn] = useState('todo');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  // Re-filter whenever filter/search changes (without re-fetching)
  useEffect(() => {
    // Trigger re-render by fetching filtered view
    loadTasks();
  }, [filter, searchQuery]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') params.priority = filter;
      if (searchQuery.trim()) params.search = searchQuery;

      const data = await taskService.getAllTasks(params);
      let allTasks = data.data?.tasks || [];

      // Client-side search if server doesn't support text search param
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        allTasks = allTasks.filter((task) => {
          return (
            task.title?.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query) ||
            task.tags?.some(tag => tag.toLowerCase().includes(query)) ||
            task.status?.toLowerCase().includes(query) ||
            task.priority?.toLowerCase().includes(query)
          );
        });
      }

      // Apply priority filter client-side too for reliability
      if (filter !== 'all') {
        allTasks = allTasks.filter(t => t.priority === filter);
      }

      const grouped = {
        todo: allTasks.filter(t => t.status === 'todo'),
        'in-progress': allTasks.filter(t => t.status === 'in-progress'),
        completed: allTasks.filter(t => t.status === 'completed'),
      };
      setTasks(grouped);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
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

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      try {
        // Optimistically update UI first
        const updatedTask = { ...draggedTask, status: newStatus };
        
        // Remove from old column and add to new column
        const newTasks = {
          ...tasks,
          [draggedTask.status]: tasks[draggedTask.status].filter(t => t._id !== draggedTask._id),
          [newStatus]: [...tasks[newStatus], updatedTask]
        };
        
        setTasks(newTasks);
        
        // Then update on server
        await taskService.updateTask(draggedTask._id, { status: newStatus });
        toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
      } catch (error) {
        // If server update fails, reload to get correct state
        toast.error('Failed to update task status');
        await loadTasks();
      }
    }
    setDraggedTask(null);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask({
        ...formData,
        status: newTaskColumn,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      });
      await loadTasks();
      toast.success('Task created!');
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' });
      setShowModal(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.updateTask(editingTask._id, {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      });
      await loadTasks();
      toast.success('Task updated!');
      setShowEditModal(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Find which column the task is in
      let taskColumn = null;
      let taskToDelete = null;
      
      for (const [column, columnTasks] of Object.entries(tasks)) {
        const found = columnTasks.find(t => t._id === taskId);
        if (found) {
          taskColumn = column;
          taskToDelete = found;
          break;
        }
      }
      
      if (!taskColumn) return;
      
      // Optimistically remove from UI
      const newTasks = {
        ...tasks,
        [taskColumn]: tasks[taskColumn].filter(t => t._id !== taskId)
      };
      setTasks(newTasks);
      
      // Then delete on server
      await taskService.deleteTask(taskId);
      toast.success('Task deleted!');
    } catch (error) {
      // If server delete fails, reload to get correct state
      toast.error('Failed to delete task');
      await loadTasks();
    }
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
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
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
    { 
      id: 'todo', 
      title: 'To Do', 
      bgColor: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950', 
      icon: HiClipboardList, 
      iconColor: 'text-blue-600 dark:text-blue-400',
      headerGradient: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'in-progress', 
      title: 'In Progress', 
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950', 
      icon: HiLightningBolt, 
      iconColor: 'text-amber-600 dark:text-amber-400',
      headerGradient: 'from-amber-500 to-orange-500'
    },
    { 
      id: 'completed', 
      title: 'Done', 
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950', 
      icon: HiCheckCircle, 
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      headerGradient: 'from-emerald-500 to-green-500'
    },
  ];

  const totalTasks = tasks.todo.length + tasks['in-progress'].length + tasks.completed.length;
  const completionRate = totalTasks > 0 ? Math.round((tasks.completed.length / totalTasks) * 100) : 0;

  return (
    <div>
      {/* Header with filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Kanban Board
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalTasks} tasks
              </p>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {completionRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
              filter === 'high'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
              filter === 'medium'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
              filter === 'low'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600'
            }`}
          >
            Low
          </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl px-5 py-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:border-red-300 dark:hover:border-red-600">
          <HiSearch className="text-gray-400 group-hover:text-red-500 transition-colors duration-200" size={22} />
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
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 hover:scale-110 transform"
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

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      )}

      {/* Kanban columns */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className={`${column.bgColor} rounded-2xl p-5 shadow-lg border border-gray-200/50 dark:border-gray-800/50 transition-all duration-300 hover:shadow-2xl`}>
              {/* Column Header */}
              <div className={`bg-gradient-to-r ${column.headerGradient} rounded-xl p-4 mb-4 shadow-md`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 group-hover:scale-110 transition-transform duration-200">
                      <column.icon className="text-white text-2xl" size={28} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{column.title}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-white/90 font-medium">
                          {tasks[column.id].length} tasks
                        </span>
                        {column.id === 'completed' && totalTasks > 0 && (
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white/90">
                            {Math.round((tasks[column.id].length / totalTasks) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(column.id)}
                    className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-200 transform hover:scale-110 hover:rotate-90 group"
                  >
                    <HiPlus className="text-white group-hover:scale-110 transition-transform" size={20} />
                  </button>
                </div>
              </div>

              <div
                className="space-y-3 min-h-[600px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {tasks[column.id].map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white dark:bg-gray-900 rounded-xl p-4 shadow-md cursor-move hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] dark:border dark:border-gray-800 group ${getPriorityColor(task.priority)}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                        {task.title}
                      </h3>
                      <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 transform hover:scale-110"
                        >
                          <HiPencil size={16} className="text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 transform hover:scale-110"
                        >
                          <HiTrash size={16} className="text-red-600 dark:text-red-400" />
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

                      {task.team && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          {task.team.name}
                        </span>
                      )}

                      {task.assignedTo && task.isTeamTask && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          {task.assignedTo.fullName || task.assignedTo.username}
                        </span>
                      )}

                      {task.dueDate && (
                        <div className={`flex items-center gap-1 text-xs ${
                          isOverdue(task.dueDate) && task.status !== 'completed'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {isOverdue(task.dueDate) && task.status !== 'completed' ? (
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
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 animate-pulse">
                      <column.icon className={column.iconColor} size={40} />
                    </div>
                    <p className="text-sm font-medium mb-1">No tasks yet</p>
                    <p className="text-xs">Drag tasks here or click + to add</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto dark:border dark:border-gray-700 shadow-2xl transform transition-all animate-slideUp">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
        >
          <HiX className="text-gray-500 dark:text-gray-400" size={20} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200 resize-none"
            placeholder="Enter task description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tags <span className="text-xs text-gray-500">(comma separated)</span>
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
            placeholder="urgent, bug, feature"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-800 font-medium shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:scale-105 transition-all duration-200"
          >
            {isEdit ? 'Update Task' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 font-medium transform hover:scale-105 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default KanbanBoard;

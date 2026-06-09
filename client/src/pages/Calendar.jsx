import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HiChevronLeft, HiChevronRight, HiPlus, HiX } from 'react-icons/hi';
import { getTasks, addTask, updateTask, getTaskById } from '../utils/localStorage';
import toast from 'react-hot-toast';

const Calendar = () => {
  const { user } = useSelector((state) => state.auth);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const allTasks = getTasks();
    setTasks(allTasks);
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isToday = (day) => {
    const today = new Date();
    return isSameDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), today);
  };

  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        return isSameDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), taskDate);
      }
      return false;
    });
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setFormData({
      ...formData,
      dueDate: clickedDate.toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleTaskClick = (task, e) => {
    e.stopPropagation();
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      assignedTo: user.id,
      tags: [],
    };

    addTask(taskData);
    loadTasks();
    toast.success('Task created successfully!');
    resetForm();
  };

  const handleUpdateStatus = (newStatus) => {
    if (selectedTask) {
      updateTask(selectedTask.id, { status: newStatus });
      loadTasks();
      setSelectedTask({ ...selectedTask, status: newStatus });
      toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
    });
    setSelectedDate(null);
    setShowModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        
        <div className="flex items-center gap-4">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Today
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <HiChevronLeft size={20} />
            </button>
            
            <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
              {formatDate(currentDate)}
            </span>
            
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <HiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Week days header */}
        <div className="grid grid-cols-7 border-b dark:border-gray-700">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-4 text-center font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((day, index) => {
            const dayTasks = day ? getTasksForDay(day) : [];
            const isCurrentDay = day && isToday(day);

            return (
              <div
                key={index}
                onClick={() => day && handleDayClick(day)}
                className={`min-h-[120px] p-2 border-r border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !day ? 'bg-gray-50 dark:bg-gray-900' : ''
                } ${isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          isCurrentDay
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {day}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>

                    {/* Tasks for this day */}
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          onClick={(e) => handleTaskClick(task, e)}
                          className={`text-xs p-1.5 rounded truncate ${getPriorityColor(task.priority)} text-white hover:opacity-80 transition-opacity`}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 pl-1.5">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Tasks</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">With Due Date</p>
          <p className="text-3xl font-bold text-blue-600">{tasks.filter(t => t.dueDate).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overdue</p>
          <p className="text-3xl font-bold text-red-600">
            {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
          <p className="text-3xl font-bold text-green-600">
            {tasks.filter(t => {
              if (t.dueDate) {
                const taskDate = new Date(t.dueDate);
                return taskDate.getMonth() === currentDate.getMonth() && 
                       taskDate.getFullYear() === currentDate.getFullYear();
              }
              return false;
            }).length}
          </p>
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Task
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <HiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Task Details
              </h2>
              <button
                onClick={() => setShowTaskDetails(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <HiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedTask.title}
                </h3>
                {selectedTask.description && (
                  <p className="text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                  {selectedTask.status.replace('-', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(selectedTask.priority)}`}>
                  {selectedTask.priority}
                </span>
              </div>

              {selectedTask.dueDate && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Update Status
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus('todo')}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium"
                  >
                    To Do
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('in-progress')}
                    className="flex-1 py-2 px-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-lg text-sm font-medium"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('done')}
                    className="flex-1 py-2 px-3 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-200 rounded-lg text-sm font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

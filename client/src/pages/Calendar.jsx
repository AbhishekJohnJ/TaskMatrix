import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HiChevronLeft, HiChevronRight, HiPlus, HiX, HiClock, HiExclamation, HiCalendar } from 'react-icons/hi';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const Calendar = () => {
  const { user } = useSelector((state) => state.auth);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const loadTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data.data?.tasks || []);
    } catch (error) {
      toast.error('Failed to load tasks');
    }
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

  const handleMonthYearChange = (month, year) => {
    setCurrentDate(new Date(year, month));
    setShowDatePicker(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      tags: [],
    };

    try {
      await taskService.createTask(taskData);
      await loadTasks();
      toast.success('Task created successfully!');
      resetForm();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (selectedTask) {
      try {
        await taskService.updateTask(selectedTask._id, { status: newStatus });
        await loadTasks();
        setSelectedTask({ ...selectedTask, status: newStatus });
        toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
      } catch (error) {
        toast.error('Failed to update task status');
      }
    }
  };;

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
      case 'completed': return 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200';
      case 'in-progress': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'todo': return 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400';
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

  // Generate years for picker (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Calendar
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your tasks and deadlines
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={goToToday}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-medium shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:scale-105 transition-all duration-200"
          >
            Today
          </button>
          
          <div className="relative">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl p-2 shadow-md border border-gray-200 dark:border-gray-700">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-110"
              >
                <HiChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
              
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="text-lg font-bold text-gray-900 dark:text-white min-w-[200px] text-center hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {formatDate(currentDate)}
              </button>
              
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-110"
              >
                <HiChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Month/Year Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute top-full mt-2 right-0 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-80">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Select Month & Year</h3>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <HiX size={18} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Year Selection */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleMonthYearChange(currentDate.getMonth(), year)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                          year === currentDate.getFullYear()
                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Month Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Month
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => handleMonthYearChange(index, currentDate.getFullYear())}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                          index === currentDate.getMonth()
                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {month.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-3 border-t dark:border-gray-700">
                  <button
                    onClick={() => {
                      const now = new Date();
                      handleMonthYearChange(now.getMonth(), now.getFullYear());
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Go to Current Month
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* Week days header */}
        <div className="grid grid-cols-7 border-b dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-4 text-center font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide"
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
                className={`min-h-[130px] p-3 border-r border-b dark:border-gray-800 relative ${
                  !day 
                    ? 'bg-gray-200/50 dark:bg-gray-950 cursor-not-allowed bg-[linear-gradient(135deg,transparent_48%,rgba(0,0,0,0.05)_48%,rgba(0,0,0,0.05)_52%,transparent_52%)] dark:bg-[linear-gradient(135deg,transparent_48%,rgba(255,255,255,0.02)_48%,rgba(255,255,255,0.02)_52%,transparent_52%)] bg-[length:8px_8px]' 
                    : 'cursor-pointer transition-all duration-300 group hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/20 dark:hover:to-pink-950/20 hover:shadow-lg'
                } ${isCurrentDay ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 ring-2 ring-blue-400 dark:ring-blue-600 ring-inset' : ''}`}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all duration-200 ${
                          isCurrentDay
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50 scale-110'
                            : 'text-gray-700 dark:text-gray-300 group-hover:bg-white dark:group-hover:bg-gray-800 group-hover:shadow-md'
                        }`}
                      >
                        {day}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-md animate-pulse">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>

                    {/* Tasks for this day */}
                    <div className="space-y-1.5">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task._id}
                          onClick={(e) => handleTaskClick(task, e)}
                          className={`text-xs p-2 rounded-lg truncate shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 ${getPriorityColor(task.priority)} text-white font-medium`}
                        >
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-75"></span>
                            {task.title}
                          </div>
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 pl-2 font-semibold mt-1 flex items-center gap-1">
                          <HiPlus size={12} />
                          {dayTasks.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Hover Add Button */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-7 h-7 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transform transition-transform duration-200">
                        <HiPlus className="text-white" size={14} />
                      </div>
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
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
              <HiPlus className="text-white" size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            {tasks.length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 shadow-lg border border-blue-200 dark:border-blue-900 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">With Due Date</p>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-200">
              <HiClock className="text-white" size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {tasks.filter(t => t.dueDate).length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-xl p-6 shadow-lg border border-red-200 dark:border-red-900 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Overdue</p>
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-200 animate-pulse">
              <HiExclamation className="text-white" size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold text-red-600 dark:text-red-400">
            {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-xl p-6 shadow-lg border border-emerald-200 dark:border-emerald-900 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">This Month</p>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-200">
              <HiCalendar className="text-white" size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
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
          <div className="bg-white dark:bg-black rounded-xl p-6 max-w-md w-full dark:border dark:border-red-600">
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-black dark:border-gray-600 dark:text-white"
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
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium"
                >
                  Create Task
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

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full dark:border dark:border-gray-700 shadow-2xl transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Task Details
              </h2>
              <button
                onClick={() => setShowTaskDetails(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-110 hover:rotate-90"
              >
                <HiX size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedTask.title}
                </h3>
                {selectedTask.description && (
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedTask.description}</p>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md ${getStatusColor(selectedTask.status)}`}>
                  {selectedTask.status.replace('-', ' ')}
                </span>
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md ${getPriorityColor(selectedTask.priority)}`}>
                  {selectedTask.priority}
                </span>
              </div>

              {selectedTask.dueDate && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-900">
                  <div className="flex items-center gap-2 mb-1">
                    <HiClock className="text-blue-600 dark:text-blue-400" size={20} />
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Due Date</p>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white ml-7">
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
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Update Status
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus('todo')}
                    className="py-3 px-2 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 dark:from-slate-800 dark:to-slate-900 dark:hover:from-slate-700 dark:hover:to-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    To Do
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('in-progress')}
                    className="py-3 px-2 bg-gradient-to-br from-amber-100 to-orange-200 hover:from-amber-200 hover:to-orange-300 dark:from-amber-900/50 dark:to-orange-900/50 dark:hover:from-amber-800/50 dark:hover:to-orange-800/50 text-amber-800 dark:text-amber-200 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('completed')}
                    className="py-3 px-2 bg-gradient-to-br from-emerald-100 to-green-200 hover:from-emerald-200 hover:to-green-300 dark:from-emerald-900/50 dark:to-green-900/50 dark:hover:from-emerald-800/50 dark:hover:to-green-800/50 text-emerald-800 dark:text-emerald-200 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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

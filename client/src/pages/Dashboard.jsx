import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiClipboardCheck, HiClock, HiTrendingUp, HiFlag } from 'react-icons/hi';
import { taskService } from '../services/taskService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    todo: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      const tasks = data.data?.tasks || [];
      
      setStats({
        total: tasks.length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        todo: tasks.filter(t => t.status === 'todo').length,
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length,
      });

      // Get 5 most recent tasks
      const sorted = [...tasks].sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setRecentTasks(sorted.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: HiClipboardCheck, color: 'bg-red-500', change: '+12%' },
    { label: 'In Progress', value: stats.inProgress, icon: HiClock, color: 'bg-red-600', change: '+5%' },
    { label: 'Completed', value: stats.completed, icon: HiTrendingUp, color: 'bg-red-700', change: '+23%' },
    { label: 'To Do', value: stats.todo, icon: HiFlag, color: 'bg-red-800', change: '-8%' },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      'todo': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      'in-progress': 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
      'completed': 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200',
    };
    return colors[status] || colors.todo;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's what's happening with your projects today.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-3">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white dark:bg-black rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow dark:border dark:border-red-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Recent Tasks & Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Recent Tasks */}
            <div className="lg:col-span-2 bg-white dark:bg-black rounded-xl p-6 shadow-sm dark:border dark:border-red-600">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Tasks</h2>
                <Link to="/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              
              {recentTasks.length > 0 ? (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <div key={task._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors dark:border dark:border-red-900">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{task.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{task.description}</p>
                      </div>
                      <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadge(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No tasks yet</p>
                  <Link to="/tasks" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 inline-block">
                    Create Your First Task
                  </Link>
                </div>
              )}
            </div>

            {/* Progress Overview */}
            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm dark:border dark:border-red-600">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Progress Overview</h2>
              
              <div className="space-y-6">
                {/* Completion Rate */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Completed Tasks</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stats.completed} / {stats.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Completion Rate</p>
                  </div>
                </div>

                {/* Task Breakdown by Priority */}
                <div className="pt-6 border-t dark:border-gray-700 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Low Priority</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">{stats.low}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Medium Priority</span>
                    <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{stats.medium}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">High Priority</span>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">{stats.high}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-6 border-t dark:border-gray-700 space-y-2">
                  <Link
                    to="/tasks"
                    className="block w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 text-center text-sm font-medium transition-colors"
                  >
                    View All Tasks
                  </Link>
                  <Link
                    to="/kanban"
                    className="block w-full bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-950 text-center text-sm font-medium transition-colors"
                  >
                    Open Kanban Board
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

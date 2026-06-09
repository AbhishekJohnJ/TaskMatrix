import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiClipboardCheck, HiClock, HiTrendingUp, HiFlag } from 'react-icons/hi';
import { getTasks } from '../utils/localStorage';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    todo: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const tasks = getTasks();
    
    setStats({
      total: tasks.length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'done').length,
      todo: tasks.filter(t => t.status === 'todo').length,
    });

    // Get 5 most recent tasks
    const sorted = [...tasks].sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    setRecentTasks(sorted.slice(0, 5));
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: HiClipboardCheck, color: 'bg-blue-500', change: '+12%' },
    { label: 'In Progress', value: stats.inProgress, icon: HiClock, color: 'bg-yellow-500', change: '+5%' },
    { label: 'Completed', value: stats.completed, icon: HiTrendingUp, color: 'bg-green-500', change: '+23%' },
    { label: 'To Do', value: stats.todo, icon: HiFlag, color: 'bg-purple-500', change: '-8%' },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      'todo': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      'in-progress': 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
      'done': 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200',
    };
    return colors[status] || colors.todo;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.fullName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
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

      {/* Recent Tasks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Tasks</h2>
            <Link to="/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{task.description}</p>
                  </div>
                  <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No tasks yet</p>
              <Link to="/tasks" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block">
                Create Your First Task
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/tasks"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 text-center font-medium transition-colors"
            >
              Create New Task
            </Link>
            <Link
              to="/kanban"
              className="block w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 text-center font-medium transition-colors"
            >
              View Kanban Board
            </Link>
            <Link
              to="/calendar"
              className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 text-center font-medium transition-colors"
            >
              Open Calendar
            </Link>
            <Link
              to="/analytics"
              className="block w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 text-center font-medium transition-colors"
            >
              View Analytics
            </Link>
          </div>

          {/* Progress Overview */}
          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Today's Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

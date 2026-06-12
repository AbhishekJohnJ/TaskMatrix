import { useEffect, useState } from 'react';
import { HiTrendingUp, HiTrendingDown, HiCheckCircle, HiClock, HiExclamation, HiFlag } from 'react-icons/hi';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    overdue: 0,
    completionRate: 0,
    productivityTrend: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks();
      const tasks = response.data?.tasks || [];
      const now = new Date();
      
      const completed = tasks.filter(t => t.status === 'completed').length;
      const inProgress = tasks.filter(t => t.status === 'in-progress').length;
      const todo = tasks.filter(t => t.status === 'todo').length;
      const highPriority = tasks.filter(t => t.priority === 'high').length;
      const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
      const lowPriority = tasks.filter(t => t.priority === 'low').length;
      const overdue = tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
      ).length;
      
      const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
      
      const productivityTrend = completed > inProgress ? 
        Math.round(((completed - inProgress) / Math.max(completed, 1)) * 100) : 
        -Math.round(((inProgress - completed) / Math.max(inProgress, 1)) * 100);

      setAnalytics({
        total: tasks.length,
        completed,
        inProgress,
        todo,
        highPriority,
        mediumPriority,
        lowPriority,
        overdue,
        completionRate,
        productivityTrend,
      });
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const maxValue = Math.max(analytics.completed, analytics.inProgress, analytics.todo, 1);
  const maxPriorityValue = Math.max(analytics.highPriority, analytics.mediumPriority, analytics.lowPriority, 1);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time insights into your task management performance and productivity patterns
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-3">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-red-600">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completion Rate</span>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  analytics.completionRate >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  analytics.completionRate >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {analytics.completionRate >= 70 ? 'Excellent' : analytics.completionRate >= 40 ? 'Good' : 'Needs Focus'}
                </div>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{analytics.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-black rounded-full h-3 border dark:border-red-900">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    analytics.completionRate >= 70 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    analytics.completionRate >= 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                    'bg-gradient-to-r from-red-500 to-red-600'
                  }`}
                  style={{ width: `${analytics.completionRate}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-lg border-2 border-green-200 dark:border-red-600">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <HiCheckCircle className="text-green-600 dark:text-green-400" size={28} />
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-green-600 dark:text-green-400">{analytics.completed}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm mb-2">/ {analytics.total} tasks</span>
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-lg border-2 border-blue-200 dark:border-red-600">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <HiClock className="text-blue-600 dark:text-blue-400" size={28} />
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{analytics.inProgress}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-lg border-2 border-red-200 dark:border-red-600">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <HiExclamation className="text-red-600 dark:text-red-400" size={28} />
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Overdue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-red-600 dark:text-red-400">{analytics.overdue}</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Task Status Bar Chart */}
            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-lg border border-gray-200 dark:border-red-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Task Status Distribution</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500"></div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Completed</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analytics.completed}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-black rounded-full h-8 border dark:border-red-900">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${(analytics.completed / maxValue) * 100}%` }}
                      >
                        {analytics.completed > 0 && (
                          <span className="text-white text-xs font-bold">{Math.round((analytics.completed / analytics.total) * 100)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-500"></div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">In Progress</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analytics.inProgress}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-black rounded-full h-8 border dark:border-red-900">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${(analytics.inProgress / maxValue) * 100}%` }}
                      >
                        {analytics.inProgress > 0 && (
                          <span className="text-white text-xs font-bold">{Math.round((analytics.inProgress / analytics.total) * 100)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-400"></div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">To Do</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analytics.todo}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-black rounded-full h-8 border dark:border-red-900">
                      <div
                        className="bg-gradient-to-r from-gray-400 to-gray-500 h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${(analytics.todo / maxValue) * 100}%` }}
                      >
                        {analytics.todo > 0 && (
                          <span className="text-white text-xs font-bold">{Math.round((analytics.todo / analytics.total) * 100)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Distribution Bar Chart */}
            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-lg border border-gray-200 dark:border-red-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Priority Distribution</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500"></div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">High Priority</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analytics.highPriority}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-black rounded-full h-8 border dark:border-red-900">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-600 h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${(analytics.highPriority / maxPriorityValue) * 100}%` }}
                      >
                        {analytics.highPriority > 0 && (
                          <span className="text-white text-xs font-bold">{Math.round((analytics.highPriority / analytics.total) * 100)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-500"></div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Medium Priority</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analytics.mediumPriority}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-black rounded-full h-8 border dark:border-red-900">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${(analytics.mediumPriority / maxPriorityValue) * 100}%` }}
                      >
                        {analytics.mediumPriority > 0 && (
                          <span className="text-white text-xs font-bold">{Math.round((analytics.mediumPriority / analytics.total) * 100)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500"></div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Low Priority</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analytics.lowPriority}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${(analytics.lowPriority / maxPriorityValue) * 100}%` }}
                      >
                        {analytics.lowPriority > 0 && (
                          <span className="text-white text-xs font-bold">{Math.round((analytics.lowPriority / analytics.total) * 100)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Productivity Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Analysis */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                {analytics.productivityTrend >= 0 ? (
                  <HiTrendingUp className="text-green-500" size={32} />
                ) : (
                  <HiTrendingDown className="text-orange-500" size={32} />
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Productivity Trend</h3>
              </div>
              <div className="mb-4">
                <span className={`text-5xl font-bold ${
                  analytics.productivityTrend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {analytics.productivityTrend > 0 ? '+' : ''}{analytics.productivityTrend}%
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {analytics.productivityTrend > 0 
                  ? `You're completing ${Math.abs(analytics.productivityTrend)}% more tasks than you're starting. Excellent momentum!`
                  : analytics.productivityTrend < 0
                  ? `You have ${Math.abs(analytics.productivityTrend)}% more tasks in progress than completed. Focus on finishing current tasks.`
                  : 'Your completion and in-progress rates are balanced.'}
              </p>
            </div>

            {/* Actionable Insights */}
            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-lg border border-gray-200 dark:border-red-600">
              <div className="flex items-center gap-3 mb-4">
                <HiFlag className="text-purple-500" size={32} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Insights & Recommendations</h3>
              </div>
              <div className="space-y-3">
                {analytics.total === 0 ? (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-black rounded-lg dark:border dark:border-red-900">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Get Started</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Create your first task to start tracking productivity.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {analytics.completionRate >= 70 && (
                      <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Excellent Performance</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">You're maintaining a strong completion rate!</p>
                        </div>
                      </div>
                    )}
                    {analytics.overdue > 0 && (
                      <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Attention Needed</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{analytics.overdue} task{analytics.overdue > 1 ? 's are' : ' is'} overdue. Prioritize these immediately.</p>
                        </div>
                      </div>
                    )}
                    {analytics.highPriority > analytics.completed && analytics.highPriority > 0 && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Focus on High Priority</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">You have {analytics.highPriority} high-priority tasks requiring attention.</p>
                        </div>
                      </div>
                    )}
                    {analytics.inProgress > analytics.completed * 1.5 && analytics.inProgress > 0 && (
                      <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Finish Before Starting</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Complete in-progress tasks before taking on new ones.</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;

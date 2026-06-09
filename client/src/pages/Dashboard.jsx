import { useSelector } from 'react-redux';
import { FiCheckSquare, FiClock, FiTrendingUp, FiUsers } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { label: 'Total Tasks', value: '24', icon: FiCheckSquare, color: 'bg-blue-500' },
    { label: 'In Progress', value: '8', icon: FiClock, color: 'bg-yellow-500' },
    { label: 'Completed', value: '12', icon: FiTrendingUp, color: 'bg-green-500' },
    { label: 'Team Members', value: '6', icon: FiUsers, color: 'bg-purple-500' },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Tasks
          </h2>
          <p className="text-gray-600 dark:text-gray-400">No recent tasks</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Activity
          </h2>
          <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

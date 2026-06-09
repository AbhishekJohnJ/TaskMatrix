import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Full Name</label>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.fullName}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Username</label>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.username}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

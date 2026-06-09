import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiUser, HiMail, HiLockClosed, HiCamera, HiCheckCircle, HiClock, HiTrendingUp, HiCalendar, HiPencil } from 'react-icons/hi';
import { setUser } from '../redux/slices/authSlice';
import { getCurrentUser, updateUser, getTasks } from '../utils/localStorage';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    completionRate: 0,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
      setAvatarPreview(user.avatar || '');
      calculateStats();
    }
  }, [user]);

  const calculateStats = () => {
    const tasks = getTasks();
    const userTasks = tasks.filter(task => task.assignedTo === user.id);
    const completed = userTasks.filter(t => t.status === 'done').length;
    const inProgress = userTasks.filter(t => t.status === 'in-progress').length;
    const completionRate = userTasks.length > 0 ? Math.round((completed / userTasks.length) * 100) : 0;

    setStats({
      totalTasks: userTasks.length,
      completedTasks: completed,
      inProgressTasks: inProgress,
      completionRate,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData({
          ...formData,
          avatar: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview('');
    setFormData({
      ...formData,
      avatar: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedUser = {
      ...user,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    updateUser(user.id, updatedUser);
    dispatch(setUser({ user: updatedUser, token: localStorage.getItem('token') }));
    
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
    });
    setAvatarPreview(user.avatar || '');
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getMemberSince = () => {
    if (user?.createdAt) {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'Recently';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your personal information and view your activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {(isEditing && avatarPreview) || (!isEditing && user?.avatar) ? (
                  <img
                    src={isEditing ? avatarPreview : user?.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white dark:border-gray-700"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                    {getInitials(user?.fullName)}
                  </div>
                )}
                {isEditing && (
                  <>
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg cursor-pointer"
                      title="Change profile picture"
                    >
                      <HiCamera size={20} />
                    </label>
                  </>
                )}
              </div>
              {isEditing && (avatarPreview || user?.avatar) && (
                <button
                  onClick={removeAvatar}
                  className="mt-2 text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
                >
                  Remove Photo
                </button>
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 text-center">
                {user?.fullName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">@{user?.username}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <HiCalendar size={16} />
                <span>Member since {getMemberSince()}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700 flex-1">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="text-green-500" size={20} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{stats.completedTasks}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <HiClock className="text-blue-500" size={20} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{stats.inProgressTasks}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <HiTrendingUp className="text-purple-500" size={20} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{stats.completionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <HiPencil size={20} />
                  <span>Edit Profile</span>
                </button>
              ) : null}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiUser className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiMail className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                      Full Name
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white font-medium">
                      {user?.fullName || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                      Email
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white font-medium">
                      {user?.email || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                    Username
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white font-medium">
                    @{user?.username || 'Not provided'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                    Bio
                  </label>
                  <p className="text-gray-900 dark:text-white leading-relaxed">
                    {user?.bio || 'No bio added yet. Click "Edit Profile" to add one.'}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                    Account Created
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleString('en-US', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    }) : 'Unknown'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Activity Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 shadow-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Activity Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalTasks}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completedTasks}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.completionRate}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

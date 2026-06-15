import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { setNotifications, setUnreadCount, markAsRead, markAllAsRead, addNotification } from '../redux/slices/notificationSlice';
import { useTheme } from '../hooks/useTheme';
import { notificationService } from '../services/notificationService';

import Logo from '../components/Logo';
import { 
  HiHome, HiClipboardList, HiViewBoards, HiCalendar, 
  HiChartBar, HiInformationCircle, HiUser, HiUserGroup,
  HiLogout, HiMenuAlt2, HiX, HiSun, HiMoon, 
  HiBell, HiChevronLeft, HiChevronRight, HiCheck, HiCheckCircle
} from 'react-icons/hi';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const { theme, toggleTheme } = useTheme();

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications(1, 10);
      dispatch(setNotifications(data.data?.notifications || []));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      dispatch(setUnreadCount(data.data?.count || 0));
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      dispatch(markAsRead(notificationId));
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      dispatch(markAllAsRead());
      fetchNotifications(); // Refresh the list
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_completed':
        return <HiCheckCircle className="text-green-500" size={20} />;
      case 'task_assigned':
        return <HiClipboardList className="text-blue-500" size={20} />;
      case 'task_taken':
        return <HiUser className="text-purple-500" size={20} />;
      case 'team_member_added':
        return <HiUserGroup className="text-red-500" size={20} />;
      default:
        return <HiBell className="text-gray-500" size={20} />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: HiHome, label: 'Dashboard' },
    { path: '/tasks', icon: HiClipboardList, label: 'Tasks' },
    { path: '/teams', icon: HiUserGroup, label: 'Teams' },
    { path: '/kanban', icon: HiViewBoards, label: 'Kanban' },
    { path: '/calendar', icon: HiCalendar, label: 'Calendar' },
    { path: '/analytics', icon: HiChartBar, label: 'Analytics' },
    { path: '/about', icon: HiInformationCircle, label: 'About' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-black shadow-lg fixed w-full top-0 z-30 border-b border-gray-200 dark:border-gray-900">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {mobileMenuOpen ? <HiX size={24} /> : <HiMenuAlt2 size={24} />}
            </button>
            
            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {sidebarOpen ? <HiChevronLeft size={20} /> : <HiChevronRight size={20} />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <Logo size={32} />
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                TaskMatrix
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notifications */}
            <div className="relative notifications-dropdown">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HiBell className="text-gray-600 dark:text-gray-300" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors ${
                            !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => {
                            if (!notification.isRead) {
                              handleMarkAsRead(notification._id);
                            }
                            if (notification.actionUrl) {
                              navigate(notification.actionUrl);
                              setShowNotifications(false);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {getTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <HiBell className="mx-auto text-gray-400 mb-2" size={48} />
                        <p className="text-gray-600 dark:text-gray-400">No notifications yet</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/notifications');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                      >
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <HiSun className="text-yellow-500" size={20} />
              ) : (
                <HiMoon className="text-gray-600" size={20} />
              )}
            </button>

            {/* User profile */}
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role || 'User'}
                </p>
              </div>
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-semibold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className={`
        hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-black shadow-xl z-20
        transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-900
        ${sidebarOpen ? 'w-64' : 'w-20'}
      `}>
        <nav className="h-full flex flex-col p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={!sidebarOpen ? item.label : ''}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }
                  ${!sidebarOpen ? 'justify-center' : ''}
                `}
              >
                <Icon size={22} className="flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {!sidebarOpen && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
          
          <div className="flex-1" />
          
          <div className="pt-4 border-t dark:border-gray-700 space-y-2">
            <Link
              to="/profile"
              title={!sidebarOpen ? 'Profile' : ''}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group relative ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <HiUser size={22} className="flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">Profile</span>}
              {!sidebarOpen && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Profile
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              title={!sidebarOpen ? 'Logout' : ''}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group relative ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <HiLogout size={22} className="flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">Logout</span>}
              {!sidebarOpen && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Logout
                </span>
              )}
            </button>
          </div>
        </nav>
      </aside>

      {/* Sidebar - Mobile */}
      <aside className={`
        lg:hidden fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-black shadow-xl z-20
        transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-900
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="h-full flex flex-col p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }
                `}
              >
                <Icon size={22} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          <div className="flex-1" />
          
          <div className="pt-4 border-t dark:border-gray-700 space-y-2">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
            >
              <HiUser size={22} />
              <span className="font-medium">Profile</span>
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <HiLogout size={22} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`
        pt-16 min-h-screen transition-all duration-300
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
      `}>
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-10 top-16"
        />
      )}
    </div>
  );
};

export default DashboardLayout;

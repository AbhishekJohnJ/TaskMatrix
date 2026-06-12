import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useTheme } from '../hooks/useTheme';

import Logo from '../components/Logo';
import { 
  HiHome, HiClipboardList, HiViewBoards, HiCalendar, 
  HiChartBar, HiInformationCircle, HiUser, HiUserGroup,
  HiLogout, HiMenuAlt2, HiX, HiSun, HiMoon, 
  HiBell, HiChevronLeft, HiChevronRight 
} from 'react-icons/hi';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

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
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <HiBell className="text-gray-600 dark:text-gray-300" size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

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

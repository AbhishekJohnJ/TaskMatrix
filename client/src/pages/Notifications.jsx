import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiBell, HiCheckCircle, HiClipboardList, HiUser, HiUserGroup, HiTrash, HiCheck } from 'react-icons/hi';
import { notificationService } from '../services/notificationService';
import { setNotifications, setUnreadCount, markAsRead as markAsReadAction } from '../redux/slices/notificationSlice';
import toast from 'react-hot-toast';

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(1, 50);
      dispatch(setNotifications(data.data?.notifications || []));
      
      const countData = await notificationService.getUnreadCount();
      dispatch(setUnreadCount(countData.data?.count || 0));
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      dispatch(markAsReadAction(notificationId));
      
      const countData = await notificationService.getUnreadCount();
      dispatch(setUnreadCount(countData.data?.count || 0));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update all notifications in state to read
      const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
      dispatch(setNotifications(updatedNotifications));
      dispatch(setUnreadCount(0));
      
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      const updatedNotifications = notifications.filter(n => n._id !== notificationId);
      dispatch(setNotifications(updatedNotifications));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_completed':
        return <HiCheckCircle className="text-green-500" size={24} />;
      case 'task_assigned':
        return <HiClipboardList className="text-blue-500" size={24} />;
      case 'task_taken':
        return <HiUser className="text-purple-500" size={24} />;
      case 'team_member_added':
        return <HiUserGroup className="text-red-500" size={24} />;
      default:
        return <HiBell className="text-gray-500" size={24} />;
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
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HiCheck size={18} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'all'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'unread'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'read'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Read ({notifications.filter(n => n.isRead).length})
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-3">Loading notifications...</p>
        </div>
      )}

      {/* Notifications List */}
      {!loading && (
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white dark:bg-black rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer dark:border ${
                  !notification.isRead 
                    ? 'border-l-4 border-l-blue-500 dark:border-red-600 bg-blue-50 dark:bg-blue-900/20' 
                    : 'dark:border-red-600'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div 
                    className="flex-1 min-w-0"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {getTimeAgo(notification.createdAt)}
                          </p>
                          {!notification.isRead && (
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              • Unread
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification._id);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <HiCheck size={18} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification._id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <HiTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiBell className="text-gray-400" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {filter === 'unread' ? 'No unread notifications' : filter === 'read' ? 'No read notifications' : 'No notifications yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' ? "You'll see notifications here when you receive them" : 'Try a different filter'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;

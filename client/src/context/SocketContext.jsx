import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addNotification } from '../redux/slices/notificationSlice';
import { updateTask, removeTask, addTask } from '../redux/slices/taskSlice';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && user) {
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      
      const socketInstance = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      // Handle online users
      socketInstance.on('users:online', (users) => {
        setOnlineUsers(users);
      });

      socketInstance.on('user:online', (user) => {
        setOnlineUsers((prev) => [...prev, user]);
      });

      socketInstance.on('user:offline', ({ userId }) => {
        setOnlineUsers((prev) => prev.filter((u) => u.userId !== userId));
      });

      // Handle task events
      socketInstance.on('task:created', (task) => {
        dispatch(addTask(task));
        toast.success('New task created');
      });

      socketInstance.on('task:updated', (task) => {
        dispatch(updateTask(task));
      });

      socketInstance.on('task:deleted', ({ taskId }) => {
        dispatch(removeTask(taskId));
      });

      socketInstance.on('task:assigned', (task) => {
        toast.success(`You were assigned to: ${task.title}`);
      });

      // Handle notification events
      socketInstance.on('notification', (notification) => {
        dispatch(addNotification(notification));
        toast(notification.message, {
          icon: '🔔',
        });
      });

      // Handle comment events
      socketInstance.on('comment:added', (data) => {
        // Handle new comment
      });

      socketInstance.on('comment:updated', (comment) => {
        // Handle updated comment
      });

      socketInstance.on('comment:deleted', (data) => {
        // Handle deleted comment
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [token, user, dispatch]);

  const emitEvent = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  const joinTeam = (teamId) => {
    emitEvent('team:join', teamId);
  };

  const leaveTeam = (teamId) => {
    emitEvent('team:leave', teamId);
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    emitEvent,
    joinTeam,
    leaveTeam,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, logout as logoutAction, setLoading, setError } from '../redux/slices/authSlice';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const data = await authService.login(credentials);
      
      dispatch(setUser({
        user: data.data.user,
        token: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      }));
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch(setLoading(true));
      const data = await authService.register(userData);
      
      dispatch(setUser({
        user: data.data.user,
        token: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      }));
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logoutAction());
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
};

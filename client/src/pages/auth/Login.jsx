import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { getUserByEmail, setCurrentUser } from '../../utils/localStorage';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get user from localStorage
      const user = getUserByEmail(formData.email);
      
      if (!user) {
        toast.error('User not found. Please register first.');
        setLoading(false);
        return;
      }
      
      // Check password
      if (user.password !== formData.password) {
        toast.error('Invalid password');
        setLoading(false);
        return;
      }
      
      // Remove password before storing
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      // Set as current user
      setCurrentUser(userWithoutPassword);
      
      const mockToken = 'token-' + user.id;
      localStorage.setItem('token', mockToken);
      
      // Update Redux state
      dispatch(setUser({
        user: userWithoutPassword,
        token: mockToken
      }));
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Sign In
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Link 
            to="/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Forgot Password?
          </Link>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;

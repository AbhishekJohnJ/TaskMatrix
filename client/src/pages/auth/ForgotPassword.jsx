import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email
      });
      
      if (response.data.status === 'success') {
        setEmailSent(true);
        toast.success('Password reset link sent to your email!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset link';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="bg-white dark:bg-black rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-red-900">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Check Your Email
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            We've sent a password reset link to<br />
            <span className="font-semibold text-red-600 dark:text-red-400">{email}</span>
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              📧 <strong>Note:</strong> The link will expire in 1 hour. If you don't see the email, check your spam folder.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              className="w-full text-sm text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-medium transition-colors py-2"
            >
              Send Another Link
            </button>
            <Link 
              to="/login" 
              className="block w-full text-center py-2.5 px-4 border-2 border-red-600 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-red-900">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your email to receive a reset link
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" size={18} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-black dark:text-white transition-all text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 font-semibold shadow-lg shadow-red-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </span>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
        >
          <FiArrowLeft size={16} />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;

import { useState, useEffect } from 'react';
import { useLoginMutation } from '../../api/authApi';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { setCredentials } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Debug logging
  useEffect(() => {
    console.log('Login component - current token:', token);
    console.log('Login component - location:', location);
  }, [token, location]);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      console.log('Already logged in, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await login(formData).unwrap();
      console.log('Login response:', response);
      
      // Handle the response structure: {success: true, data: {_id, name, email, fitnessGoal, token}}
      if (response.success && response.data) {
        const { token, ...userInfo } = response.data;
        
        dispatch(setCredentials({
          user: userInfo, // {_id, name, email, fitnessGoal}
          token: token
        }));
        
        console.log('Login successful, navigating...');
        
        // Force a clean navigation - this will clear any navigation conflicts
        setTimeout(() => {
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }, 0);
        
        // Alternative: Force a complete navigation reset
        // window.location.href = from;
        
      } else {
        console.error('Invalid response structure:', response);
        setErrors({ general: 'Login failed - invalid response format' });
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        setErrors({ general: err.data?.message || 'Login failed. Please try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-200 to-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="content-container bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200"
      >
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center relative">
          Login to Your Account
          <motion.span
            className="absolute left-1/2 transform -translate-x-1/2 bottom-[-10px] w-24 h-1 bg-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8 }}
          />
        </h1>

        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 text-red-600 p-3 mb-6 rounded-lg text-sm"
          >
            {errors.general}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 shadow-md"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
          
          <div className="text-center mt-6 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-cyan-600 hover:text-cyan-700 font-semibold">
              Sign up
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
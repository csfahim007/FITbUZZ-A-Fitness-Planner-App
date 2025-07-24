// components/common/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaSignOutAlt, 
  FaChevronDown,
  FaDumbbell,
  FaHome,
  FaChartLine,
  FaAppleAlt,
  FaCog
} from 'react-icons/fa';
import { logout } from '../../features/auth/authSlice';
import { useLogoutMutation } from '../../api/authApi';

// Custom Muscle Icon Component
const MuscleIcon = ({ className = "h-5 w-5" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C10.9 2 10 2.9 10 4C10 4.74 10.4 5.38 11 5.72V7C8.79 7 7 8.79 7 11V13C5.9 13 5 13.9 5 15V19C5 20.1 5.9 21 7 21H9C10.1 21 11 20.1 11 19V17H13V19C13 20.1 13.9 21 15 21H17C18.1 21 19 20.1 19 19V15C19 13.9 18.1 13 17 13V11C17 8.79 15.21 7 13 7V5.72C13.6 5.38 14 4.74 14 4C14 2.9 13.1 2 12 2Z"/>
    <ellipse cx="12" cy="4" rx="2" ry="1.5" opacity="0.3"/>
    <rect x="10" y="8" width="4" height="2" rx="1" opacity="0.5"/>
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutUser] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      // Even if the API call fails, clear local state
      dispatch(logout());
      navigate('/');
    }
  };

  const navigationItems = [
    { name: 'Home', href: '/', icon: FaHome },
    { name: 'Dashboard', href: '/dashboard', icon: FaChartLine, protected: true },
    { name: 'Nutrition', href: '/nutrition', icon: FaAppleAlt, protected: true },
    { name: 'Workouts', href: '/workouts', icon: FaDumbbell, protected: true },
    { name: 'Exercises', href: '/exercises', icon: FaDumbbell, protected: true },
  ];

  const isActiveLink = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-50 to-blue-50 shadow-lg sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-teal-400 via-gray-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <MuscleIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 via-gray-500 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                FitBuzz
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              if (item.protected && !token) return null;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 ${
                    isActiveLink(item.href)
                      ? 'text-teal-600 bg-orange-50 shadow-md border border-orange-100'
                      : 'text-gray-700 hover:text-cyan-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg text-base font-semibold text-gray-700 hover:text-orange-600 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div className="h-9 w-9 bg-gradient-to-br from-teal-400 via-cyan-500 to-gray-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span>{user?.name || 'User'}</span>
                  <FaChevronDown className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-100"
                  >
                    <div className="py-2">
                      <Link
                        to="/my-account"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-5 py-3 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-cyan-600 transition-colors"
                      >
                        <FaUser className="h-5 w-5 mr-3" />
                        My Account
                      </Link>
                      <Link
                        to="/my-account"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-5 py-3 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-cyan-600 transition-colors"
                      >
                        <FaCog className="h-5 w-5 mr-3" />
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-5 py-3 text-base font-medium text-teal-600 hover:bg-red-50 transition-colors"
                      >
                        <FaSignOutAlt className="h-5 w-5 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-cyan-600 px-4 py-2 rounded-lg text-base font-semibold transition-colors hover:bg-white hover:shadow-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg text-base font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-cyan-600 hover:bg-white hover:shadow-sm transition-colors"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-orange-100 shadow-lg"
        >
          <div className="px-3 pt-3 pb-4 space-y-2">
            {navigationItems.map((item) => {
              if (item.protected && !token) return null;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActiveLink(item.href)
                      ? 'text-teal-600 bg-orange-50 border border-orange-100'
                      : 'text-gray-700 hover:text-cyan-600 hover:bg-orange-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {token && (
              <>
                <hr className="my-3 border-orange-100" />
                <Link
                  to="/my-account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-semibold text-gray-700 hover:text-cyan-600 hover:bg-orange-50 transition-colors"
                >
                  <FaUser className="h-5 w-5" />
                  <span>My Account</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-semibold text-teal-600 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}

            {!token && (
              <>
                <hr className="my-3 border-orange-100" />
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-700 hover:text-cyan-600 hover:bg-orange-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Backdrop for user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
}
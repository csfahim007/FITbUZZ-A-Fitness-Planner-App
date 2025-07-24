import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaEdit,
  FaLock,
  FaCog,
  FaBell,
  FaTrash,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetMeQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from '../api/authApi';
import { setCredentials, logout } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

export default function MyAccount() {
  const { user, token } = useSelector((state) => state.auth);
  const { data: currentUser, isLoading, refetch } = useGetMeQuery();
  const [logoutUser] = useLogoutMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fitnessGoal: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    notifications: {
      workoutReminders: true,
      nutritionTips: true,
      progressUpdates: true,
      emailUpdates: false,
    },
  });

  const [formErrors, setFormErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (currentUser?.data) {
      setFormData({
        name: currentUser.data.name || '',
        email: currentUser.data.email || '',
        fitnessGoal: currentUser.data.fitnessGoal || '',
        age: currentUser.data.age || '',
        weight: currentUser.data.weight || '',
        height: currentUser.data.height || '',
        activityLevel: currentUser.data.activityLevel || 'moderate',
        notifications: {
          workoutReminders: currentUser.data.notifications?.workoutReminders ?? true,
          nutritionTips: currentUser.data.notifications?.nutritionTips ?? true,
          progressUpdates: currentUser.data.notifications?.progressUpdates ?? true,
          emailUpdates: currentUser.data.notifications?.emailUpdates ?? false,
        },
      });
    }
  }, [currentUser]);

  const validateForm = () => {
    const errors = {};
    if (formData.name.trim() === '') {
      errors.name = 'Name is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (formData.age && (formData.age < 13 || formData.age > 120)) {
      errors.age = 'Age must be between 13 and 120';
    }
    if (formData.weight && (formData.weight < 20 || formData.weight > 500)) {
      errors.weight = 'Weight must be between 20 and 500 kg';
    }
    if (formData.height && (formData.height < 100 || formData.height > 250)) {
      errors.height = 'Height must be between 100 and 250 cm';
    }
    const validGoals = ['', 'weight_loss', 'muscle_gain', 'endurance', 'strength', 'general_fitness'];
    if (formData.fitnessGoal && !validGoals.includes(formData.fitnessGoal)) {
      errors.fitnessGoal = 'Invalid fitness goal';
    }
    const validLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
    if (formData.activityLevel && !validLevels.includes(formData.activityLevel)) {
      errors.activityLevel = 'Invalid activity level';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('notifications.')) {
      const notificationKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
    // Clear error for the field being edited
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      console.log('Saving profile data:', formData);
      const result = await updateProfile(formData).unwrap();
      console.log('Profile update result:', result);

      if (result.success) {
        const currentToken = token || localStorage.getItem('token');
        dispatch(setCredentials({ user: result.data, token: currentToken }));
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        await refetch();
      }
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.data?.errors) {
        setFormErrors(error.data.errors);
        toast.error('Failed to update profile. Check the form for errors.');
      } else {
        toast.error(error.data?.message || 'Failed to update profile');
      }
    }
  };

  const handleCancelEdit = () => {
    // Reset formData to current user data
    if (currentUser?.data) {
      setFormData({
        name: currentUser.data.name || '',
        email: currentUser.data.email || '',
        fitnessGoal: currentUser.data.fitnessGoal || '',
        age: currentUser.data.age || '',
        weight: currentUser.data.weight || '',
        height: currentUser.data.height || '',
        activityLevel: currentUser.data.activityLevel || 'moderate',
        notifications: {
          workoutReminders: currentUser.data.notifications?.workoutReminders ?? true,
          nutritionTips: currentUser.data.notifications?.nutritionTips ?? true,
          progressUpdates: currentUser.data.notifications?.progressUpdates ?? true,
          emailUpdates: currentUser.data.notifications?.emailUpdates ?? false,
        },
      });
    }
    setFormErrors({});
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await changePassword(passwordData).unwrap();
      if (result.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount().unwrap();
      if (result.success) {
        dispatch(logout());
        toast.success('Account deleted successfully');
      }
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete account');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaLock },
    { id: 'preferences', label: 'Preferences', icon: FaCog },
  ];

  const formatGoalDisplay = (goal) => {
    if (!goal) return 'Not set';
    return goal
      .replace('_', ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const displayUser = currentUser?.data || user;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {displayUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">{displayUser?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal:</span>
                    <span className="text-gray-900 font-medium">
                      {formatGoalDisplay(formData.fitnessGoal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.age || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.height ? `${formData.height} cm` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.weight ? `${formData.weight} kg` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activity Level:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.activityLevel
                        ? formData.activityLevel
                            .replace('_', ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())
                        : 'Not set'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              {/* Profile Info Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    <div className="flex space-x-3">
                      {isEditing && (
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300"
                        >
                          <FaTimes />
                          <span>Cancel</span>
                        </button>
                      )}
                      <button
                        onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                        className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
                      >
                        {isEditing ? <FaSave /> : <FaEdit />}
                        <span>{isEditing ? 'Save' : 'Edit'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50`}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50`}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fitness Goal
                      </label>
                      <select
                        name="fitnessGoal"
                        value={formData.fitnessGoal}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border ${
                          formErrors.fitnessGoal ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50`}
                      >
                        <option value="">Select a goal</option>
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="endurance">Endurance</option>
                        <option value="strength">Strength</option>
                        <option value="general_fitness">General Fitness</option>
                      </select>
                      {formErrors.fitnessGoal && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.fitnessGoal}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border ${
                          formErrors.age ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50`}
                      />
                      {formErrors.age && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.age}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border ${
                          formErrors.weight ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50`}
                      />
                      {formErrors.weight && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.weight}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border ${
                          formErrors.height ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50`}
                      />
                      {formErrors.height && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.height}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activity Level
                      </label>
                      <select
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border ${
                          formErrors.activityLevel ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50`}
                      >
                        <option value="sedentary">Sedentary (little/no exercise)</option>
                        <option value="light">Light (light exercise 1-3 days/week)</option>
                        <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                        <option value="active">Active (hard exercise 6-7 days/week)</option>
                        <option value="very_active">Very Active (very hard exercise/physical job)</option>
                      </select>
                      {formErrors.activityLevel && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.activityLevel}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <button
                          onClick={handleChangePassword}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>

                    <div className="border-b pb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Deletion</h3>
                      <p className="text-gray-600 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Delete Account
                        </button>
                      ) : (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-800 mb-4">
                            Are you absolutely sure? This action cannot be undone.
                          </p>
                          <div className="flex space-x-3">
                            <button
                              onClick={handleDeleteAccount}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              Yes, Delete My Account
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(false)}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 active:bg-gray-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FaBell className="mr-2" />
                        Notifications
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Workout Reminders</p>
                            <p className="text-sm text-gray-600">Get reminded about your scheduled workouts</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notifications.workoutReminders"
                              checked={formData.notifications.workoutReminders}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Nutrition Tips</p>
                            <p className="text-sm text-gray-600">Receive daily nutrition tips and advice</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notifications.nutritionTips"
                              checked={formData.notifications.nutritionTips}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Progress Updates</p>
                            <p className="text-sm text-gray-600">Get notified about your fitness progress</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notifications.progressUpdates"
                              checked={formData.notifications.progressUpdates}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Email Updates</p>
                            <p className="text-sm text-gray-600">Receive weekly summaries via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notifications.emailUpdates"
                              checked={formData.notifications.emailUpdates}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <FaSave />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
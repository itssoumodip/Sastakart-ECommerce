import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
  Camera,
  Settings,
  Bell,
  Lock,
  CreditCard,
  Package,
  Heart,
  LogOut,
  Check,
  AlertCircle,
  Calendar,
  ChevronRight,
  Globe,
  ShoppingBag
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser, logout, loadUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const profileForm = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States'
    }
  });
  
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || '',
        country: user.country || 'United States'
      });
    }
  }, [user, profileForm]);

  const handleProfileUpdate = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put(API_ENDPOINTS.UPDATE_PROFILE, data);
      
      if (response.data && response.data.success) {
        updateUser(response.data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
        // Reload user data to ensure consistency
        await loadUser();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (data.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(API_ENDPOINTS.UPDATE_PASSWORD, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      if (response.data && response.data.success) {
        setIsChangingPassword(false);
        passwordForm.reset();
        toast.success('Password changed successfully!');
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    // Reset form to original user data
    if (user) {
      profileForm.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || '',
        country: user.country || 'United States'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile - ClassyShop</title>
        <meta name="description" content="Manage your account information and settings" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="mt-1 text-gray-600">Manage your profile and account preferences</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Profile Summary */}
                <div className="p-6 border-b border-gray-100">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </div>
                      <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                          activeTab === 'profile'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <User className="w-5 h-5 mr-3" />
                        <span className="font-medium">Profile</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                          activeTab === 'security'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Shield className="w-5 h-5 mr-3" />
                        <span className="font-medium">Security</span>
                      </button>
                    </li>
                    <li>
                      <Link
                        to="/profile/orders"
                        className="w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        <Package className="w-5 h-5 mr-3" />
                        <span className="font-medium">Orders</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/wishlist"
                        className="w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        <Heart className="w-5 h-5 mr-3" />
                        <span className="font-medium">Wishlist</span>
                      </Link>
                    </li>
                  </ul>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === 'profile' && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Profile Header */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                            <p className="text-gray-600 mt-1">Update your personal details and preferences</p>
                          </div>
                          {!isEditing && (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit Profile
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        {isEditing ? (
                          <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-8">
                            {/* Personal Information */}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                  </label>
                                  <input
                                    {...profileForm.register('firstName', { required: 'First name is required' })}
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your first name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                  </label>
                                  <input
                                    {...profileForm.register('lastName', { required: 'Last name is required' })}
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your last name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                  </label>
                                  <input
                                    {...profileForm.register('email')}
                                    type="email"
                                    readOnly
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                                    placeholder="Email cannot be changed"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                  </label>
                                  <input
                                    {...profileForm.register('phone')}
                                    type="tel"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your phone number"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Address Information */}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street Address
                                  </label>
                                  <input
                                    {...profileForm.register('address')}
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your street address"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                  </label>
                                  <input
                                    {...profileForm.register('city')}
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your city"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State/Province
                                  </label>
                                  <input
                                    {...profileForm.register('state')}
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your state"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Postal Code
                                  </label>
                                  <input
                                    {...profileForm.register('postalCode')}
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter postal code"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                  </label>
                                  <select
                                    {...profileForm.register('country')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  >
                                    <option value="United States">United States</option>
                                    <option value="Canada">Canada</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Germany">Germany</option>
                                    <option value="France">France</option>
                                    <option value="India">India</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
                              <button
                                type="button"
                                onClick={handleEditCancel}
                                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              >
                                {loading ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-8">
                            {/* Personal Information Display */}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-blue-50 rounded-lg">
                                    <User className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-green-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-medium text-gray-900">{user?.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-purple-50 rounded-lg">
                                    <Phone className="w-5 h-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Address Information Display */}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                  <MapPin className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Shipping Address</p>
                                  {user?.address ? (
                                    <div className="font-medium text-gray-900">
                                      <p>{user.address}</p>
                                      <p>{user.city}, {user.state} {user.postalCode}</p>
                                      <p>{user.country}</p>
                                    </div>
                                  ) : (
                                    <p className="font-medium text-gray-500">No address provided</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'security' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Security Header */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                            <p className="text-gray-600 mt-1">Manage your password and security preferences</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Security Status */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
                          <div className="flex items-start">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Shield className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-green-900">Account Secured</h3>
                              <p className="text-green-700 mt-1">Your account is protected with a strong password.</p>
                            </div>
                          </div>
                        </div>

                        {/* Change Password Section */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Password</h3>
                              <p className="text-gray-600 mt-1">Update your password to keep your account secure</p>
                            </div>
                            {!isChangingPassword && (
                              <button
                                onClick={() => setIsChangingPassword(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                              >
                                Change Password
                              </button>
                            )}
                          </div>

                          {isChangingPassword && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-gray-50 rounded-xl p-6"
                            >
                              <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                  </label>
                                  <div className="relative">
                                    <input
                                      {...passwordForm.register('currentPassword', { required: 'Current password is required' })}
                                      type={showPassword ? 'text' : 'password'}
                                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                                      placeholder="Enter your current password"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                  </label>
                                  <input
                                    {...passwordForm.register('newPassword', { 
                                      required: 'New password is required',
                                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your new password"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                  </label>
                                  <input
                                    {...passwordForm.register('confirmPassword', { required: 'Please confirm your password' })}
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Confirm your new password"
                                  />
                                </div>
                                <div className="flex items-center justify-end space-x-4">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsChangingPassword(false);
                                      passwordForm.reset();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                  >
                                    {loading ? (
                                      <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                      </>
                                    ) : (
                                      <>
                                        <Lock className="w-4 h-4 mr-2" />
                                        Update Password
                                      </>
                                    )}
                                  </button>
                                </div>
                              </form>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

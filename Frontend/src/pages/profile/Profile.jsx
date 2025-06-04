import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Cookies from 'js-cookie';
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
  AlertCircle
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser, logout, loadUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

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


  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload an image file (JPEG, PNG, or GIF)');
      return;
    }

    // Check file size (limit to 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      
      // Convert file to base64
      const reader = new FileReader();      reader.onloadend = async () => {
        try {
          // Get token from cookie
          const token = Cookies.get('token');
          if (!token) {
            toast.error('Authentication token not found. Please log in again.');
            setUploadingAvatar(false);
            return;
          }
          
          console.log('Uploading avatar to:', API_ENDPOINTS.UPDATE_AVATAR);
          console.log('Auth token exists:', !!token);
          
          // Send avatar to backend
          const response = await axios.post(API_ENDPOINTS.UPDATE_AVATAR, {
            avatar: reader.result
          }, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.data && response.data.success) {
            // Update user state with new avatar
            updateUser({ ...user, avatar: response.data.avatarUrl });
            toast.success('Profile picture updated successfully!');
            // Reload user data to ensure consistency
            await loadUser();          } else {
            throw new Error('Failed to update profile picture');
          }
        } catch (error) {
          console.error('Avatar upload error:', error);
          console.error('Error details:', error.response?.data || error.message);
          
          if (error.response?.status === 401) {
            toast.error('Please log in again to update your profile picture.');
          } else if (error.response?.status === 413) {
            toast.error('Image is too large. Please choose a smaller image.');
          } else {
            toast.error(error.response?.data?.message || 'Failed to update profile picture. Please try again.');
          }
        } finally {
          setUploadingAvatar(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload image');
      setUploadingAvatar(false);
    }
  };

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'security', label: 'Security', icon: Shield },
  ];

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
                  <div className="text-center">                    <div className="relative inline-block">
                      {user?.avatar && user.avatar !== 'default-avatar.jpg' ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                          <img 
                            src={user.avatar} 
                            alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.parentNode.innerHTML = `<div class="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-white text-2xl font-bold">
                                ${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}
                              </div>`;
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-white text-2xl font-bold">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                      )}
                      
                      {/* Camera button */}
                      <button
                        onClick={handleAvatarClick}
                        disabled={uploadingAvatar}
                        className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {uploadingAvatar ? (
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Camera className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
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
                    {sidebarItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                              activeTab === item.id
                                ? 'bg-gray-300/50 text-gray-700 border-r-2 border-black'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.label}
                          </button>
                        </li>
                      );
                    })}
                    <li className="pt-4 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <AnimatePresence mode="wait">
                  {activeTab === 'profile' && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6"
                    >
                      {/* Profile Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="sm:text-2xl text-xl font-semibold text-gray-900">Profile Information</h2>
                          <p className="text-gray-600 sm:text-md text-sm">Update your account details and personal information</p>
                        </div>
                        {!isEditing && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsEditing(true)}
                            className="flex sm:text-md text-sm items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                          </motion.button>
                        )}
                      </div>

                      {/* Profile Form */}
                      <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* First Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <User className="w-4 h-4 inline mr-2" />
                              First Name
                            </label>
                            <input
                              {...profileForm.register('firstName')}
                              type="text"
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                !isEditing ? 'bg-gray-50' : 'bg-white'
                              }`}
                              placeholder="Enter your first name"
                            />
                          </div>

                          {/* Last Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <User className="w-4 h-4 inline mr-2" />
                              Last Name
                            </label>
                            <input
                              {...profileForm.register('lastName')}
                              type="text"
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                !isEditing ? 'bg-gray-50' : 'bg-white'
                              }`}
                              placeholder="Enter your last name"
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Mail className="w-4 h-4 inline mr-2" />
                              Email Address
                            </label>
                            <input
                              {...profileForm.register('email')}
                              type="email"
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                !isEditing ? 'bg-gray-50' : 'bg-white'
                              }`}
                              placeholder="Enter your email"
                            />
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Phone className="w-4 h-4 inline mr-2" />
                              Phone Number
                            </label>
                            <input
                              {...profileForm.register('phone')}
                              type="tel"
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                !isEditing ? 'bg-gray-50' : 'bg-white'
                              }`}
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>

                        {/* Address Section */}
                        <div className="pt-6 border-t border-gray-200">
                          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Address Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Address */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Street Address
                              </label>
                              <input
                                {...profileForm.register('address')}
                                type="text"
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                  !isEditing ? 'bg-gray-50' : 'bg-white'
                                }`}
                                placeholder="Enter your street address"
                              />
                            </div>

                            {/* City */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                              </label>
                              <input
                                {...profileForm.register('city')}
                                type="text"
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                  !isEditing ? 'bg-gray-50' : 'bg-white'
                                }`}
                                placeholder="Enter your city"
                              />
                            </div>

                            {/* State */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                State/Province
                              </label>
                              <input
                                {...profileForm.register('state')}
                                type="text"
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                  !isEditing ? 'bg-gray-50' : 'bg-white'
                                }`}
                                placeholder="Enter your state"
                              />
                            </div>

                            {/* Postal Code */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Postal Code
                              </label>
                              <input
                                {...profileForm.register('postalCode')}
                                type="text"
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                  !isEditing ? 'bg-gray-50' : 'bg-white'
                                }`}
                                placeholder="Enter your postal code"
                              />
                            </div>

                            {/* Country */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                              </label>
                              <input
                                {...profileForm.register('country')}
                                type="text"
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                  !isEditing ? 'bg-gray-50' : 'bg-white'
                                }`}
                                placeholder="Enter your country"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={handleEditCancel}
                              className="flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit"
                              disabled={loading}
                              className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {loading ? (
                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Save className="w-4 h-4 mr-2" />
                              )}
                              {loading ? 'Saving...' : 'Save Changes'}
                            </motion.button>
                          </div>
                        )}
                      </form>
                    </motion.div>
                  )}

                  {activeTab === 'security' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6"
                    >
                      {/* Security Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">Security Settings</h2>
                          <p className="text-gray-600">Manage your password and security preferences</p>
                        </div>
                      </div>

                      {/* Password Change Section */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                              <Lock className="w-5 h-5 mr-2" />
                              Change Password
                            </h3>
                            <p className="text-gray-600 text-sm">Update your password to keep your account secure</p>
                          </div>
                          {!isChangingPassword && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setIsChangingPassword(true)}
                              className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-grayco-700 transition-colors"
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Change Password
                            </motion.button>
                          )}
                        </div>

                        {isChangingPassword && (
                          <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                            {/* Current Password */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                              </label>
                              <div className="relative">
                                <input
                                  {...passwordForm.register('currentPassword')}
                                  type={showPassword ? 'text' : 'password'}
                                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                            {/* New Password */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                              </label>
                              <input
                                {...passwordForm.register('newPassword')}
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your new password"
                              />
                            </div>

                            {/* Confirm Password */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                {...passwordForm.register('confirmPassword')}
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Confirm your new password"
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end space-x-4 pt-4">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => {
                                  setIsChangingPassword(false);
                                  passwordForm.reset();
                                }}
                                className="flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {loading ? (
                                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4 mr-2" />
                                )}
                                {loading ? 'Updating...' : 'Update Password'}
                              </motion.button>
                            </div>
                          </form>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'orders' && (
                    <motion.div
                      key="orders"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6"
                    >
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Order History</h3>
                        <p className="text-gray-600 mb-6">View and track your order history</p>
                        <Link
                          to="/profile/orders"
                          className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          View Orders
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'wishlist' && (
                    <motion.div
                      key="wishlist"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6"
                    >
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Your Wishlist</h3>
                        <p className="text-gray-600 mb-6">Manage your saved items and favorites</p>
                        <Link
                          to="/wishlist"
                          className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          View Wishlist
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  {(activeTab === 'notifications' || activeTab === 'settings') && (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6"
                    >
                      <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                        <p className="text-gray-600">This feature is under development and will be available soon.</p>
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
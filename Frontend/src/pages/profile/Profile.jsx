import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
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
  Globe,
  CreditCard,
  Package
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      postalCode: user?.postalCode || '',
      country: user?.country || 'United States'
    }
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleProfileUpdate = async (data) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      });

      if (response.ok) {
        setIsChangingPassword(false);
        passwordForm.reset();
        toast.success('Password changed successfully!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    profileForm.reset();
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    passwordForm.reset();
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Modern E-Commerce</title>
        <meta name="description" content="Manage your account information and preferences." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div 
              className="mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <h1 className="text-4xl font-bold mb-2">My Profile</h1>
                <p className="text-indigo-100">Manage your account information and preferences</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <motion.div 
                className="lg:col-span-1"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 space-y-2">
                  <div className="text-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-gray-600 text-sm">{user?.email}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        Verified Account
                      </span>
                    </div>
                  </div>

                  <nav className="space-y-1">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500">
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile Info</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <Lock className="w-5 h-5" />
                      <span>Security</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <Bell className="w-5 h-5" />
                      <span>Notifications</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <CreditCard className="w-5 h-5" />
                      <span>Payment Methods</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <Package className="w-5 h-5" />
                      <span>Order History</span>
                    </button>
                  </nav>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4" />
                        <span>Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="w-4 h-4" />
                        <span>Account secured</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Personal Information */}
                <motion.div 
                  className="bg-white rounded-2xl shadow-xl p-8"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                        <p className="text-gray-600">Update your personal details</p>
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      {!isEditing ? (
                        <motion.button
                          key="edit"
                          onClick={() => setIsEditing(true)}
                          className="btn-primary flex items-center space-x-2"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
                        </motion.button>
                      ) : (
                        <motion.div
                          key="actions"
                          className="flex space-x-2"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <motion.button
                            onClick={cancelEdit}
                            className="btn-outline flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </motion.button>
                          <motion.button
                            type="submit"
                            form="profile-form"
                            disabled={loading}
                            className="btn-primary flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Save className="w-4 h-4" />
                            <span>{loading ? 'Saving...' : 'Save'}</span>
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.form
                        id="profile-form"
                        onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              First Name
                            </label>
                            <input
                              {...profileForm.register('firstName', { required: 'First name is required' })}
                              type="text"
                              className="form-input"
                              placeholder="Enter your first name"
                            />
                            {profileForm.formState.errors.firstName && (
                              <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.firstName.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Last Name
                            </label>
                            <input
                              {...profileForm.register('lastName', { required: 'Last name is required' })}
                              type="text"
                              className="form-input"
                              placeholder="Enter your last name"
                            />
                            {profileForm.formState.errors.lastName && (
                              <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.lastName.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            {...profileForm.register('email', { 
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                            type="email"
                            className="form-input"
                            placeholder="Enter your email address"
                          />
                          {profileForm.formState.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.email.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            {...profileForm.register('phone')}
                            type="tel"
                            className="form-input"
                            placeholder="Enter your phone number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Address
                          </label>
                          <input
                            {...profileForm.register('address')}
                            type="text"
                            className="form-input"
                            placeholder="Enter your street address"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              {...profileForm.register('city')}
                              type="text"
                              className="form-input"
                              placeholder="Enter your city"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              State
                            </label>
                            <input
                              {...profileForm.register('state')}
                              type="text"
                              className="form-input"
                              placeholder="Enter your state"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Postal Code
                            </label>
                            <input
                              {...profileForm.register('postalCode')}
                              type="text"
                              className="form-input"
                              placeholder="Enter postal code"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Country
                          </label>
                          <select
                            {...profileForm.register('country')}
                            className="form-input"
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                            <p className="text-gray-900 font-semibold">{user?.firstName || 'Not set'}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                            <p className="text-gray-900 font-semibold">{user?.lastName || 'Not set'}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                          <p className="text-gray-900 font-semibold">{user?.email || 'Not set'}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                          <p className="text-gray-900 font-semibold">{user?.phone || 'Not set'}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                          <p className="text-gray-900 font-semibold">
                            {user?.address ? (
                              <>
                                {user.address}<br />
                                {user.city && `${user.city}, `}
                                {user.state && `${user.state} `}
                                {user.postalCode}<br />
                                {user.country}
                              </>
                            ) : (
                              'Not set'
                            )}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Security Settings */}
                <motion.div 
                  className="bg-white rounded-2xl shadow-xl p-8"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Security Settings</h3>
                        <p className="text-gray-600">Manage your password and security preferences</p>
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      {!isChangingPassword ? (
                        <motion.button
                          key="change-password"
                          onClick={() => setIsChangingPassword(true)}
                          className="btn-primary flex items-center space-x-2"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Lock className="w-4 h-4" />
                          <span>Change Password</span>
                        </motion.button>
                      ) : (
                        <motion.div
                          key="password-actions"
                          className="flex space-x-2"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <motion.button
                            onClick={cancelPasswordChange}
                            className="btn-outline flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </motion.button>
                          <motion.button
                            type="submit"
                            form="password-form"
                            disabled={loading}
                            className="btn-primary flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Save className="w-4 h-4" />
                            <span>{loading ? 'Changing...' : 'Change Password'}</span>
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence mode="wait">
                    {isChangingPassword ? (
                      <motion.form
                        id="password-form"
                        onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              {...passwordForm.register('currentPassword', { required: 'Current password is required' })}
                              type={showPassword ? 'text' : 'password'}
                              className="form-input pr-10"
                              placeholder="Enter your current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-400" />
                              ) : (
                                <Eye className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {passwordForm.formState.errors.currentPassword && (
                            <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            {...passwordForm.register('newPassword', { 
                              required: 'New password is required',
                              minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                              }
                            })}
                            type="password"
                            className="form-input"
                            placeholder="Enter your new password"
                          />
                          {passwordForm.formState.errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            {...passwordForm.register('confirmPassword', { required: 'Please confirm your new password' })}
                            type="password"
                            className="form-input"
                            placeholder="Confirm your new password"
                          />
                          {passwordForm.formState.errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                          )}
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-green-900">Password Protected</h4>
                                <p className="text-sm text-green-700">Your account is secured with a strong password</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <Mail className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-blue-900">Email Verified</h4>
                                <p className="text-sm text-blue-700">Your email address has been verified</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

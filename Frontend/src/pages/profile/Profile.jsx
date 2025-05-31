import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Package,
  ChevronRight,
  Calendar,
  ShoppingBag,
  Heart,
  LogOut
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

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

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
  };

  return (
    <>
      <Helmet>
        <title>Your Profile - Modern Shop</title>
        <meta name="description" content="Manage your account information and settings" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
                <p className="mt-1 text-gray-600">Manage your account information and preferences</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Profile Photo Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30 mb-3">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <button 
                      className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100"
                      aria-label="Upload photo"
                    >
                      <Camera className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-blue-100 text-sm">{user?.email}</p>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4">
                  <ul className="space-y-1">
                    <li>
                      <button 
                        onClick={() => setActiveTab('general')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
                          activeTab === 'general' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                      >
                        <div className="flex items-center">
                          <User className="w-5 h-5 mr-3" />
                          <span>General Information</span>
                        </div>
                        {activeTab === 'general' && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
                          activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                      >
                        <div className="flex items-center">
                          <Shield className="w-5 h-5 mr-3" />
                          <span>Security</span>
                        </div>
                        {activeTab === 'security' && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </li>
                    <li>
                      <Link 
                        to="/profile/orders" 
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <ShoppingBag className="w-5 h-5 mr-3" />
                          <span>Orders</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/wishlist" 
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <Heart className="w-5 h-5 mr-3" />
                          <span>Wishlist</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveTab('payment')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
                          activeTab === 'payment' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                      >
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-3" />
                          <span>Payment Methods</span>
                        </div>
                        {activeTab === 'payment' && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
                          activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                      >
                        <div className="flex items-center">
                          <Bell className="w-5 h-5 mr-3" />
                          <span>Notifications</span>
                        </div>
                        {activeTab === 'notifications' && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* Account Status Card */}
              <div className="bg-white rounded-2xl shadow-sm mt-6 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Account Status</h3>
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-medium">May 2023</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className="text-sm font-medium">Standard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-9">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === 'general' && (
                    <motion.div
                      key="general"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6"
                    >
                      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                        <h2 className="text-lg font-medium text-gray-900">General Information</h2>
                        {!isEditing && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                              <input
                                {...profileForm.register('firstName')}
                                type="text"
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                              <input
                                {...profileForm.register('lastName')}
                                type="text"
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                              <input
                                {...profileForm.register('email')}
                                type="email"
                                readOnly
                                className="w-full border-gray-300 rounded-lg bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                              <input
                                {...profileForm.register('phone')}
                                type="tel"
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="border-t border-b border-gray-200 py-4 my-6">
                            <h3 className="text-md font-medium text-gray-900 mb-4">Shipping Address</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                  {...profileForm.register('address')}
                                  type="text"
                                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                  {...profileForm.register('city')}
                                  type="text"
                                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                                <input
                                  {...profileForm.register('state')}
                                  type="text"
                                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input
                                  {...profileForm.register('postalCode')}
                                  type="text"
                                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <select
                                  {...profileForm.register('country')}
                                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="United States">United States</option>
                                  <option value="Canada">Canada</option>
                                  <option value="United Kingdom">United Kingdom</option>
                                  <option value="Australia">Australia</option>
                                  <option value="Germany">Germany</option>
                                  <option value="France">France</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
                            >
                              {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                              <div className="mt-3 space-y-4">
                                <div className="flex items-center">
                                  <User className="w-5 h-5 text-gray-400 mr-3" />
                                  <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                  <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{user?.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                                  <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{user?.phone || 'Not provided'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                              <div className="mt-3">
                                <div className="flex items-start">
                                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                  <div>
                                    {user?.address ? (
                                      <>
                                        <p className="font-medium">{user.address}</p>
                                        <p>{user.city}, {user.state} {user.postalCode}</p>
                                        <p>{user.country}</p>
                                      </>
                                    ) : (
                                      <p className="text-gray-500">No address provided</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'security' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6"
                    >
                      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
                        {!isChangingPassword && (
                          <button
                            onClick={() => setIsChangingPassword(true)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            Change Password
                          </button>
                        )}
                      </div>

                      {isChangingPassword ? (
                        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6 max-w-md mx-auto">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <div className="relative">
                              <input
                                {...passwordForm.register('currentPassword')}
                                type={showPassword ? 'text' : 'password'}
                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Eye className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                              {...passwordForm.register('newPassword')}
                              type={showPassword ? 'text' : 'password'}
                              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                              {...passwordForm.register('confirmPassword')}
                              type={showPassword ? 'text' : 'password'}
                              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setIsChangingPassword(false)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
                            >
                              {loading ? 'Updating...' : 'Update Password'}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                            <div className="flex items-start">
                              <Shield className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                              <div>
                                <h3 className="text-sm font-medium text-blue-800">Your account is secure</h3>
                                <p className="mt-1 text-sm text-blue-700">
                                  We recommend changing your password regularly and enabling two-factor authentication for added security.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h3 className="text-md font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                              </div>
                              <div className="relative">
                                <input type="checkbox" className="sr-only" id="toggle-2fa" />
                                <div className="h-6 w-11 bg-gray-200 rounded-full"></div>
                                <div className="absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition"></div>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h3 className="text-md font-medium text-gray-900 mb-4">Login History</h3>
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Globe className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Chrome on Windows</p>
                                    <p className="text-xs text-gray-500">New York, USA (Your current session)</p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">Just now</span>
                              </div>
                              <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Globe className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Safari on iPhone</p>
                                    <p className="text-xs text-gray-500">New York, USA</p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">Yesterday at 2:43 PM</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'payment' && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6"
                    >
                      <div className="border-b border-gray-200 pb-4 mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-center text-gray-500">
                            No payment methods added yet. Add a payment method to speed up checkout.
                          </p>
                        </div>

                        <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                          <CreditCard className="mr-2 h-5 w-5" />
                          Add Payment Method
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'notifications' && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6"
                    >
                      <div className="border-b border-gray-200 pb-4 mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Order Updates</h3>
                            <p className="text-sm text-gray-500">Get notifications about your order status</p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked
                              id="notifications-order"
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Promotions</h3>
                            <p className="text-sm text-gray-500">Receive emails about new promotions and discounts</p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked
                              id="notifications-promo"
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">New Product Arrivals</h3>
                            <p className="text-sm text-gray-500">Get updates when new products are added</p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="notifications-products"
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
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

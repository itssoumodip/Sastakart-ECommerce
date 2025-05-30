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
        <title>My Profile - RETRO-SHOP</title>
        <meta name="description" content="Manage your account information and preferences." />
      </Helmet>

      <div className="min-h-screen bg-black">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div 
              className="mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-black border-2 border-white p-8 text-white">
                <h1 className="text-4xl font-mono font-bold mb-2 uppercase tracking-widest">[ MY PROFILE ]</h1>
                <p className="text-white/70 font-mono uppercase tracking-wide">Manage your account information and preferences</p>
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
                <div className="bg-black border-2 border-white p-6 space-y-2">
                  <div className="text-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 border-2 border-white mx-auto mb-4 flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-black border border-white flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-white font-mono uppercase tracking-widest">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-white/70 text-sm font-mono">{user?.email}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 border border-white text-xs font-medium text-white font-mono uppercase tracking-wider">
                        <div className="w-2 h-2 bg-white rounded-none mr-2"></div>
                        Verified
                      </span>
                    </div>
                  </div>

                  <nav className="space-y-1">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-white text-black border-2 border-white font-mono uppercase tracking-wide">
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile Info</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white border border-white hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wide">
                      <Lock className="w-5 h-5" />
                      <span>Security</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white border border-white hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wide">
                      <Bell className="w-5 h-5" />
                      <span>Notifications</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white border border-white hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wide">
                      <CreditCard className="w-5 h-5" />
                      <span>Payment</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white border border-white hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wide">
                      <Package className="w-5 h-5" />
                      <span>Orders</span>
                    </button>
                  </nav>
                </div>
              </motion.div>

              {/* Main Content Area */}
              <motion.div 
                className="lg:col-span-3 space-y-8"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Profile Information Section */}
                <div className="bg-black border-2 border-white p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide">[ PERSONAL INFORMATION ]</h3>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wider"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">First Name</label>
                          <input
                            type="text"
                            {...profileForm.register('firstName', { required: true })}
                            className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0"
                          />
                          {profileForm.formState.errors.firstName && (
                            <p className="mt-1 text-sm text-white font-mono">First name is required</p>
                          )}
                        </div>
                        
                        {/* Last Name */}
                        <div>
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">Last Name</label>
                          <input
                            type="text"
                            {...profileForm.register('lastName', { required: true })}
                            className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0"
                          />
                          {profileForm.formState.errors.lastName && (
                            <p className="mt-1 text-sm text-white font-mono">Last name is required</p>
                          )}
                        </div>
                        
                        {/* Email */}
                        <div>
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">Email Address</label>
                          <input
                            type="email"
                            {...profileForm.register('email', { required: true })}
                            className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0"
                            disabled
                          />
                        </div>
                        
                        {/* Phone */}
                        <div>
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">Phone Number</label>
                          <input
                            type="tel"
                            {...profileForm.register('phone')}
                            className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0"
                          />
                        </div>
                        
                        {/* Address */}
                        <div className="md:col-span-2">
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">Street Address</label>
                          <input
                            type="text"
                            {...profileForm.register('address')}
                            className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0"
                          />
                        </div>
                        
                        {/* City */}
                        <div>
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">City</label>
                          <input
                            type="text"
                            {...profileForm.register('city')}
                            className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0"
                          />
                        </div>
                        
                        {/* State/Province */}
                        <div>
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">State/Province</label>
                          <input
                            type="text"
                            {...profileForm.register('state')}
                            className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0"
                          />
                        </div>
                        
                        {/* Postal Code */}
                        <div>
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">ZIP/Postal Code</label>
                          <input
                            type="text"
                            {...profileForm.register('postalCode')}
                            className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0"
                          />
                        </div>
                        
                        {/* Country */}
                        <div>
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">Country</label>
                          <select
                            {...profileForm.register('country')}
                            className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0"
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Japan">Japan</option>
                            <option value="China">China</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-4 border-t-2 border-white/30">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-white text-black border-2 border-white px-6 py-2 font-mono uppercase tracking-wider font-bold hover:bg-black hover:text-white transition-colors flex items-center"
                        >
                          {loading ? (
                            <>
                              <div className="h-4 w-4 border-2 border-black border-t-transparent animate-spin mr-2"></div>
                              SAVING...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              SAVE CHANGES
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="border-2 border-white px-6 py-2 text-white font-mono uppercase tracking-wider hover:bg-white hover:text-black transition-colors flex items-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          CANCEL
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1 border border-white/30 p-4">
                          <p className="text-sm text-white/50 font-mono uppercase tracking-wider">First Name</p>
                          <p className="text-white font-mono">{user?.firstName || 'N/A'}</p>
                        </div>
                        <div className="space-y-1 border border-white/30 p-4">
                          <p className="text-sm text-white/50 font-mono uppercase tracking-wider">Last Name</p>
                          <p className="text-white font-mono">{user?.lastName || 'N/A'}</p>
                        </div>
                        <div className="space-y-1 border border-white/30 p-4">
                          <p className="text-sm text-white/50 font-mono uppercase tracking-wider">Email</p>
                          <p className="text-white font-mono">{user?.email || 'N/A'}</p>
                        </div>
                        <div className="space-y-1 border border-white/30 p-4">
                          <p className="text-sm text-white/50 font-mono uppercase tracking-wider">Phone</p>
                          <p className="text-white font-mono">{user?.phone || 'N/A'}</p>
                        </div>
                        <div className="space-y-1 border border-white/30 p-4">
                          <p className="text-sm text-white/50 font-mono uppercase tracking-wider">Location</p>
                          <p className="text-white font-mono">
                            {user?.city && user?.state ? `${user.city}, ${user.state}` : 'N/A'}
                            {user?.country && `, ${user.country}`}
                          </p>
                        </div>
                        <div className="space-y-1 border border-white/30 p-4">
                          <p className="text-sm text-white/50 font-mono uppercase tracking-wider">Member Since</p>
                          <p className="text-white font-mono">November 2023</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Change Section */}
                <div className="bg-black border-2 border-white p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide">[ CHANGE PASSWORD ]</h3>
                    {!isChangingPassword && (
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="flex items-center space-x-2 px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors font-mono uppercase tracking-wider"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Change</span>
                      </button>
                    )}
                  </div>

                  {isChangingPassword ? (
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
                      <div className="space-y-4">
                        {/* Current Password */}
                        <div>
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              {...passwordForm.register('currentPassword', { required: true })}
                              className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0 pr-10"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-white/70 hover:text-white" />
                              ) : (
                                <Eye className="h-5 w-5 text-white/70 hover:text-white" />
                              )}
                            </button>
                          </div>
                          {passwordForm.formState.errors.currentPassword && (
                            <p className="mt-1 text-sm text-white font-mono">Current password is required</p>
                          )}
                        </div>
                        
                        {/* New Password */}
                        <div>
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">New Password</label>
                          <input
                            type="password"
                            {...passwordForm.register('newPassword', { 
                              required: true,
                              minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                              }
                            })}
                            className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0"
                          />
                          {passwordForm.formState.errors.newPassword && (
                            <p className="mt-1 text-sm text-white font-mono">
                              {passwordForm.formState.errors.newPassword.message || 'New password is required'}
                            </p>
                          )}
                        </div>
                        
                        {/* Confirm New Password */}
                        <div>
                          <label className="block font-mono text-sm font-medium text-white uppercase tracking-wide mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            {...passwordForm.register('confirmPassword', { 
                              required: true,
                              validate: value => value === passwordForm.watch('newPassword') || 'Passwords do not match'
                            })}
                            className="w-full bg-black border-2 border-white text-white font-mono h-12 focus:ring-0"
                          />
                          {passwordForm.formState.errors.confirmPassword && (
                            <p className="mt-1 text-sm text-white font-mono">
                              {passwordForm.formState.errors.confirmPassword.message || 'Confirm password is required'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-4 border-t-2 border-white/30">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-white text-black border-2 border-white px-6 py-2 font-mono uppercase tracking-wider font-bold hover:bg-black hover:text-white transition-colors flex items-center"
                        >
                          {loading ? (
                            <>
                              <div className="h-4 w-4 border-2 border-black border-t-transparent animate-spin mr-2"></div>
                              UPDATING...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              UPDATE PASSWORD
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={cancelPasswordChange}
                          className="border-2 border-white px-6 py-2 text-white font-mono uppercase tracking-wider hover:bg-white hover:text-black transition-colors flex items-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          CANCEL
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="border border-white/30 p-4">
                      <p className="text-white font-mono">For security reasons, your password is not displayed. Use the change button to update your password.</p>
                      <div className="mt-2 flex items-center">
                        <Shield className="w-5 h-5 text-white mr-2" />
                        <p className="text-white/70 text-sm font-mono uppercase tracking-wider">Last changed: 30 days ago</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Notification Preferences */}
                <div className="bg-black border-2 border-white p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide">[ NOTIFICATION PREFERENCES ]</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border border-white/30 p-4">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-white mr-3" />
                        <span className="text-white font-mono">Email Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-black peer-focus:outline-none border-2 border-white peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between border border-white/30 p-4">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 text-white mr-3" />
                        <span className="text-white font-mono">Order Updates</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-black peer-focus:outline-none border-2 border-white peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between border border-white/30 p-4">
                      <div className="flex items-center">
                        <Settings className="w-5 h-5 text-white mr-3" />
                        <span className="text-white font-mono">Promotions and Deals</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-black peer-focus:outline-none border-2 border-white peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

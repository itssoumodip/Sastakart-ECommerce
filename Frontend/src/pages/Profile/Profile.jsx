import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real implementation, dispatch an action to update the user profile
    // For now, we'll just simulate success
    setTimeout(() => {
      toast.success('Profile updated successfully');
      setLoading(false);
    }, 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    
    // In a real implementation, dispatch an action to change the password
    // For now, we'll just simulate success
    setTimeout(() => {
      toast.success('Password changed successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">My Account</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              className={`px-6 py-4 text-lg font-medium ${
                activeTab === 'profile' ? 'bg-gray-100 border-b-2 border-black' : ''
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`px-6 py-4 text-lg font-medium ${
                activeTab === 'password' ? 'bg-gray-100 border-b-2 border-black' : ''
              }`}
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </button>
            <button
              className={`px-6 py-4 text-lg font-medium ${
                activeTab === 'orders' ? 'bg-gray-100 border-b-2 border-black' : ''
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Order History
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-6">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            )}
            
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange}>
                <div className="mb-6">
                  <label htmlFor="currentPassword" className="block mb-2 text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <Input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            )}
            
            {activeTab === 'orders' && (
              <div>
                <p className="text-gray-600 mb-4">Your order history will be displayed here.</p>
                
                {/* This would be populated with real order data in a production app */}
                <div className="border rounded-lg divide-y">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Order #{Math.floor(Math.random() * 10000)}</span>
                        <span className="text-gray-500">
                          {new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{Math.floor(Math.random() * 5) + 1} items</span>
                        <span className="font-semibold">${(Math.random() * 200 + 50).toFixed(2)}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order === 1 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order === 1 ? 'Delivered' : 'Processing'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

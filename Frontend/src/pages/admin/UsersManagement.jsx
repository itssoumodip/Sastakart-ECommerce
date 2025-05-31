import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Edit, Trash2, ArrowUpDown, Plus, Users, UserCheck, UserX, Shield, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'Active'
  });
  const usersPerPage = 10;

  // API Functions
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000${API_ENDPOINTS.ADMIN_USERS}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Transform backend data to match frontend structure
        const transformedUsers = response.data.users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role === 'admin' ? 'Admin' : 'Customer',
          status: 'Active', // You can add status field to backend user model
          lastLogin: new Date(user.createdAt).toISOString().split('T')[0],
          orders: 0 // You can fetch order count from orders collection
        }));
        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000${API_ENDPOINTS.ADMIN_CREATE_USER}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('User created successfully');
        fetchUsers(); // Refresh the users list
        setIsModalOpen(false);
        setFormData({ name: '', email: '', role: 'user', status: 'Active' });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000${API_ENDPOINTS.ADMIN_UPDATE_USER(userId)}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('User updated successfully');
        fetchUsers(); // Refresh the users list
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'user', status: 'Active' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const deleteUserAPI = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000${API_ENDPOINTS.ADMIN_DELETE_USER(userId)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers(); // Refresh the users list
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let updatedUsers = [...users];

    // Filter by search term
    if (searchTerm) {
      updatedUsers = updatedUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      updatedUsers = updatedUsers.filter(user => user.status === statusFilter);
    }

    // Filter by role
    if (roleFilter !== 'all') {
      updatedUsers = updatedUsers.filter(user => user.role === roleFilter);
    }

    // Sort users
    updatedUsers.sort((a, b) => {
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];

      if (typeof fieldA === 'string') {
        return sortOrder === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else {
        return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
    });

    setFilteredUsers(updatedUsers);
  }, [searchTerm, statusFilter, roleFilter, sortBy, sortOrder, users]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserAPI(userId);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role === 'Admin' ? 'admin' : 'user',
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingUser) {
      await updateUser(editingUser.id, formData);
    } else {
      await createUser(formData);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getRoleBadge = (role) => {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
    
    if (role === 'Admin') {
      return (
        <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </span>
      );
    } else {
      return (
        <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
          <Users className="h-3 w-3 mr-1" />
          Customer
        </span>
      );
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
    
    if (status === 'Active') {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          <UserCheck className="h-3 w-3 mr-1" />
          Active
        </span>
      );
    } else {
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          <UserX className="h-3 w-3 mr-1" />
          Inactive
        </span>
      );
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Users Management | Admin Dashboard</title>
        </Helmet>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <motion.div 
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
              variants={itemVariants}
            >
              <div>
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="h-8 w-8 text-gray-600" />
                  Users
                </h1>
                <p className="text-gray-600 mt-2">Manage and monitor all user accounts</p>
              </div>
              <motion.button
                onClick={handleAddNew}
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-5 w-5" />
                Add User
              </motion.button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              variants={itemVariants}
            >
              <motion.div 
                className="card p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'Customer').length}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'Admin').length}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'Active').length}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div 
              className="card p-6 mb-8"
              variants={itemVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">All Roles</option>
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                </select>

                <motion.button
                  onClick={() => handleSort('name')}
                  className="btn-outline flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by {sortBy}
                </motion.button>
              </div>
            </motion.div>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
              <motion.div 
                className="flex justify-center items-center py-16"
                variants={itemVariants}
              >
                <div className="card p-16 text-center max-w-lg w-full">
                  <div className="flex justify-center mb-6">
                    <Search className="h-16 w-16 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">No users found</h2>
                  <p className="text-gray-600 mb-8">Try adjusting your filters or search terms.</p>
                  <motion.button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setRoleFilter('all');
                    }}
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Filters
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="card overflow-hidden"
                variants={itemVariants}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orders
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {filteredUsers.slice(
                          (currentPage - 1) * usersPerPage,
                          currentPage * usersPerPage
                        ).map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getRoleBadge(user.role)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(user.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{new Date(user.lastLogin).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.orders}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  onClick={() => handleEdit(user)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Edit className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <motion.div 
                className="card p-6 mt-6"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </p>
                  <div className="flex space-x-2">
                    <motion.button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="card p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </h2>
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="input"
                    >
                      <option value="user">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="input"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                    <motion.button
                      type="submit"
                      className="btn-primary flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {editingUser ? 'Update User' : 'Create User'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn-outline flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default UsersManagement;

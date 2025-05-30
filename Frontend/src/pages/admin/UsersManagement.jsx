import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Edit, Trash2, ArrowUpDown, Plus, Users, UserCheck, UserX, Shield, Eye } from 'lucide-react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      createUser({ ...formData, password: 'defaultPassword123' }); // You might want to handle password differently
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
  return (
    <motion.div 
      className="min-h-screen bg-black"
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
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <motion.div 
            className="flex justify-center items-center py-16"
            variants={itemVariants}
          >
            <div className="bg-white p-16 text-center max-w-lg w-full">
              <div className="flex justify-center mb-6">
                <Search className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-black font-mono uppercase mb-4">No users found</h2>
              <p className="text-gray-700 mb-8 font-mono">Try adjusting your filters or search terms.</p>
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRoleFilter('all');
                }}
                className="bg-violet-600 hover:bg-violet-700 text-white py-3 px-8 font-mono uppercase text-lg tracking-wide transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <motion.div 
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
              variants={itemVariants}
            >
          <div>            <h1 className="text-4xl font-bold text-white flex items-center gap-3 font-mono uppercase tracking-widest">
              <Users className="h-8 w-8 text-white" />
              [ USERS ]
            </h1>
            <p className="text-white/80 mt-2 font-mono">Manage and monitor all user accounts</p>
          </div>          <motion.button
            onClick={handleAddNew}
            className="bg-white text-black border-2 border-white px-6 py-3 hover:bg-black hover:text-white transition-all duration-200 flex items-center gap-2 font-mono uppercase tracking-wide"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="h-5 w-5" />
            Add User
          </motion.button>
        </motion.div>        {/* Filters and Search */}
        <motion.div 
          className="bg-black border-2 border-white p-6 mb-8"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-5 w-5" />
              <input
                type="text"
                placeholder="SEARCH USERS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 font-mono uppercase"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 font-mono uppercase"
            >
              <option value="all">ALL STATUS</option>
              <option value="Active">ACTIVE</option>
              <option value="Inactive">INACTIVE</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 font-mono uppercase"
            >
              <option value="all">ALL ROLES</option>
              <option value="Customer">CUSTOMER</option>
              <option value="Admin">ADMIN</option>
            </select>            <motion.button
              onClick={() => handleSort('name')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-black border-2 border-white hover:bg-black hover:text-white transition-all duration-200 font-mono uppercase"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowUpDown className="h-4 w-4" />
              SORT BY {sortBy.toUpperCase()}
            </motion.button>
          </div>
        </motion.div>        {/* Users Table */}
        <motion.div 
          className="bg-black border-2 border-white overflow-hidden"
          variants={itemVariants}
        >
          <div className="p-6 border-b-2 border-white">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-widest">
              <Users className="h-5 w-5 text-white" />
              All Users ({filteredUsers.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">              <thead>
                <tr className="border-b border-white">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider font-mono">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider font-mono">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider font-mono">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider font-mono">Last Login</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider font-mono">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider font-mono">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>                  {filteredUsers.slice(
                    (currentPage - 1) * usersPerPage,
                    currentPage * usersPerPage
                  ).map((user, index) => (                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-white border-b border-white/30"
                      whileHover={{ scale: 1.01 }}
                    >                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 border-2 border-white group-hover:border-black flex items-center justify-center text-white group-hover:text-black font-mono font-semibold">
                              {user.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-white group-hover:text-black font-mono uppercase">{user.name}</div>
                            <div className="text-sm text-white/70 group-hover:text-black/70 font-mono">{user.email}</div>
                          </div>
                        </div>
                      </td>                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-mono uppercase border ${
                          user.role === 'Admin' 
                            ? 'bg-black text-white border-white group-hover:bg-white group-hover:text-black group-hover:border-black' 
                            : 'bg-white text-black border-white group-hover:bg-black group-hover:text-white group-hover:border-black'
                        }`}>
                          {user.role === 'Admin' ? <Shield className="h-3 w-3 mr-1" /> : <UserCheck className="h-3 w-3 mr-1" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-mono uppercase border ${
                          user.status === 'Active' 
                            ? 'bg-white text-black border-white group-hover:bg-black group-hover:text-white group-hover:border-black' 
                            : 'bg-black text-white border-white group-hover:bg-white group-hover:text-black group-hover:border-black'
                        }`}>
                          {user.status === 'Active' ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80 group-hover:text-black/80 font-mono">{user.lastLogin}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-white group-hover:text-black font-mono">{user.orders}</span>
                      </td>                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-white group-hover:text-black hover:bg-white hover:text-black border border-white group-hover:border-black transition-all duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>                          <motion.button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-white group-hover:text-black hover:bg-white hover:text-black border border-white group-hover:border-black transition-all duration-200"
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
            </table>          </div>          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t-2 border-white bg-black">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/80 font-mono uppercase">
                  Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
                </p>
                <div className="flex space-x-1">
                  {/* pagination buttons with enhanced styling */}
                  <motion.button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 text-sm font-medium text-black bg-white border-2 border-white hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 uppercase font-mono"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 text-sm font-medium text-black bg-white border-2 border-white hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 uppercase font-mono"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Add/Edit User Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >              <motion.div
                className="bg-black border-2 border-white w-full max-w-md p-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-widest font-mono">
                  {editingUser ? '[ EDIT USER ]' : '[ ADD USER ]'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-mono uppercase text-white mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white font-mono"
                      placeholder="ENTER NAME..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-mono uppercase text-white mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white font-mono"
                      placeholder="ENTER EMAIL..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-mono uppercase text-white mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white font-mono uppercase"
                    >
                      <option value="user">USER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </div>
                  
                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-mono uppercase text-white mb-2">Password</label>
                      <input
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white font-mono"
                        placeholder="ENTER PASSWORD..."
                        required={!editingUser}
                      />
                    </div>
                  )}
                </form>

                <div className="flex justify-end space-x-3 mt-6">
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-white bg-black border border-white hover:bg-white hover:text-black transition-all uppercase font-mono"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-white text-black border-2 border-white hover:bg-black hover:text-white transition-all duration-200 uppercase font-mono"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}        </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default UsersManagement;

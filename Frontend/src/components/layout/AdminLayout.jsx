import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Package, ShoppingBag, Users, Settings, LogOut, Menu, X, ChevronDown, BarChart3, Sparkles, IndianRupee, MapPin, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };  const navigationItems = [
    { to: '/admin', icon: BarChart3, label: 'Dashboard', exact: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/cod-management', icon: IndianRupee, label: 'COD Management' },
    { to: '/admin/pincode-management', icon: MapPin, label: 'Pincode Management' },
    { to: '/admin/gst-management', icon: FileText, label: 'GST Management' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div 
        className="hidden lg:flex lg:flex-shrink-0"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-900">
            {/* Sidebar header */}
            <motion.div 
              className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-800"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <BarChart3 className="h-8 w-8 text-white mr-2" />
                <span className="text-xl font-bold text-white">SastaKart</span>
              </motion.div>
            </motion.div>

            {/* Navigation */}
            <nav className="mt-5 flex-1 flex flex-col divide-y divide-gray-800 overflow-y-auto">
              <div className="px-2 space-y-1">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.to}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={menuItemVariants}
                    >
                      <NavLink
                        to={item.to}
                        end={item.exact}
                        className={({ isActive }) =>
                          `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            isActive
                              ? 'bg-gray-700 text-white shadow-lg'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`
                        }
                      >
                        <Icon 
                          className={`mr-3 flex-shrink-0 h-6 w-6 transition-transform duration-200 group-hover:scale-110`}
                          aria-hidden="true"
                        />
                        {item.label}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </div>
            </nav>

            {/* User info and logout */}
            <motion.div 
              className="flex-shrink-0 flex bg-gray-700 p-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center w-full">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=6366f1&color=fff`}
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                    Administrator
                  </p>
                </div>
                <motion.button
                  onClick={handleLogout}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LogOut className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 flex z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeSidebar}
              />

              <motion.div
                className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900"
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={closeSidebar}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <BarChart3 className="h-8 w-8 text-white mr-2" />
                    <span className="text-xl font-bold text-white">SastaKart</span>
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.exact}
                          className={({ isActive }) =>
                            `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                              isActive
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`
                          }
                          onClick={closeSidebar}
                        >
                          <Icon className="mr-4 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                          {item.label}
                        </NavLink>
                      );
                    })}
                  </nav>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <motion.div 
          className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <div className="w-full flex lg:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    {/* Search icon placeholder */}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center lg:ml-6">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=6366f1&color=fff`}
                    alt=""
                  />
                  <span className="ml-2 text-gray-700 hidden lg:block">
                    {user?.firstName} {user?.lastName}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

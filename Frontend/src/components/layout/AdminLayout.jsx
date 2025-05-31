import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Package, ShoppingBag, Users, Settings, LogOut, Menu, X, ChevronDown, BarChart3, Sparkles } from 'lucide-react';
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
  };

  const navigationItems = [
    { to: '/admin', icon: BarChart3, label: 'Dashboard', exact: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-40 lg:hidden bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200
          lg:relative lg:z-0
        `}
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        initial={false}
        style={{ display: sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'none' }}
      >        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
          <motion.h1 
            className="text-xl font-bold text-gray-900 flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            Admin Panel
          </motion.h1><motion.button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white hover:text-black transition-all border border-white p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-6 w-6" />
          </motion.button>
        </div>

        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.to}
                custom={index}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  to={item.to}
                  end={item.exact}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium border-2 transition-all duration-200 group uppercase tracking-wide ${
                      isActive
                        ? 'bg-white text-black border-white'
                        : 'text-white border-white hover:bg-white hover:text-black'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <motion.div 
                      className="flex items-center w-full"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-black' : 'text-white group-hover:text-black'}`} />
                      {item.label}
                    </motion.div>
                  )}
                </NavLink>
              </motion.div>
            ))}          </nav>

          {/* User section */}
          <div className="p-4 border-t-2 border-white">
            <div className="flex items-center px-4 py-3 bg-black border-2 border-white">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 border-2 border-white flex items-center justify-center text-white font-mono font-semibold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-white uppercase truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-white/80 truncate font-mono">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center px-4 py-3 text-sm font-medium border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-200 group uppercase tracking-wide"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="mr-3 h-5 w-5 group-hover:text-black" />
              Sign out
            </motion.button>
          </div>
        </div>
      </motion.div>      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <motion.header 
          className="bg-black border-b-2 border-white lg:hidden"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <motion.button
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:bg-white hover:text-black transition-all border border-white p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="h-6 w-6" />
            </motion.button>
            <h1 className="text-lg font-semibold text-white tracking-widest uppercase">[ ADMIN ]</h1>
            <div></div>
          </div>
        </motion.header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
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

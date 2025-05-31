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

  return (<div className="flex min-h-screen bg-gray-50">

    <div className="flex-1 flex flex-col overflow-hidden">


      {/* Page content */}
      <main className="flex-1 mt-10 overflow-auto">
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

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiBox, FiShoppingBag, FiUsers, FiSettings, FiMenu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { BiBarChart, BiDollarCircle } from 'react-icons/bi';

// Admin Dashboard Components
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [collapsedSections, setCollapsedSections] = useState({});
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const toggleCollapsedSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Dashboard data - in a real app, this would come from API
  const dashboardData = {
    stats: [
      { id: 1, title: 'Total Sales', value: '$12,540', change: '+12.5%', period: 'from last month' },
      { id: 2, title: 'Total Orders', value: '324', change: '+8.2%', period: 'from last month' },
      { id: 3, title: 'New Customers', value: '56', change: '+15.3%', period: 'from last month' },
      { id: 4, title: 'Avg. Order Value', value: '$98.25', change: '+2.7%', period: 'from last month' },
    ],
    recentOrders: [
      { id: '1001', customer: 'John Doe', date: '2025-05-20', total: '$145.99', status: 'Delivered' },
      { id: '1002', customer: 'Sarah Smith', date: '2025-05-19', total: '$89.50', status: 'Processing' },
      { id: '1003', customer: 'Michael Brown', date: '2025-05-18', total: '$210.75', status: 'Shipped' },
      { id: '1004', customer: 'Emily Johnson', date: '2025-05-17', total: '$65.25', status: 'Delivered' },
      { id: '1005', customer: 'Robert Wilson', date: '2025-05-16', total: '$120.00', status: 'Processing' },
    ],
    topProducts: [
      { id: 1, name: 'Wireless Headphones', sales: 52, revenue: '$10,348' },
      { id: 2, name: 'Smart Watch', sales: 43, revenue: '$8,560' },
      { id: 3, name: 'Fitness Tracker', sales: 38, revenue: '$5,700' },
      { id: 4, name: 'Bluetooth Speaker', sales: 32, revenue: '$4,800' },
      { id: 5, name: 'Laptop Backpack', sales: 27, revenue: '$2,700' },
    ]
  };
  
  // Sidebar navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome size={20} />, url: '/admin' },
    { id: 'products', label: 'Products', icon: <FiBox size={20} />, url: '/admin/products' },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag size={20} />, url: '/admin/orders' },
    { id: 'customers', label: 'Customers', icon: <FiUsers size={20} />, url: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: <FiSettings size={20} />, url: '/admin/settings' },
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-black text-white fixed inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'w-64' : 'w-0 md:w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
            <div className={`flex items-center ${!isSidebarOpen && 'md:hidden'}`}>
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
            
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-800"
              onClick={toggleSidebar}
            >
              <FiX size={24} />
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.url}
                    className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                      activeSection === item.id
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className={!isSidebarOpen ? 'md:hidden' : ''}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-800">
            <div className={`flex items-center ${!isSidebarOpen && 'md:hidden'}`}>
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-gray-400">admin@example.com</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                onClick={toggleSidebar}
              >
                <FiMenu size={24} />
              </button>
              <h1 className="ml-4 text-lg font-semibold">Dashboard</h1>
            </div>
            
            <div className="flex items-center">
              {/* Notifications, profile, etc. would go here */}
              <Link 
                to="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View Store
              </Link>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="container mx-auto">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {dashboardData.stats.map((stat) => (
                <div key={stat.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{stat.period}</p>
                </div>
              ))}
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Sales Overview</h2>
                  <select className="text-sm border rounded px-2 py-1">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <div className="text-gray-500 flex flex-col items-center">
                    <BiBarChart size={48} />
                    <p className="mt-2">Sales Chart (Placeholder)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Revenue by Category</h2>
                  <select className="text-sm border rounded px-2 py-1">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <div className="text-gray-500 flex flex-col items-center">
                    <BiDollarCircle size={48} />
                    <p className="mt-2">Revenue Chart (Placeholder)</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Orders & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Recent Orders</h2>
                    <Link 
                      to="/admin/orders"
                      className="text-sm text-black hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : order.status === 'Shipped' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Top Selling Products</h2>
                    <Link 
                      to="/admin/products" 
                      className="text-sm text-black hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sales
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.topProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.sales} units
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.revenue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

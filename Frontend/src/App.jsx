import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/layout/AdminLayout'

// Public Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Wishlist from './pages/Wishlist'

// Protected User Pages
import Profile from './pages/profile/Profile'
import Orders from './pages/profile/Orders'

// Admin Pages
import Dashboard from './pages/admin/Dashboard'
import ProductsManagement from './pages/admin/ProductsManagement'
import ProductForm from './pages/admin/ProductForm'
import OrdersManagement from './pages/admin/OrdersManagement'
import OrderDetail from './pages/admin/OrderDetail'
import UsersManagement from './pages/admin/UsersManagement'
import CODManagement from './pages/admin/CODManagement'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const { loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black"></div>
      </div>
    )
  }  
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      {/* Only show Navbar on non-admin routes */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Navbar />} />
      </Routes>

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}          
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected User Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order-success" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />          
          <Route path="/profile/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/profile/orders/:id" element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          } />

          {/* Admin Routes - Note the proper nesting */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} /> {/* Fixed the edit route */}
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="cod-management" element={<CODManagement />} />
          </Route>
        </Routes>
      </main>

      {/* Only show Footer on non-admin routes */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
    </div>
  )
}

export default App

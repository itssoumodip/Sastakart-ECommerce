import { Routes, Route, Outlet, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/layout/AdminLayout'
import PageLayout from './components/layout/PageLayout'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'

import Profile from './pages/profile/Profile'
import Orders from './pages/profile/Orders'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'

import Dashboard from './pages/admin/Dashboard'
import ProductsManagement from './pages/admin/ProductsManagement'
import ProductForm from './pages/admin/ProductForm'
import OrdersManagement from './pages/admin/OrdersManagement'
import OrderDetail from './pages/admin/OrderDetail'
import UsersManagement from './pages/admin/UsersManagement'
import CODManagement from './pages/admin/CODManagement'

import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import ScrollToTop from './components/ScrollToTop'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {
  const { loading } = useAuth()
  if (loading) {
    return <LoadingSpinner size="lg" label="Loading..." fullScreen />
  }

  return (
    <Routes>
      {/* Admin Routes - Separate layout without main Navbar/Footer */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="cod" element={<CODManagement />} />
        </Route>
      </Route>

      {/* Non-Admin Routes - With main Navbar/Footer */}
      <Route
        element={
          <div className="min-h-screen flex flex-col bg-white">
            <ScrollToTop />
            <Navbar />
            <PageLayout>
              <main className="flex-grow">
                <Outlet />
              </main>
            </PageLayout>
            <Footer />
          </div>
        }
      >
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<Orders />} />
          <Route path="/profile/orders/:id" element={<Orders />} />
        </Route>

        {/* Catch-all route for handling 404s */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Link
                to="/"
                className="px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Back to Home
              </Link>
            </div>
          }
        />
      </Route>
    </Routes>
  )
}

export default App

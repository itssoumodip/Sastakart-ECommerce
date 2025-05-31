import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { 
  Eye, 
  EyeOff
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import googleIcon from '../../assets/google-icon.svg'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const watchedEmail = watch('email')

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const result = await login(data.email, data.password)
      if (result.success) {
        toast.success('Welcome back! 🎉')
        navigate(from, { replace: true })
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Sign In - EcoShop</title>
        <meta name="description" content="Sign in to your account to access your orders, wishlist, and account settings." />
      </Helmet>

      <div className="min-h-screen flex lg:flex-row flex-col bg-white">
        {/* Left Panel - Hero Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" 
            alt="Fashion model" 
            className="object-cover h-full w-full"
          />
        </div>
          
        {/* Right Panel - Login Form */}
        <div className="lg:w-1/2 w-full flex flex-col justify-center items-center p-8 lg:p-12">
          <div className="w-full max-w-md">            {/* Logo */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-800">ClassyShop</h1>
            </div>
            
            {/* Form Title */}
            <h2 className="text-3xl font-medium mb-8">Sign In To ClassyShop</h2>
            
            {/* Social Login Buttons */}
            <div className="flex gap-4 mb-6">
              <button 
                className="flex-1 border border-gray-300 rounded-md py-3 flex justify-center items-center gap-2 hover:bg-gray-50 transition-all"
              >
                <img src={googleIcon} alt="Google" className="w-5 h-5" />
                <span className="text-sm">Sign up with Google</span>
              </button>
              
              <button 
                className="flex-1 border border-gray-300 rounded-md py-3 flex justify-center items-center gap-2 hover:bg-gray-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.617 0 3.101.554 4.286 1.474l3.637-3.47C17.766 1.154 15.052 0 12 0 7.392 0 3.397 2.6 1.386 6.296l4.026 3.112C6.343 6.866 8.949 5 12 5z"/>
                  <path fill="#4285F4" d="M23.896 13.502C23.96 12.882 24 12.271 24 11.5c0-.445-.017-.883-.05-1.311H12v4.845h6.703a5.904 5.904 0 0 1-2.55 3.843l3.925 3.035C22.061 19.857 23.897 17.015 23.896 13.502z"/>
                  <path fill="#FBBC05" d="M5.412 14.184C5.16 13.35 5 12.448 5 11.5c0-.948.16-1.85.412-2.684L1.386 6.296A11.955 11.955 0 0 0 0 11.5c0 1.863.43 3.622 1.169 5.204l4.243-2.52z"/>
                  <path fill="#34A853" d="M12 24c3.052 0 5.766-1.154 7.923-3.001l-3.992-3.092a7.502 7.502 0 0 1-11.731-2.203l-4.243 2.52C2.38 21.39 6.309 24 12 24z"/>
                </svg>
                <span className="text-sm">Sign up with Email</span>
              </button>
            </div>
            
            {/* OR Divider */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-gray-500 text-sm">OR</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            
            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email"
                  className={`w-full px-4 py-3 rounded border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className={`w-full px-4 py-3 rounded border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long',
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
              
              {/* Registration Link */}
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forget Password?
                </Link>
                
                {/* Create Account Link */}
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline">Register Now</Link>
                  </span>
                </div>
                
                {/* Terms & Conditions */}                <div className="mt-6 text-right">
                  <Link to="/terms" className="text-xs text-gray-500">
                    ClassyShop Terms & Conditions
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { 
  Eye, 
  EyeOff
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import googleIcon from '../../assets/google-icon.svg'
import { toastConfig, formatToastMessage } from '../../utils/toastConfig'
import { GoogleLogin } from '@react-oauth/google'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser, googleLogin, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const watchedPassword = watch('password')
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate]);
  
  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const result = await registerUser(
        data.firstName, 
        data.lastName, 
        data.email, 
        data.phone, 
        data.password
      );      
      if (result.success) {
        toast.success('Account created successfully! Welcome to SastaKart', toastConfig.success)
        navigate('/')
      }
    } catch (error) {
      toast.error(formatToastMessage(error?.message) || 'Registration failed. Please try again.', toastConfig.error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Create Account - SastaKart</title>
        <meta name="description" content="Create your account to start shopping and enjoy exclusive deals and personalized recommendations." />
      </Helmet>

      <div className="min-h-screen bg-white flex lg:flex-row flex-col">
        {/* Left Panel - Hero Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1713693210081-e89bfe711df6?w=2800&h=1800&fit=crop&crop=entropy&auto=format
" 
            alt="Fashion model" 
            className="object-cover h-full w-full"
          />
        </div>
        
        {/* Right Panel - Register Form */}
        <div className="lg:w-1/2 w-full flex flex-col justify-center items-center p-8 lg:p-12">
          <div className="w-full max-w-md">            {/* Logo */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-medium text-gray-800">Create Account</h1>
            </div>
            
            {/* Social Login Buttons */}
            <div className="flex gap-4 mb-6">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    console.log('Google login success:', credentialResponse);
                    setIsLoading(true);
                    try {
                      const result = await googleLogin(credentialResponse);
                      if (result.success) {
                        toast.success('Account created successfully! Welcome to SastaKart', toastConfig.success);
                        navigate('/');
                      }
                    } catch (error) {
                      console.error('Google sign up error:', error);
                      toast.error('Google sign up failed. Please try again.', toastConfig.error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  onError={(error) => {
                    console.error('Google login error:', error);
                    toast.error('Google sign up failed. Please try again.', toastConfig.error);
                  }}
                  useOneTap
                  text="signup_with"
                  shape="rectangular"
                  width="300"
                />
              </div>
            </div>
            
            {/* OR Divider */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-gray-500 text-sm">OR</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            
            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="First Name"
                    className={`w-full px-4 py-3 rounded border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    {...register('firstName', {
                      required: 'First name is required',
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Last Name"
                    className={`w-full px-4 py-3 rounded border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    {...register('lastName', {
                      required: 'Last name is required',
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              {/* Email Field */}
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email Address"
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
              
              {/* Phone Number */}
              <div className="space-y-2">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className={`w-full px-4 py-3 rounded border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                  {...register('phone', {
                    required: 'Phone number is required',
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
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
              
              {/* Confirm Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className={`w-full px-4 py-3 rounded border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === watchedPassword || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Create Account Button */}
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
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
              
              {/* Login Link */}
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Already have an account? <Link to="/login" className="text-black font-medium hover:text-gray-600 hover:underline">Login</Link>
                </span>
                
                {/* Terms & Conditions */}                <div className="mt-6 text-right">
                  <Link to="/#" className="text-xs text-gray-500">
                    SastaKart Terms & Conditions
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

export default Register

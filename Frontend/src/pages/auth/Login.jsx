import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Shield, 
  User,
  Sparkles,
  Check
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

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
    formState: { errors, isSubmitting },
    watch
  } = useForm()

  const watchedEmail = watch('email')
  const watchedPassword = watch('password')

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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white border-t-white/20 rounded-none animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="mt-4 text-white font-mono uppercase tracking-wider">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Login - RETRO-SHOP</title>
        <meta name="description" content="Sign in to your account to access your orders, wishlist, and account settings." />
      </Helmet>

      <div className="min-h-screen flex lg:flex-row flex-col bg-black">
        {/* Left Panel - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden border-r-4 border-white">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.05)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.05)_50%,_rgba(255,255,255,0.05)_75%,_transparent_75%,_transparent)] bg-[length:10px_10px]"></div>
          
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center text-white">
            <div className="space-y-12">
              <div className="w-32 h-32 border-4 border-white mx-auto">
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16" />
                </div>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl font-mono font-bold leading-tight uppercase tracking-widest">
                  WELCOME TO
                  <span className="block mt-4">
                    [ RETRO-SHOP ]
                  </span>
                </h1>
                <p className="text-xl text-white font-mono">
                  ACCESS YOUR VINTAGE DIGITAL EXPERIENCE
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 mt-8">
                <div className="border-4 border-white p-6 hover:bg-white hover:text-black transition-colors">
                  <div className="flex items-center space-x-4">
                    <Shield className="w-8 h-8" />
                    <div>
                      <h3 className="font-mono font-bold uppercase tracking-wider">SECURE ACCESS</h3>
                      <p className="text-sm font-mono">PROTECTED USER AUTHENTICATION</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-4 border-white p-6 hover:bg-white hover:text-black transition-colors">
                  <div className="flex items-center space-x-4">
                    <Sparkles className="w-8 h-8" />
                    <div>
                      <h3 className="font-mono font-bold uppercase tracking-wider">MEMBER BENEFITS</h3>
                      <p className="text-sm font-mono">EXCLUSIVE DEALS & EARLY ACCESS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-black">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <div className="bg-black border-4 border-white p-10 space-y-8">
              {/* Header */}
              <div className="text-center space-y-6">
                <div className="w-20 h-20 border-4 border-white flex items-center justify-center mx-auto hover:bg-white hover:text-black transition-colors">
                  <span className="text-white hover:text-black font-mono text-3xl font-bold">R</span>
                </div>
                
                <div>
                  <h2 className="text-4xl font-mono font-bold text-white uppercase tracking-widest">
                    [ LOGIN ]
                  </h2>
                  <p className="text-white font-mono mt-2 uppercase text-lg tracking-wide">
                    ACCESS YOUR ACCOUNT
                  </p>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-base font-mono font-semibold text-white mb-2 uppercase tracking-widest">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address'
                          }
                        })}
                        className="bg-black text-white border-4 border-white focus:ring-0 focus:border-white pl-14 w-full h-14 font-mono text-lg uppercase"
                        placeholder="ENTER YOUR EMAIL"
                      />
                      {watchedEmail && !errors.email && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <Check className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm font-mono text-white border border-white p-2 uppercase">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-base font-mono font-semibold text-white mb-2 uppercase tracking-widest">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        className="bg-black text-white border-4 border-white focus:ring-0 focus:border-white pl-14 pr-14 w-full h-14 font-mono text-lg uppercase"
                        placeholder="ENTER YOUR PASSWORD"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-6 w-6 text-white" />
                        ) : (
                          <Eye className="h-6 w-6 text-white" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm font-mono text-white border border-white p-2 uppercase">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 bg-black border-2 border-white focus:ring-0 text-white"
                    />
                    <span className="ml-2 text-white font-mono uppercase text-sm tracking-wider">
                      Remember me
                    </span>
                  </label>
                  <Link to="/forgot-password" className="text-white hover:text-gray-300 font-mono uppercase text-sm tracking-wider border-b-2 border-transparent hover:border-white pb-1 transition-all">
                    Forgot password?
                  </Link>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 flex items-center justify-center bg-white text-black border-4 border-white hover:bg-black hover:text-white transition-colors font-mono uppercase text-lg tracking-widest font-bold"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                        <span>AUTHENTICATING...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>LOGIN</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center">
                <p className="text-white font-mono uppercase text-sm tracking-wider">
                  Don't have an account?{' '}
                  <Link to="/register" className="border-b-2 border-white hover:text-gray-300 font-bold">
                    REGISTER
                  </Link>
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-white font-mono uppercase text-xs tracking-wider">
                © 2025 RETRO-SHOP. ALL RIGHTS RESERVED.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Login
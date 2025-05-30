import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  ArrowRight, 
  Shield, 
  Sparkles,
  Check,
  UserPlus
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm()

  const watchedName = watch('name')
  const watchedEmail = watch('email')
  const watchedPassword = watch('password')
  const watchedConfirmPassword = watch('confirmPassword')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setIsLoading(true)
      const result = await registerUser(data.name, data.email, data.password)
      if (result.success) {
        toast.success('Welcome! Your account has been created 🎉')
        navigate('/', { replace: true })
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
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
        <title>Register - RETRO-SHOP</title>
        <meta name="description" content="Create your account to start shopping and enjoy exclusive deals and personalized recommendations." />
      </Helmet>

      <div className="min-h-screen flex lg:flex-row flex-col bg-black">
        {/* Left Panel - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden border-r-4 border-white">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.05)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.05)_50%,_rgba(255,255,255,0.05)_75%,_transparent_75%,_transparent)] bg-[length:10px_10px]"></div>
          
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center text-white">
            <div className="space-y-12">
              <div className="w-32 h-32 border-4 border-white mx-auto">
                <div className="w-full h-full flex items-center justify-center">
                  <UserPlus className="w-16 h-16" />
                </div>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl font-mono font-bold leading-tight uppercase tracking-widest">
                  JOIN THE
                  <span className="block mt-4">
                    [ RETRO-SHOP ]
                  </span>
                </h1>
                <p className="text-xl text-white font-mono uppercase">
                  CREATE YOUR ACCOUNT TODAY
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 mt-8">
                <div className="border-4 border-white p-6 hover:bg-white hover:text-black transition-colors">
                  <div className="flex items-center space-x-4">
                    <Shield className="w-8 h-8" />
                    <div>
                      <h3 className="font-mono font-bold uppercase tracking-wider">SECURE ACCOUNT</h3>
                      <p className="text-sm font-mono">YOUR DATA IS ALWAYS PROTECTED</p>
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

        {/* Right Panel - Registration Form */}
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
                    [ REGISTER ]
                  </h2>
                  <p className="text-white font-mono mt-2 uppercase text-lg tracking-wide">
                    CREATE AN ACCOUNT
                  </p>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-base font-mono font-semibold text-white mb-2 uppercase tracking-widest">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <input
                        type="text"
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                          }
                        })}
                        className="bg-black text-white border-4 border-white focus:ring-0 focus:border-white pl-14 w-full h-14 font-mono text-lg uppercase"
                        placeholder="ENTER YOUR NAME"
                      />
                      {watchedName && !errors.name && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <Check className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm font-mono text-white border border-white p-2 uppercase">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

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

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-base font-mono font-semibold text-white mb-2 uppercase tracking-widest">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === watchedPassword || 'Passwords do not match'
                        })}
                        className="bg-black text-white border-4 border-white focus:ring-0 focus:border-white pl-14 pr-14 w-full h-14 font-mono text-lg uppercase"
                        placeholder="CONFIRM PASSWORD"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-6 w-6 text-white" />
                        ) : (
                          <Eye className="h-6 w-6 text-white" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm font-mono text-white border border-white p-2 uppercase">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register('terms', { required: 'You must agree to the terms and conditions' })}
                    className="h-5 w-5 bg-black border-2 border-white focus:ring-0 text-white"
                  />
                  <label htmlFor="terms" className="ml-2 text-white font-mono uppercase text-sm tracking-wider">
                    I agree to the <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm font-mono text-white border border-white p-2 uppercase">
                    {errors.terms.message}
                  </p>
                )}

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 flex items-center justify-center bg-white text-black border-4 border-white hover:bg-black hover:text-white transition-colors font-mono uppercase text-lg tracking-widest font-bold"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                        <span>CREATING ACCOUNT...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>CREATE ACCOUNT</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center">
                <p className="text-white font-mono uppercase text-sm tracking-wider">
                  Already have an account?{' '}
                  <Link to="/login" className="border-b-2 border-white hover:text-gray-300 font-bold">
                    LOGIN
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

export default Register

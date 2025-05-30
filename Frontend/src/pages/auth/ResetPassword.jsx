import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { token } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      await axios.put(`/api/auth/password/reset/${token}`, {
        password: data.password,
        confirmPassword: data.confirmPassword
      })
      toast.success('Password reset successfully')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    }
  }

  return (
    <>
      <Helmet>
        <title>Reset Password - RETRO-SHOP</title>
        <meta name="description" content="Create a new password for your account." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <motion.div
          className="max-w-md w-full space-y-8 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex justify-center">
              <motion.div
                className="w-14 h-14 border-2 border-white flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Eye className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-mono font-bold text-white uppercase tracking-widest">
              Reset Password
            </h2>
            <p className="mt-2 text-center text-sm text-white font-mono uppercase tracking-wide">
              Enter your new password below
            </p>
          </div>
          
          <motion.form
            className="mt-8 space-y-6 bg-black border-2 border-white p-8"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-mono font-semibold text-white uppercase tracking-wide">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="bg-black text-white border-2 border-white focus:ring-0 focus:border-white pr-10 w-full h-12 font-mono"
                    placeholder="ENTER NEW PASSWORD"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-white/70 hover:text-white" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/70 hover:text-white" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p className="mt-1 text-sm text-white font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.password.message}</motion.p>
                )}
                <p className="mt-1 text-xs text-white/70 font-mono uppercase tracking-wide">
                  Password must contain uppercase, lowercase, and number
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-mono font-semibold text-white uppercase tracking-wide">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="bg-black text-white border-2 border-white focus:ring-0 focus:border-white pr-10 w-full h-12 font-mono"
                    placeholder="CONFIRM NEW PASSWORD"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-white/70 hover:text-white" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/70 hover:text-white" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p className="mt-1 text-sm text-white font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.confirmPassword.message}</motion.p>
                )}
              </div>
            </div>
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black border-2 border-white w-full py-3 font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'RESETTING...' : 'RESET PASSWORD'}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </>
  )
}

export default ResetPassword

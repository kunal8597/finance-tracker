import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { Shield } from 'lucide-react'
import { Modal } from './ui/Modal'
// import { Alert } from './ui/Alert'

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type AuthFormData = z.infer<typeof authSchema>

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { signIn, signUp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  })

  const onSubmit = async (data: AuthFormData) => {
    setError(null)
    setLoading(true)

    try {
      const result = isSignUp 
        ? await signUp(data.email, data.password)
        : await signIn(data.email, data.password)

      if (result.error) {
        setError(result.error.message)
      } else if (isSignUp) {
        setShowConfirm(true)
      }
  } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] w-full px-4">
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-[#ffffff10] to-[#121212] backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-6 shadow-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-1 text-center">Finance Tracker</h1>
        <h2 className="text-lg font-semibold text-white mb-2 text-center">
          {isSignUp ? 'Create your Finance Tracker account' : 'Sign in to Finance Tracker'}
        </h2>
        <p className="text-center text-xs text-gray-400 mb-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="underline text-white/80 hover:text-white"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder="Email"
              type="email"
              autoComplete="email"
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              {...register('email')}
            />
            {errors.email?.message && (
              <div className="text-sm text-red-400">{errors.email.message}</div>
            )}
            <input
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              {...register('password')}
            />
            {errors.password?.message && (
              <div className="text-sm text-red-400">{errors.password.message}</div>
            )}
            {error && (
              <div className="text-sm text-red-400">{error}</div>
            )}
          </div>
          <hr className="opacity-10" />
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/10 text-white font-medium px-5 py-3 rounded-full shadow hover:bg-white/20 transition text-sm disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>

      
    </div>
    <Modal
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      title="Confirm your email"
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          We just sent a confirmation link to your email. Please confirm your email address to complete your
          Finance Tracker account setup, then return here to sign in.
        </p>
        <button
          onClick={() => setShowConfirm(false)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
        >
          Got it
        </button>
      </div>
    </Modal>
    </>
  )
}
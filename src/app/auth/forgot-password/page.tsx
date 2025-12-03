'use client'

import { useState } from 'react'
import { createClientClient } from '@/lib/supabase'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = createClientClient()
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (resetError) {
        setError(resetError.message || 'Failed to send reset email')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-4 pb-12 bg-neutral-soft">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-subtle border border-metal-gold/20 rounded-2xl p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-normal text-deep-black mb-2">Check your email</h1>
            <p className="text-deep-black/70 mb-6">
              We've sent a password reset link to {email}
            </p>
            <Link
              href="/auth/signin"
              className="text-deep-black font-medium hover:text-metal-gold hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-neutral-soft">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-subtle border border-metal-gold/20 rounded-2xl p-8">
          <h1 className="text-3xl font-serif font-normal text-deep-black mb-2">Reset Password</h1>
          <p className="text-deep-black/70 mb-8">Enter your email to receive a password reset link</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-deep-black/70 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-metal-gold/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-metal-gold focus:border-metal-gold"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-deep-black text-white py-3 px-4 rounded-full font-medium hover:bg-forest-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-deep-black/70 hover:text-metal-gold"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


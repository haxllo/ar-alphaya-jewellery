'use client'

import { useState } from 'react'
import { createClientClient } from '@/lib/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, KeyRound, ArrowLeft } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-amber-mirage-50 via-white to-amber-mirage-soft">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-sm shadow-luxe border border-amber-mirage-200 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-6">
              <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-amber-mirage-brown mb-3">Check your email</h1>
            <p className="text-amber-mirage-600 mb-6">
              We've sent a password reset link to <span className="font-semibold text-amber-mirage-brown">{email}</span>
            </p>
            <Link href="/auth/signin">
              <Button className="bg-amber-mirage-brown hover:bg-amber-mirage-brown/90 text-amber-mirage-soft">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-amber-mirage-50 via-white to-amber-mirage-soft">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-sm shadow-luxe border border-amber-mirage-200 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-mirage-soft mb-4">
              <KeyRound className="w-6 h-6 text-amber-mirage-gold" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-amber-mirage-brown mb-2">Forgot Password</h1>
            <p className="text-amber-mirage-600">Enter your email to receive a reset link</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-amber-mirage-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-mirage-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-amber-mirage-200 focus:border-amber-mirage-gold focus:ring-amber-mirage-gold/30"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-mirage-brown hover:bg-amber-mirage-brown/90 text-amber-mirage-soft py-6 text-base font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link href="/auth/signin" className="inline-flex items-center text-sm text-amber-mirage-600 hover:text-amber-mirage-gold transition-colors font-medium">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


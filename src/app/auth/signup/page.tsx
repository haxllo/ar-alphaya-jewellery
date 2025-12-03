'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientClient } from '@/lib/supabase'
import { Switch } from '@/components/ui/switch'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClientClient()
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message || 'Failed to create account')
        return
      }

      if (data.user) {
        // Redirect to sign in page with success message
        router.push('/auth/signin?message=Account created. Please check your email to verify your account.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-4 pb-12 bg-neutral-soft">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-subtle border border-metal-gold/20 rounded-2xl p-8">
          <h1 className="text-3xl font-serif font-normal text-deep-black mb-2">Create Account</h1>
          <p className="text-deep-black/70 mb-8">Sign up to get started</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-deep-black/70 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-metal-gold/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-metal-gold focus:border-metal-gold"
                placeholder="John Doe"
              />
            </div>

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-deep-black/70 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-metal-gold/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-metal-gold focus:border-metal-gold"
                placeholder="At least 6 characters"
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-deep-black/70 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-metal-gold/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-metal-gold focus:border-metal-gold"
                placeholder="Confirm your password"
                minLength={6}
              />
            </div>

            {/* Terms & Conditions Agreement */}
            <div className="flex items-start gap-3">
              <Switch
                id="terms-agreement"
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
                className="mt-0.5"
              />
              <label htmlFor="terms-agreement" className="text-sm text-deep-black/70 cursor-pointer">
                I agree to the{' '}
                <Link 
                  href="/terms" 
                  target="_blank"
                  className="text-metal-gold hover:text-forest-deep underline"
                >
                  Terms & Conditions
                </Link>
                {' '}and{' '}
                <Link 
                  href="/privacy" 
                  target="_blank"
                  className="text-metal-gold hover:text-forest-deep underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="w-full bg-deep-black text-white py-3 px-4 rounded-full font-medium hover:bg-forest-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-deep-black/70">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-deep-black font-medium hover:text-metal-gold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


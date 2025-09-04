'use client'

import { useState } from 'react'
import { Mail, Check, AlertCircle } from 'lucide-react'
import { NewsletterService } from '@/lib/newsletter'

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'footer'
  className?: string
  onSuccess?: (email: string) => void
  title?: string
  description?: string
}

export default function NewsletterSignup({
  variant = 'inline',
  className = '',
  onSuccess,
  title,
  description
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setErrorMessage('Email address is required')
      setStatus('error')
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await NewsletterService.subscribe(email, undefined, variant)
      
      if (response.success) {
        setStatus('success')
        setEmail('')
        setErrorMessage('')
        onSuccess?.(email)
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setStatus('idle')
        }, 3000)
      } else {
        setStatus('error')
        setErrorMessage(response.message)
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'modal':
        return {
          container: 'bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto',
          title: 'text-2xl font-bold text-gray-900 mb-4 text-center',
          description: 'text-gray-600 mb-6 text-center',
          form: 'space-y-4'
        }
      case 'footer':
        return {
          container: 'bg-gray-900 text-white p-6 rounded-lg',
          title: 'text-xl font-semibold text-white mb-3',
          description: 'text-gray-300 mb-4',
          form: 'space-y-3'
        }
      default: // inline
        return {
          container: 'bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200',
          title: 'text-xl font-semibold text-gray-900 mb-3',
          description: 'text-gray-600 mb-4',
          form: 'space-y-3'
        }
    }
  }

  const styles = getVariantStyles()
  const defaultTitle = variant === 'footer' 
    ? 'Stay Updated' 
    : 'Join Our Newsletter'
  const defaultDescription = variant === 'footer'
    ? 'Get exclusive jewelry offers and style tips delivered to your inbox.'
    : 'Subscribe to receive exclusive offers, new collection updates, and jewelry care tips.'

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="max-w-md mx-auto">
        <h3 className={styles.title}>
          {title || defaultTitle}
        </h3>
        <p className={styles.description}>
          {description || defaultDescription}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className={`h-5 w-5 ${variant === 'footer' ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') {
                  setStatus('idle')
                  setErrorMessage('')
                }
              }}
              placeholder="Enter your email address"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
                variant === 'footer'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } ${status === 'error' ? 'border-red-500' : ''}`}
              disabled={status === 'loading' || status === 'success'}
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <Check className="w-4 h-4" />
              <span>Successfully subscribed! Welcome to our newsletter.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success' || !email.trim()}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${
              variant === 'footer'
                ? 'bg-white text-gray-900 hover:bg-gray-100 focus:ring-white disabled:bg-gray-700 disabled:text-gray-400'
                : 'bg-black text-white hover:bg-gray-800 focus:ring-black disabled:bg-gray-400'
            } ${status === 'success' ? 'bg-green-600 hover:bg-green-600' : ''}`}
          >
            {status === 'loading' && (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </span>
            )}
            {status === 'success' && (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Subscribed!
              </span>
            )}
            {(status === 'idle' || status === 'error') && 'Subscribe'}
          </button>
        </form>

        <p className={`text-xs mt-3 ${variant === 'footer' ? 'text-gray-400' : 'text-gray-500'}`}>
          By subscribing, you agree to receive marketing emails from AR Alphaya Jewellery. 
          You can unsubscribe at any time. View our{' '}
          <a href="/privacy" className={`underline ${variant === 'footer' ? 'text-gray-300' : 'text-gray-600'}`}>
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  )
}

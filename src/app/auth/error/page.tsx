'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')
  const details = searchParams.get('details')
  
  // Parse details if available
  let errorDetails = null
  if (details) {
    try {
      errorDetails = JSON.parse(details)
    } catch (e) {
      errorDetails = details
    }
  }

  const getErrorMessage = (error: string | null, message: string | null) => {
    if (message) {
      switch (message) {
        case 'authentication_failed':
          return {
            title: 'Authentication Failed',
            description: 'We encountered an issue during the authentication process. Please try signing in again.',
          }
        default:
          return {
            title: 'Authentication Error',
            description: message.replace(/_/g, ' '),
          }
      }
    }

    if (error) {
      switch (error) {
        case 'access_denied':
          return {
            title: 'Access Denied',
            description: 'You denied access to the application. If this was a mistake, please try signing in again.',
          }
        case 'server_error':
          return {
            title: 'Server Error',
            description: 'We encountered a server error during authentication. Please try again later.',
          }
        case 'temporarily_unavailable':
          return {
            title: 'Service Temporarily Unavailable',
            description: 'The authentication service is temporarily unavailable. Please try again in a few moments.',
          }
        default:
          return {
            title: 'Authentication Error',
            description: 'An unexpected error occurred during authentication.',
          }
      }
    }

    return {
      title: 'Authentication Error',
      description: 'An unexpected error occurred during authentication.',
    }
  }

  const errorInfo = getErrorMessage(error, message)

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {errorInfo.title}
          </h1>
          
          <p className="text-gray-600 mb-4">
            {errorInfo.description}
          </p>
          
          {errorDetails && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-left">
              <p className="text-xs font-mono text-gray-700">
                <strong>Error Details:</strong>
              </p>
              <pre className="text-xs text-gray-600 mt-2 overflow-auto">
                {typeof errorDetails === 'object' 
                  ? JSON.stringify(errorDetails, null, 2)
                  : String(errorDetails)}
              </pre>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link
            href="/api/auth/login"
            prefetch={false}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Signing In Again
          </Link>
          
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If the problem persists, please{' '}
            <Link href="/contact" className="text-black hover:underline">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}

'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // Optionally report to monitoring
  }, [error])

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <div className="mb-6">
        <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 3a9 9 0 100 18 9 9 0 000-18z" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-gray-600 mb-6">An unexpected error occurred. Please try again.</p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Try again
      </button>
    </div>
  )
}

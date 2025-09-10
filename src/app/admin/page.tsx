'use client'

import { useEffect } from 'react'

export default function AdminRedirect() {
  useEffect(() => {
    // Redirect to the Decap CMS interface
    window.location.href = '/admin/index.html'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Admin Panel</h2>
        <p className="text-gray-600">Redirecting to Content Management System...</p>
      </div>
    </div>
  )
}

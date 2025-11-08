'use client'

import { useEffect } from 'react'

export default function AdminPage() {
  useEffect(() => {
    // Redirect to products management
    window.location.href = '/admin/products'
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p>Loading admin panel...</p>
      </div>
    </div>
  )
}



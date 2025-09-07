'use client'

import { useEffect } from 'react'
import { ArrowRight, Upload } from 'lucide-react'

export default function AdminRedirectPage() {
  useEffect(() => {
    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = '/admin-upload'
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-primary-100">
          <div className="mb-6">
            <Upload className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              AR Alphaya Jewellery
            </h1>
            <h2 className="text-lg text-gray-700">Product Management</h2>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Redirecting you to the product upload system...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="/admin-upload"
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Go to Upload Form
              <ArrowRight className="h-4 w-4" />
            </a>
            
            <a
              href="/admin-instructions"
              className="w-full flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 py-2 text-sm transition-colors"
            >
              View Instructions
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact support at aralphayajewellery@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

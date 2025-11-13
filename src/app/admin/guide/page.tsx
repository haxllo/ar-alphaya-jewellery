'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/products"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Products</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Portal Guide</h1>
                <p className="mt-1 text-sm text-gray-500">Instructions for managing your jewellery store</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Notion Guide */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe 
            src="https://stupendous-seatbelt-b9d.notion.site/ebd/2aa5424a2b2780af9c28eefa90f933fa?v=2aa5424a2b2780f3ab57000c2c40ddd3" 
            className="w-full border-0"
            style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}
            allowFullScreen
            title="Admin Portal Guide"
          />
        </div>
        
        {/* Quick Tips Section */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📸 Image Tips</h3>
            <p className="text-sm text-blue-800">Use 1200x1200px images with white background for best results</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">💡 Quick Actions</h3>
            <p className="text-sm text-green-800">Hold Shift to select multiple products for bulk operations</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">🔐 Security</h3>
            <p className="text-sm text-purple-800">Always log out when finished on shared computers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Package, ArrowLeft } from 'lucide-react'

export default function OrdersPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-semibold text-gray-900">Your Orders</h1>
      </div>
      
      {/* Empty state - in a real app, this would show actual orders */}
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        
        <h2 className="text-xl font-medium text-gray-900 mb-4">No orders yet</h2>
        <p className="text-gray-600 mb-8">
          When you place your first order, it will appear here.
        </p>
        
        <Link 
          href="/" 
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
      
      {/* In a real implementation, you would show order history here */}
      <div className="hidden">
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900">Order #12345</h3>
                <p className="text-sm text-gray-600">Placed on January 15, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">Rs 250,000</p>
                <p className="text-sm text-green-600">Delivered</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded mr-4"></div>
              <div>
                <p className="font-medium text-gray-900">Blue Sapphire Ring</p>
                <p className="text-sm text-gray-600">Quantity: 1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

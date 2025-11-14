import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle2, Package, Mail, ArrowRight } from 'lucide-react'

function SuccessContent() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">What happens next?</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Order Confirmation Email</h3>
              <p className="text-sm text-gray-600">
                We've sent a confirmation email with your order details and receipt.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Order Processing</h3>
              <p className="text-sm text-gray-600">
                Your order is being prepared and will be shipped within 2-3 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Track your order:</strong> You can track your order status by visiting your account page or checking your email for updates.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/account/orders"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          View Order Details
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-900 transition-colors"
        >
          Continue Shopping
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need help? <Link href="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

export const metadata = {
  title: 'Order Successful - AR Alphaya Jewellery',
  description: 'Your order has been successfully placed',
}

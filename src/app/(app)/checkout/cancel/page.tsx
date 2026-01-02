import Link from 'next/link'
import { XCircle, ArrowLeft, HelpCircle, ShoppingCart } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
          <XCircle className="w-10 h-10 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600">Your payment was not completed</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">What happened?</h2>
        <p className="text-gray-600 mb-4">
          Your payment was cancelled before completion. This could happen if:
        </p>
        <ul className="space-y-2 text-sm text-gray-600 ml-6">
          <li className="list-disc">You clicked the cancel button during payment</li>
          <li className="list-disc">You closed the payment window</li>
          <li className="list-disc">The payment session timed out</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm text-blue-900 mb-1">Don't worry!</h3>
            <p className="text-sm text-blue-800">
              Your items are still in your cart. You can complete your purchase anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/cart"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <ShoppingCart className="mr-2 w-4 h-4" />
          View Cart
        </Link>
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-900 transition-colors"
        >
          Try Again
        </Link>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Having trouble? <Link href="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Payment Cancelled - AR Alphaya Jewellery',
  description: 'Your payment was cancelled',
}

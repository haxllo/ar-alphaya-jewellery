import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 text-center">
      <div className="bg-yellow-50 p-8 rounded-lg">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-semibold text-yellow-800 mb-4">Payment Cancelled</h1>
        <p className="text-yellow-700 mb-6">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        <p className="text-sm text-yellow-600 mb-8">
          Your items are still in your cart. You can try again or contact us for assistance.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout" className="bg-black text-white px-6 py-2 rounded hover:bg-neutral-800">
            Try Again
          </Link>
          <Link href="/cart" className="border border-black px-6 py-2 rounded hover:bg-neutral-50">
            View Cart
          </Link>
          <Link href="/contact" className="text-neutral-600 hover:text-black">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4 text-gray-900">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        
        <div className="space-x-4">
          <Link 
            href="/" 
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return Home
          </Link>
          <Link 
            href="/collections/rings" 
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Browse Jewelry
          </Link>
        </div>
      </div>
    </main>
  )
}

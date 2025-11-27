'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user
  const isLoading = status === 'loading'
  const error = status === 'unauthenticated' ? new Error('Not authenticated') : null

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/profile')
    }
  }, [status, router])

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-mirage-50 via-white to-amber-mirage-soft">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-mirage-gold"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-mirage-50 via-white to-amber-mirage-soft">
      <div className="text-center">
        <h1 className="text-2xl font-serif font-bold text-red-600 mb-4">Error</h1>
        <p className="text-amber-mirage-600">{error.message}</p>
        <Link 
          href="/" 
          className="mt-4 inline-block bg-amber-mirage-brown text-amber-mirage-soft px-6 py-2 rounded-lg hover:bg-amber-mirage-brown/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-mirage-50 via-white to-amber-mirage-soft">
      <div className="text-center">
        <h1 className="text-2xl font-serif font-bold text-amber-mirage-brown mb-4">Authentication Disabled</h1>
        <p className="text-amber-mirage-600 mb-6">Authentication is temporarily disabled. Please check back later.</p>
        <Link 
          href="/" 
          className="bg-amber-mirage-brown text-amber-mirage-soft px-6 py-2 rounded-lg hover:bg-amber-mirage-brown/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 min-h-screen bg-gradient-to-br from-amber-mirage-50 via-white to-amber-mirage-soft">
      <div className="bg-white/90 backdrop-blur-sm shadow-luxe border border-amber-mirage-200 rounded-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-amber-mirage-soft to-amber-mirage-50 px-6 py-8 border-b border-amber-mirage-200">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Profile'}
                  width={96}
                  height={96}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                  loading="lazy"
                  className="h-24 w-24 rounded-full object-cover border-4 border-amber-mirage-gold shadow-luxe"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-amber-mirage-100 flex items-center justify-center border-4 border-amber-mirage-gold shadow-luxe">
                  <svg className="h-12 w-12 text-amber-mirage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-amber-mirage-brown">{user.name || 'User Profile'}</h1>
              <p className="text-lg text-amber-mirage-700">{user.email}</p>
              {(user as any).emailVerified && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-6 py-6">
          <h2 className="text-xl font-serif font-semibold text-amber-mirage-brown mb-6">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-amber-mirage-700 mb-1">Full Name</label>
              <div className="p-3 bg-amber-mirage-50 border border-amber-mirage-200 rounded-lg text-amber-mirage-800">
                {user.name || 'Not provided'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-mirage-700 mb-1">Email Address</label>
              <div className="p-3 bg-amber-mirage-50 border border-amber-mirage-200 rounded-lg text-amber-mirage-800">
                {user.email || 'Not provided'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-mirage-700 mb-1">User ID</label>
              <div className="p-3 bg-amber-mirage-50 border border-amber-mirage-200 rounded-lg font-mono text-xs text-amber-mirage-700">
                {user.id || user.email}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-mirage-700 mb-1">Email Verified</label>
              <div className="p-3 bg-amber-mirage-50 border border-amber-mirage-200 rounded-lg text-amber-mirage-800">
                {(user as any).emailVerified ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-6 bg-amber-mirage-50/50 border-t border-amber-mirage-200">
          <h2 className="text-xl font-serif font-semibold text-amber-mirage-brown mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/orders"
              className="flex items-center p-4 bg-white border border-amber-mirage-200 rounded-lg hover:border-amber-mirage-gold hover:shadow-amber transition-all group"
            >
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-amber-mirage-400 group-hover:text-amber-mirage-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-amber-mirage-brown">My Orders</h3>
                <p className="text-sm text-amber-mirage-600">View order history</p>
              </div>
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center p-4 bg-white border border-amber-mirage-200 rounded-lg hover:border-amber-mirage-gold hover:shadow-amber transition-all group"
            >
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-amber-mirage-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-amber-mirage-brown">Wishlist</h3>
                <p className="text-sm text-amber-mirage-600">Saved items</p>
              </div>
            </Link>

            <Link
              href="/cart"
              className="flex items-center p-4 bg-white border border-amber-mirage-200 rounded-lg hover:border-amber-mirage-gold hover:shadow-amber transition-all group"
            >
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-amber-mirage-400 group-hover:text-amber-mirage-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-amber-mirage-brown">Shopping Cart</h3>
                <p className="text-sm text-amber-mirage-600">Items to purchase</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Account Actions */}
        <div className="px-6 py-6 border-t border-amber-mirage-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-serif font-medium text-amber-mirage-brown">Account Settings</h3>
              <p className="text-sm text-amber-mirage-600 mt-1">
                Manage your account preferences and security settings
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
              <button
                onClick={async () => {
                  try {
                    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
                    await signOut({ 
                      callbackUrl: `${baseUrl}/`,
                      redirect: true 
                    })
                  } catch (error) {
                    console.error('Sign out error:', error)
                    // Fallback redirect
                    router.push('/')
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 transition-all"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage

'use client'

import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import Image from 'next/image'

function ProfilePage() {
  // Temporarily disable Auth0 until properly configured
  // const { user, error, isLoading } = useUser()
  const user = null
  const error = null
  const isLoading = false

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error.message}</p>
        <Link 
          href="/" 
          className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Disabled</h1>
        <p className="text-gray-600 mb-6">Authentication is temporarily disabled. Please check back later.</p>
        <Link 
          href="/" 
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gray-50 px-6 py-8 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {user.picture ? (
                <Image
                  src={user.picture}
                  alt={user.name || 'Profile'}
                  width={96}
                  height={96}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                  loading="lazy"
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-sm"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-sm">
                  <svg className="h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name || 'User Profile'}</h1>
              <p className="text-lg text-gray-600">{user.email}</p>
              {user.email_verified && (
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                {user.name || 'Not provided'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                {user.email || 'Not provided'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs">
                {user.sub}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Not available'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/orders"
              className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">My Orders</h3>
                <p className="text-sm text-gray-500">View order history</p>
              </div>
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Wishlist</h3>
                <p className="text-sm text-gray-500">Saved items</p>
              </div>
            </Link>

            <Link
              href="/cart"
              className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Shopping Cart</h3>
                <p className="text-sm text-gray-500">Items to purchase</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Account Actions */}
        <div className="px-6 py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage your account preferences and security settings
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
              <Link
                href="/api/auth/logout"
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'
import SizeGuideModal from '@/components/product/SizeGuideModal'
import CurrencySelector from '@/components/ui/CurrencySelector'

const collections = [
  { handle: 'rings', title: 'Rings' },
  { handle: 'earrings', title: 'Earrings' },
  { handle: 'pendants', title: 'Pendants' },
  { handle: 'bracelets-bangles', title: 'Bracelets & Bangles' },
]

export default function Header() {
  const { user, error, isLoading } = useUser()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const items = useCartStore((state) => state.items)
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = useWishlistStore((state) => state.getItemCount())

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/images/LOGO1.png" 
              alt="AR Alphaya Jewellery Logo" 
              width={40} 
              height={40}
              priority
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
            <span className="font-serif text-base md:text-lg font-semibold text-black">AR Alphaya</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm text-gray-700 hover:text-black transition-colors">Home</Link>
            <div className="relative group">
              <button className="text-sm text-gray-700 hover:text-black transition-colors flex items-center">
                Jewelry
                <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all rounded-md">
                {collections.map((collection) => (
                  <Link
                    key={collection.handle}
                    href={`/collections/${collection.handle}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors first:rounded-t-md last:rounded-b-md"
                  >
                    {collection.title}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about" className="text-sm text-gray-700 hover:text-black transition-colors">About</Link>
            <button
              onClick={() => setShowSizeGuide(true)}
              className="text-sm text-gray-700 hover:text-black transition-colors"
            >
              Size Guide
            </button>
            <Link href="/contact" className="text-sm text-gray-700 hover:text-black transition-colors">Contact</Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jewelry..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </form>
          </div>

          {/* Currency, Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Currency Selector - Desktop */}
            <div className="hidden md:block">
              <CurrencySelector compact={true} showLabel={false} />
            </div>
            
            {/* Wishlist */}
            <Link href="/wishlist" className="relative text-gray-700 hover:text-black transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {/* Authentication */}
            {isLoading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
            ) : user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {user.picture ? (
                      <Image 
                        src={user.picture} 
                        alt={user.name || 'User'} 
                        width={32}
                        height={32}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                        loading="lazy"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <span className="hidden md:inline">{user.name || user.email}</span>
                  <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all rounded-md z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors first:rounded-t-md"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/api/auth/logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors last:rounded-b-md"
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                href="/api/auth/login"
                className="relative text-gray-700 hover:text-black transition-colors p-2"
                title="Sign In"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            
            <Link href="/cart" className="relative text-gray-700 hover:text-black transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 hover:text-black transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            {/* Currency Selector - Mobile */}
            <div className="mb-4 px-4 border-b border-gray-100 pb-4">
              <div className="text-sm font-medium mb-2 text-black">Currency</div>
              <CurrencySelector compact={true} showLabel={false} className="w-full" />
            </div>

            {/* Search Bar - Mobile */}
            <div className="mb-4 px-4 border-b border-gray-100 pb-4">
              <div className="text-sm font-medium mb-2 text-black">Search</div>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jewelry..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>
            </div>
            
            <nav className="space-y-4">
              <Link href="/" className="block text-sm text-gray-700 hover:text-black transition-colors">Home</Link>
              <div>
                <div className="text-sm font-medium mb-2 text-black">Jewelry</div>
                <div className="pl-4 space-y-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.handle}
                      href={`/collections/${collection.handle}`}
                      className="block text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      {collection.title}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/about" className="block text-sm text-gray-700 hover:text-black transition-colors">About</Link>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="block text-sm text-gray-700 hover:text-black transition-colors text-left"
              >
                Size Guide
              </button>
              <Link href="/contact" className="block text-sm text-gray-700 hover:text-black transition-colors">Contact</Link>
              <Link href="/wishlist" className="block text-sm text-gray-700 hover:text-black transition-colors">
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              
              {/* Mobile Authentication */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 animate-pulse bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        {user.picture ? (
                          <Image 
                            src={user.picture} 
                            alt={user.name || 'User'} 
                            width={32}
                            height={32}
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                            loading="lazy"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-black">{user.name || user.email}</span>
                    </div>
                    <Link href="/profile" className="block text-sm text-gray-700 hover:text-black transition-colors pl-4">
                      My Profile
                    </Link>
                    <Link href="/orders" className="block text-sm text-gray-700 hover:text-black transition-colors pl-4">
                      My Orders
                    </Link>
                    <Link href="/api/auth/logout" className="block text-sm text-gray-700 hover:text-black transition-colors pl-4">
                      Sign Out
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Link
                      href="/api/auth/login"
                      className="flex items-center gap-2 text-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </header>
  )
}

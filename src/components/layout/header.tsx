'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'

const collections = [
  { handle: 'rings', title: 'Rings' },
  { handle: 'earrings', title: 'Earrings' },
  { handle: 'pendants', title: 'Pendants' },
  { handle: 'bracelets-bangles', title: 'Bracelets & Bangles' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const items = useCartStore((state) => state.items)
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

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
            <Link href="/contact" className="text-sm text-gray-700 hover:text-black transition-colors">Contact</Link>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
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
              <Link href="/contact" className="block text-sm text-gray-700 hover:text-black transition-colors">Contact</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

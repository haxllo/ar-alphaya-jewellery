'use client'

import Link from 'next/link'
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
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AA</span>
            </div>
            <span className="font-serif text-lg font-semibold">AR Alphaya</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm hover:text-neutral-600">Home</Link>
            <div className="relative group">
              <button className="text-sm hover:text-neutral-600 flex items-center">
                Jewelry
                <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {collections.map((collection) => (
                  <Link
                    key={collection.handle}
                    href={`/collections/${collection.handle}`}
                    className="block px-4 py-2 text-sm hover:bg-neutral-50"
                  >
                    {collection.title}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about" className="text-sm hover:text-neutral-600">About</Link>
            <Link href="/contact" className="text-sm hover:text-neutral-600">Contact</Link>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative">
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
              className="md:hidden"
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
          <div className="md:hidden py-4 border-t">
            <nav className="space-y-4">
              <Link href="/" className="block text-sm hover:text-neutral-600">Home</Link>
              <div>
                <div className="text-sm font-medium mb-2">Jewelry</div>
                <div className="pl-4 space-y-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.handle}
                      href={`/collections/${collection.handle}`}
                      className="block text-sm text-neutral-600 hover:text-neutral-800"
                    >
                      {collection.title}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/about" className="block text-sm hover:text-neutral-600">About</Link>
              <Link href="/contact" className="block text-sm hover:text-neutral-600">Contact</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

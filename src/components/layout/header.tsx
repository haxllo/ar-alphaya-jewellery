'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'
import dynamic from 'next/dynamic'
import { useCurrency } from '@/hooks/useCurrency'

// Lazy load heavy components to improve TTI
const SizeGuideModal = dynamic(() => import('@/components/ui/SizeGuideModal'), { ssr: false })
const CurrencySelector = dynamic(() => import('@/components/ui/CurrencySelector'), { ssr: false })
const SearchSuggestions = dynamic(() => import('@/components/search/SearchSuggestions'), { ssr: false })

const collections = [
  { handle: 'rings', title: 'Rings' },
  { handle: 'earrings', title: 'Earrings' },
  { handle: 'pendants', title: 'Pendants' },
  { handle: 'bracelets-bangles', title: 'Bracelets & Bangles' },
]

export default function Header() {
  const { user, error, isLoading } = useAuth()
  
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Array<{ name: string; slug: string; price: number }>>([])
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const { formatPrice } = useCurrency()
  const [highlighted, setHighlighted] = useState<number>(-1)
  const cartItems = useCartStore((state) => state.items)
  const wishlistItems = useWishlistStore((state) => state.items)
  const cartCount = hasMounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0
  const wishlistCount = hasMounted ? wishlistItems.length : 0

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowSearch(false)
      setSuggestions([])
    }
  }

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setSuggestions([])
      setHighlighted(-1)
      return
    }
    try {
      setLoadingSuggest(true)
      const params = new URLSearchParams({ q, limit: '5', sortBy: 'createdAt', sortOrder: 'desc' })
      const res = await fetch(`/api/search?${params.toString()}`)
      if (!res.ok) throw new Error('search failed')
      const data = await res.json()
      const prods = data?.data?.products || []
      setSuggestions(prods.map((p: any) => ({ name: p.name, slug: p.slug, price: p.price })))
      setHighlighted(-1)
    } catch {
      setSuggestions([])
    } finally {
      setLoadingSuggest(false)
    }
  }, [])

  // Debounce suggestions
  useEffect(() => {
    if (!showSearch) return
    const id = setTimeout(() => fetchSuggestions(searchQuery.trim()), 200)
    return () => clearTimeout(id)
  }, [searchQuery, showSearch, fetchSuggestions])

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/80 backdrop-blur-xl supports-backdrop:bg-white/70 shadow-[0_1px_0_rgba(18,18,18,0.08)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 gap-6">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/images/LOGO1.png" 
              alt="AR Alphaya Jewellery Logo" 
              width={40} 
              height={40}
              priority
              className="h-10 w-10 md:h-12 md:w-12 object-contain"
            />
            <div className="leading-tight">
              <span className="font-serif text-[0.7rem] md:text-sm uppercase tracking-[0.85em] text-nocturne-900">AR ALPHAYA</span>
              <span className="mt-1 block text-[0.55rem] tracking-[0.55em] uppercase text-nocturne-500">JEWELLERY</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-nocturne-600 hover:text-foreground transition-colors">Home</Link>
            <Link href="/#process" className="text-sm font-medium text-nocturne-600 hover:text-foreground transition-colors">Custom Commissions</Link>
            <div className="relative group">
              <button 
                className="flex items-center text-sm font-medium text-nocturne-600 hover:text-foreground transition-colors"
                aria-label="Collections menu"
                aria-expanded="false"
                aria-haspopup="true"
              >
                Collections
                <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-3 w-56 rounded-xl border border-border/60 bg-white/95 shadow-luxe backdrop-blur transition-all opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                {collections.map((collection) => (
                  <Link
                    key={collection.handle}
                    href={`/collections/${collection.handle}`}
                    className="block px-4 py-3 text-sm font-medium text-nocturne-600 hover:bg-gold-50/70 hover:text-foreground transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    {collection.title}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about" className="text-sm font-medium text-nocturne-600 hover:text-foreground transition-colors">About</Link>
            <Link href="/contact" className="text-sm font-medium text-nocturne-600 hover:text-foreground transition-colors">Contact</Link>
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center justify-end gap-3 md:gap-5">

            {/* Currency Selector - Desktop */}
            {/* TEMPORARILY DISABLED - See README.md for re-enabling instructions */}
            {/* <div className="hidden md:block">
              <CurrencySelector compact={true} showLabel={false} />
            </div> */}

            {/* Wishlist */}
            <Link href="/wishlist" className="relative rounded-full border border-transparent p-2 text-nocturne-600 transition-colors hover:border-border/80 hover:text-foreground" aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ''}`}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-nocturne-900 text-xs font-medium text-white" aria-hidden="true">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Search Icon with Dropdown - Desktop */}
            <div className="relative hidden md:block">
              <button
                type="button"
                aria-label="Search products"
                aria-expanded={showSearch}
                className="relative rounded-full border border-transparent p-2 text-nocturne-600 transition-colors hover:border-border/80 hover:text-foreground"
                onClick={() => setShowSearch((v) => !v)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
              {showSearch && (
                <div className="absolute right-0 top-full z-50 mt-3 w-80 rounded-2xl border border-border/70 bg-white/95 p-3 shadow-subtle backdrop-blur">
                  <form
                    onSubmit={handleSearch}
                    onKeyDown={(e) => {
                      if (suggestions.length === 0) return
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setHighlighted((h) => (h + 1) % suggestions.length)
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        setHighlighted((h) => (h <= 0 ? suggestions.length - 1 : h - 1))
                      } else if (e.key === 'Enter' && highlighted >= 0) {
                        e.preventDefault()
                        const s = suggestions[highlighted]
                        router.push(`/products/${s.slug}`)
                        setShowSearch(false)
                        setSuggestions([])
                        setHighlighted(-1)
                      }
                    }}
                  >
                    <div className="relative">
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search jewelry..."
                        className="w-full rounded-xl border border-border/70 bg-white/70 py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-nocturne-400 focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold-300/60"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-nocturne-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </form>
                  {/* Autocomplete suggestions */}
                  {(loadingSuggest || suggestions.length > 0) && (
                    <div className="mt-3 max-h-64 overflow-y-auto border-t border-border/60 pt-3">
                      {loadingSuggest && (
                        <div className="px-2 py-2 text-xs text-nocturne-500">Searching…</div>
                      )}
                      {suggestions.map((s, idx) => (
                        <Link
                          key={s.slug}
                          href={`/products/${s.slug}`}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${highlighted === idx ? 'bg-gold-50/80 text-foreground' : 'text-nocturne-600 hover:bg-white/80 hover:text-foreground'}`}
                          onMouseEnter={() => setHighlighted(idx)}
                          onClick={() => setShowSearch(false)}
                        >
                          <span className="truncate mr-2">{s.name}</span>
                          <span className="whitespace-nowrap text-xs text-nocturne-400">{formatPrice(s.price)}</span>
                        </Link>
                      ))}
                      {!loadingSuggest && suggestions.length === 0 && searchQuery.length >= 2 && (
                        <div className="px-2 py-2 text-xs text-nocturne-500">No results</div>
                      )}
                      {!loadingSuggest && suggestions.length > 0 && (
                        <button
                          className="mt-2 w-full px-2 py-1 text-left text-xs font-medium text-nocturne-500 underline-offset-4 hover:text-foreground"
                          onClick={() => {
                            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                            setShowSearch(false)
                            setSuggestions([])
                            setHighlighted(-1)
                          }}
                          aria-label={`View all results for ${searchQuery}`}
                        >
                          View all results for &ldquo;{searchQuery}&rdquo;
                        </button>
                      )}
                      <SearchSuggestions
                        query={searchQuery}
                        onSelect={(suggestion) => {
                          setSearchQuery(suggestion)
                          router.push(`/search?q=${encodeURIComponent(suggestion)}`)
                          setShowSearch(false)
                          setSuggestions([])
                        }}
                        onClose={() => setShowSearch(false)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Authentication */}
            {isLoading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
            ) : user ? (
              <div className="relative user-dropdown-container">
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 rounded-full border border-transparent p-2 text-nocturne-600 transition-colors hover:border-border/80 hover:text-foreground"
                  aria-label="User account menu"
                  aria-expanded={showUserDropdown}
                  aria-haspopup="true"
                >
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    {(user as any)?.picture ? (
                      <Image 
                        src={(user as any).picture} 
                        alt={(user as any).name || 'User'} 
                        width={24}
                        height={24}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                        loading="lazy"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                  </div>
                </button>
                {showUserDropdown && (
                  <div className="absolute top-full right-0 z-50 mt-3 w-56 rounded-xl border border-border/70 bg-white shadow-luxe backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      href="/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="block px-5 py-3 text-sm font-medium text-nocturne-600 transition-colors first:rounded-t-xl hover:bg-gold-50/70 hover:text-foreground"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Profile</span>
                      </div>
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setShowUserDropdown(false)}
                      className="block px-5 py-3 text-sm font-medium text-nocturne-600 transition-colors hover:bg-gold-50/70 hover:text-foreground"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>My Orders</span>
                      </div>
                    </Link>
                    <div className="border-t border-border/50"></div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full text-left px-5 py-3 text-sm font-medium text-red-600 transition-colors last:rounded-b-xl hover:bg-red-50 hover:text-red-700"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/signin"
                className="relative rounded-full border border-transparent p-2 text-nocturne-600 transition-colors hover:border-border/80 hover:text-foreground"
                aria-label="Sign in to your account"
                title="Sign In"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
            )}
            
            <Link href="/cart" className="relative rounded-full border border-transparent p-2 text-nocturne-600 transition-colors hover:border-border/80 hover:text-foreground" aria-label={`Shopping cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-white" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden rounded-full border border-transparent p-2 text-nocturne-600 transition-colors hover:border-border/80 hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16M4 12h16M4 18h16" />
              </svg>
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/70 bg-white/95 px-6 py-6 backdrop-blur md:hidden">
            {/* Currency Selector - Mobile */}
            {/* TEMPORARILY DISABLED - See README.md for re-enabling instructions */}
            {/* <div className="mb-6 border-b border-border/60 pb-6">
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-nocturne-500">Currency</div>
              <CurrencySelector compact={true} showLabel={false} className="w-full" />
            </div> */}

            {/* Search Bar - Mobile */}
            <div className="mb-6 border-b border-border/60 pb-6">
              <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-nocturne-500">Search</div>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jewelry..."
                    className="w-full rounded-xl border border-border/70 bg-white/80 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-nocturne-400 focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-200/70"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-nocturne-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>
            </div>
            
            <nav className="space-y-5">
              <Link href="/" className="block text-sm font-medium text-nocturne-600 transition-colors hover:text-foreground">Home</Link>
              <Link href="/#process" className="block text-sm font-medium text-nocturne-600 transition-colors hover:text-foreground">Custom Commissions</Link>
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-nocturne-500">Collections</div>
                <div className="mt-3 pl-4 space-y-3">
                  {collections.map((collection) => (
                    <Link
                      key={collection.handle}
                      href={`/collections/${collection.handle}`}
                      className="block text-sm font-medium text-nocturne-500 transition-colors hover:text-foreground"
                    >
                      {collection.title}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/about" className="block text-sm font-medium text-nocturne-600 transition-colors hover:text-foreground">About</Link>
              <Link href="/contact" className="block text-sm font-medium text-nocturne-600 transition-colors hover:text-foreground">Contact</Link>
              <Link href="/wishlist" className="block text-sm font-medium text-nocturne-600 transition-colors hover:text-foreground">
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <Link href="/policies" className="block text-sm font-medium text-nocturne-600 transition-colors hover:text-foreground">Policies</Link>
              
              {/* Mobile Authentication */}
              <div className="mt-6 border-t border-border/60 pt-6">
                {isLoading ? (
                  <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gold-50/30">
                    <div className="w-8 h-8 animate-pulse bg-nocturne-200 rounded-full"></div>
                    <div className="h-4 bg-nocturne-200 rounded w-32 animate-pulse"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-50/30 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-nocturne-100 flex items-center justify-center flex-shrink-0">
                        {(user as any)?.picture ? (
                          <Image 
                            src={(user as any).picture} 
                            alt={(user as any).name || 'User'} 
                            width={40}
                            height={40}
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-5 h-5 text-nocturne-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-nocturne-900 truncate">{(user as any)?.name || 'My Account'}</div>
                        <div className="text-xs text-nocturne-500 truncate">{(user as any)?.email}</div>
                      </div>
                    </div>
                    <Link 
                      href="/profile" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-nocturne-700 transition-colors hover:bg-gold-50/50 rounded-lg"
                    >
                      <svg className="w-5 h-5 text-nocturne-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      My Profile
                    </Link>
                    <Link 
                      href="/orders" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-nocturne-700 transition-colors hover:bg-gold-50/50 rounded-lg"
                    >
                      <svg className="w-5 h-5 text-nocturne-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      My Orders
                    </Link>
                    <div className="border-t border-border/40 my-2"></div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 rounded-lg w-full text-left"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/auth/signin"
                    className="flex items-center justify-center gap-3 w-full rounded-xl bg-foreground px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
        </div>
      )}
      
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </header>
  )
}









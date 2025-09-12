'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SearchFilters, Product } from '@/lib/cms'
import SearchFiltersComponent from '@/components/search/SearchFilters'
import ProductGrid from '@/components/search/ProductGrid'
import SearchPagination from '@/components/search/SearchPagination'
import { useCurrency } from '@/hooks/useCurrency'

interface SearchResult {
  products: Product[]
  pagination: {
    total: number
    page: number
    totalPages: number
    limit: number
  }
  filters: {
    categories: string[]
    materials: string[]
    tags: string[]
    priceRange: { min: number; max: number }
  }
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { formatPrice } = useCurrency()
  
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    materials: searchParams.get('materials')?.split(',').filter(Boolean) || undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : searchParams.get('inStock') === 'false' ? false : undefined,
    featured: searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined,
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
    limit: 20,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    sortBy: (searchParams.get('sortBy') as 'name' | 'price' | 'createdAt') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  })

  const performSearch = useCallback(async (searchFilters: SearchFilters) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      
      // Add all non-undefined filters to URL params
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.set(key, value.join(','))
            }
          } else {
            params.set(key, String(value))
          }
        }
      })

      const response = await fetch(`/api/search?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setSearchResult(data.data)
      } else {
        throw new Error(data.error || 'Search failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 } // Reset to page 1 when filters change
    setFilters(updatedFilters)
    
    // Update URL
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','))
          }
        } else {
          params.set(key, String(value))
        }
      }
    })
    
    router.push(`/search?${params.toString()}`, { scroll: false })
  }, [filters, router])

  const handlePageChange = useCallback((page: number) => {
    const updatedFilters = { ...filters, page }
    setFilters(updatedFilters)
    
    // Update URL
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','))
          }
        } else {
          params.set(key, String(value))
        }
      }
    })
    
    router.push(`/search?${params.toString()}`, { scroll: false })
  }, [filters, router])

  // Perform search when filters change
  useEffect(() => {
    performSearch(filters)
  }, [filters, performSearch])

  if (loading && !searchResult) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Searching products...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Search Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => performSearch(filters)}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  if (!searchResult) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">No Results Found</h1>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
          <Link
            href="/"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  const { products, pagination, filters: availableFilters } = searchResult

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-black mb-2">
          {filters.query ? `Search Results for "${filters.query}"` : 'All Products'}
        </h1>
        <p className="text-gray-600">
          {pagination.total} {pagination.total === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFiltersComponent
            filters={filters}
            availableFilters={availableFilters}
            onFiltersChange={updateFilters}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <SearchPagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">No products found</h2>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all products
              </p>
              <button
                onClick={() => updateFilters({})}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      </main>
    }>
      <SearchContent />
    </Suspense>
  )
}

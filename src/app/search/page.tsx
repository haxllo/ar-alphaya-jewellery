'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter, ReadonlyURLSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SearchFilters, Product } from '@/lib/cms'
import SearchFiltersComponent from '@/components/search/SearchFilters'
import ProductGrid from '@/components/search/ProductGrid'
import SearchPagination from '@/components/search/SearchPagination'
import AdvancedSorting from '@/components/search/AdvancedSorting'
import ProductGridSkeleton from '@/components/ui/skeletons/ProductGridSkeleton'
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
  
  // Helper to parse filters from URL params
  const parseFiltersFromParams = useCallback((params: ReadonlyURLSearchParams | null): SearchFilters => {
    if (!params) return { limit: 20, page: 1, sortBy: 'createdAt', sortOrder: 'desc' }
    
    return {
      query: params.get('q') || '',
      category: params.get('category') || undefined,
      minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      materials: params.get('materials')?.split(',').filter(Boolean) || undefined,
      inStock: params.get('inStock') === 'true' ? true : params.get('inStock') === 'false' ? false : undefined,
      featured: params.get('featured') === 'true' ? true : params.get('featured') === 'false' ? false : undefined,
      tags: params.get('tags')?.split(',').filter(Boolean) || undefined,
      limit: 20,
      page: params.get('page') ? Number(params.get('page')) : 1,
      sortBy: (params.get('sortBy') as 'name' | 'price' | 'createdAt') || 'createdAt',
      sortOrder: (params.get('sortOrder') as 'asc' | 'desc') || 'desc'
    }
  }, [])

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Derived state from URL params - Single Source of Truth
  const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams, parseFiltersFromParams])

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
    // Merge new filters with current derived filters
    const updatedFilters = { ...filters, ...newFilters, page: 1 } // Reset to page 1 when filters change
    
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

  // Perform search when filters change (URL changes)
  useEffect(() => {
    performSearch(filters)
  }, [filters, performSearch])

  if (loading && !searchResult) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="lg:col-span-3">
            <ProductGridSkeleton count={12} />
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

        {/* Active Filter Chips */}
        <ActiveFilterChips filters={filters} onChange={updateFilters} />
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
          {products.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-primary-600">
                {searchResult.pagination.total} products found
              </div>
              <AdvancedSorting
                sortBy={filters.sortBy ?? 'createdAt'}
                sortOrder={(filters.sortOrder as 'asc' | 'desc') ?? 'desc'}
                onSortChange={(sortBy, sortOrder) => updateFilters({ sortBy, sortOrder })}
              />
            </div>
          )}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
              <p className="text-gray-600 mb-6">
                {filters.query ? (
                  <>No results for "{filters.query}". Try different keywords or remove some filters.</>
                ) : (
                  <>Try adjusting your filters or browse popular collections.</>
                )}
              </p>

              <div className="flex flex-col items-center gap-3 mb-8">
                <button
                  onClick={() => updateFilters({ query: '', category: undefined, minPrice: undefined, maxPrice: undefined, materials: undefined, inStock: undefined, featured: undefined, tags: undefined })}
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => updateFilters({ query: '', page: 1 })}
                  className="text-sm text-gray-700 hover:text-black underline"
                >
                  Reset search
                </button>
              </div>

              <div className="max-w-xl mx-auto">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Popular collections</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {(['rings','earrings','pendants','bracelets-bangles'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => updateFilters({ category: c })}
                      className="px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 capitalize"
                    >
                      {c.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function ActiveFilterChips({
  filters,
  onChange
}: {
  filters: SearchFilters
  onChange: (partial: Partial<SearchFilters>) => void
}) {
  const chips: Array<{ label: string; onClear: () => void }> = []

  if (filters.query) chips.push({ label: `Query: ${filters.query}`, onClear: () => onChange({ query: '' }) })
  if (filters.category) chips.push({ label: `Category: ${filters.category.replace('-', ' ')}`, onClear: () => onChange({ category: undefined }) })
  if (filters.minPrice !== undefined) chips.push({ label: `Min: ${filters.minPrice}`, onClear: () => onChange({ minPrice: undefined }) })
  if (filters.maxPrice !== undefined) chips.push({ label: `Max: ${filters.maxPrice}`, onClear: () => onChange({ maxPrice: undefined }) })
  if (filters.materials && filters.materials.length > 0) filters.materials.forEach((m, i) => chips.push({ label: `Material: ${m}`, onClear: () => onChange({ materials: filters.materials!.filter((_, idx) => idx !== i) }) }))
  if (filters.tags && filters.tags.length > 0) filters.tags.forEach((t, i) => chips.push({ label: `Tag: ${t}`, onClear: () => onChange({ tags: filters.tags!.filter((_, idx) => idx !== i) }) }))
  if (filters.inStock !== undefined) chips.push({ label: filters.inStock ? 'In stock' : 'Out of stock', onClear: () => onChange({ inStock: undefined }) })
  if (filters.featured !== undefined) chips.push({ label: filters.featured ? 'Featured' : 'Not featured', onClear: () => onChange({ featured: undefined }) })

  if (chips.length === 0) return null

  const clearAll = () => onChange({
    query: '',
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    materials: undefined,
    inStock: undefined,
    featured: undefined,
    tags: undefined,
  })

  return (
    <div className="mt-3 flex flex-wrap gap-2 items-center">
      {chips.map((chip, idx) => (
        <button
          key={idx}
          onClick={chip.onClear}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <span>{chip.label}</span>
          <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
      <button
        onClick={clearAll}
        className="ml-2 text-sm text-gray-600 hover:text-black underline"
      >
        Clear all
      </button>
    </div>
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

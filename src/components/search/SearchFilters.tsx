'use client'

import { useState } from 'react'
import { SearchFilters } from '@/lib/cms'
import { useCurrency } from '@/hooks/useCurrency'

interface SearchFiltersComponentProps {
  filters: SearchFilters
  availableFilters: {
    categories: string[]
    materials: string[]
    tags: string[]
    priceRange: { min: number; max: number }
  }
  onFiltersChange: (filters: Partial<SearchFilters>) => void
}

export default function SearchFiltersComponent({
  filters,
  availableFilters,
  onFiltersChange
}: SearchFiltersComponentProps) {
  const { formatPrice } = useCurrency()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['category', 'price']))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ category: category === filters.category ? undefined : category })
  }

  const handleMaterialChange = (material: string) => {
    const currentMaterials = filters.materials || []
    const newMaterials = currentMaterials.includes(material)
      ? currentMaterials.filter(m => m !== material)
      : [...currentMaterials, material]
    
    onFiltersChange({ materials: newMaterials.length > 0 ? newMaterials : undefined })
  }

  const handleTagChange = (tag: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    
    onFiltersChange({ tags: newTags.length > 0 ? newTags : undefined })
  }

  const handlePriceChange = (minPrice?: number, maxPrice?: number) => {
    onFiltersChange({ 
      minPrice: minPrice || undefined, 
      maxPrice: maxPrice || undefined 
    })
  }

  const handleSortChange = (sortBy: 'name' | 'price' | 'createdAt', sortOrder: 'asc' | 'desc') => {
    onFiltersChange({ sortBy, sortOrder })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      query: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      materials: undefined,
      inStock: undefined,
      featured: undefined,
      tags: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = !!(
    filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    (filters.materials && filters.materials.length > 0) ||
    filters.inStock !== undefined ||
    filters.featured !== undefined ||
    (filters.tags && filters.tags.length > 0)
  )

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-black">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Category
            <span className={`transform transition-transform ${expandedSections.has('category') ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {expandedSections.has('category') && (
            <div className="space-y-2">
              {availableFilters.categories.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-3 text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {category.replace('-', ' & ')}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Price Range
            <span className={`transform transition-transform ${expandedSections.has('price') ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {expandedSections.has('price') && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min</label>
                  <input
                    type="number"
                    value={filters.minPrice || ''}
                    onChange={(e) => handlePriceChange(
                      e.target.value ? Number(e.target.value) : undefined,
                      filters.maxPrice
                    )}
                    placeholder={formatPrice(availableFilters.priceRange.min)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max</label>
                  <input
                    type="number"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handlePriceChange(
                      filters.minPrice,
                      e.target.value ? Number(e.target.value) : undefined
                    )}
                    placeholder={formatPrice(availableFilters.priceRange.max)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-black focus:border-black"
                  />
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Range: {formatPrice(availableFilters.priceRange.min)} - {formatPrice(availableFilters.priceRange.max)}
              </div>
            </div>
          )}
        </div>

        {/* Materials Filter */}
        {availableFilters.materials.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('materials')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
            >
              Materials
              <span className={`transform transition-transform ${expandedSections.has('materials') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {expandedSections.has('materials') && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableFilters.materials.map(material => (
                  <label key={material} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.materials?.includes(material) || false}
                      onChange={() => handleMaterialChange(material)}
                      className="mr-3 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">{material}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags Filter */}
        {availableFilters.tags.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('tags')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
            >
              Tags
              <span className={`transform transition-transform ${expandedSections.has('tags') ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {expandedSections.has('tags') && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableFilters.tags.map(tag => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.tags?.includes(tag) || false}
                      onChange={() => handleTagChange(tag)}
                      className="mr-3 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stock Status */}
        <div>
          <button
            onClick={() => toggleSection('stock')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Availability
            <span className={`transform transition-transform ${expandedSections.has('stock') ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {expandedSections.has('stock') && (
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock === true}
                  onChange={(e) => onFiltersChange({ inStock: e.target.checked ? true : undefined })}
                  className="mr-3 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-700">In Stock</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.featured === true}
                  onChange={(e) => onFiltersChange({ featured: e.target.checked ? true : undefined })}
                  className="mr-3 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          )}
        </div>

        {/* Sort Options */}
        <div>
          <button
            onClick={() => toggleSection('sort')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Sort By
            <span className={`transform transition-transform ${expandedSections.has('sort') ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {expandedSections.has('sort') && (
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === 'createdAt' && filters.sortOrder === 'desc'}
                  onChange={() => handleSortChange('createdAt', 'desc')}
                  className="mr-3 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-700">Newest First</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === 'name' && filters.sortOrder === 'asc'}
                  onChange={() => handleSortChange('name', 'asc')}
                  className="mr-3 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-700">Name A-Z</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === 'price' && filters.sortOrder === 'asc'}
                  onChange={() => handleSortChange('price', 'asc')}
                  className="mr-3 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-700">Price Low to High</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === 'price' && filters.sortOrder === 'desc'}
                  onChange={() => handleSortChange('price', 'desc')}
                  className="mr-3 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-700">Price High to Low</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

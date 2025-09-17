'use client'

import { useState } from 'react'
import { ChevronDown, ArrowUpDown } from 'lucide-react'

type SortField = 'name' | 'price' | 'createdAt'

interface AdvancedSortingProps {
  sortBy: SortField
  sortOrder: 'asc' | 'desc'
  onSortChange: (sortBy: SortField, sortOrder: 'asc' | 'desc') => void
}

const sortOptions: Array<{ value: SortField; label: string; order: 'asc' | 'desc' }> = [
  { value: 'createdAt', label: 'Newest First', order: 'desc' },
  { value: 'createdAt', label: 'Oldest First', order: 'asc' },
  { value: 'price', label: 'Price: Low to High', order: 'asc' },
  { value: 'price', label: 'Price: High to Low', order: 'desc' },
  { value: 'name', label: 'Name: A to Z', order: 'asc' },
  { value: 'name', label: 'Name: Z to A', order: 'desc' },
]

export default function AdvancedSorting({ sortBy, sortOrder, onSortChange }: AdvancedSortingProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentSort = sortOptions.find(
    option => option.value === sortBy && option.order === sortOrder
  ) || sortOptions[0]

  const handleSortSelect = (value: SortField, order: 'asc' | 'desc') => {
    onSortChange(value, order)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-primary-300 rounded-lg text-primary-700 hover:border-primary-500 hover:bg-primary-50 transition-colors"
      >
        <ArrowUpDown className="h-4 w-4" />
        <span className="text-sm font-medium">{currentSort.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {sortOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSortSelect(option.value, option.order as 'asc' | 'desc')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  option.value === sortBy && option.order === sortOrder
                    ? 'bg-primary-100 text-primary-800 font-medium'
                    : 'text-primary-700 hover:bg-primary-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'

interface QuickFilter {
  label: string
  value: string
  icon?: React.ReactNode
}

interface QuickFiltersProps {
  activeFilter?: string
  onFilterChange: (filter: string) => void
}

export default function QuickFilters({ activeFilter, onFilterChange }: QuickFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filters: QuickFilter[] = [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'In Stock',
      value: 'inStock',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      label: 'On Sale',
      value: 'onSale',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'New Arrivals',
      value: 'new',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: 'Featured',
      value: 'featured',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ]

  const currentLabel = filters.find(f => f.value === activeFilter)?.label || 'All'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-metal-gold/30 bg-white text-sm font-medium text-deep-black hover:border-metal-gold transition-colors whitespace-nowrap"
      >
        <span>Filter: {currentLabel}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-56 rounded-2xl border border-metal-gold/20 bg-white shadow-luxe z-50">
          <div className="py-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  onFilterChange(filter.value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                  activeFilter === filter.value
                    ? 'bg-metal-gold/10 text-deep-black font-medium'
                    : 'text-deep-black/70 hover:bg-metal-gold/5'
                }`}
              >
                {filter.icon && <span className="w-4 h-4">{filter.icon}</span>}
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'

interface SortOption {
  label: string
  value: string
}

interface SortDropdownProps {
  value: string
  onChange: (value: string) => void
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sortOptions: SortOption[] = [
    { label: 'Featured', value: 'featured' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A to Z', value: 'name-asc' },
    { label: 'Name: Z to A', value: 'name-desc' },
  ]

  const currentLabel = sortOptions.find(opt => opt.value === value)?.label || 'Featured'

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
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-metal-gold/30 bg-white text-sm font-medium text-deep-black hover:border-metal-gold transition-colors"
      >
        <span>Sort: {currentLabel}</span>
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
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-metal-gold/20 bg-white shadow-luxe z-50">
          <div className="py-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  value === option.value
                    ? 'bg-metal-gold/10 text-deep-black font-medium'
                    : 'text-deep-black/70 hover:bg-metal-gold/5'
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

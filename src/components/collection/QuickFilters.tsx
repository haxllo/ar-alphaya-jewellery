'use client'

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

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
            activeFilter === filter.value
              ? 'bg-amber-mirage-brown text-amber-mirage-soft shadow-md border-2 border-amber-mirage-brown'
              : 'bg-white border-2 border-amber-mirage-200 text-amber-mirage-700 hover:border-amber-mirage-gold hover:bg-amber-mirage-50'
          }`}
        >
          {filter.icon && <span className="w-3 h-3 sm:w-4 sm:h-4">{filter.icon}</span>}
          <span className="hidden sm:inline">{filter.label}</span>
          <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  )
}

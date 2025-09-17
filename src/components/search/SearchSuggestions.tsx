'use client'

import { useState, useEffect } from 'react'
import { Search, Clock, TrendingUp } from 'lucide-react'

interface SearchSuggestionsProps {
  query: string
  onSelect: (suggestion: string) => void
  onClose: () => void
}

interface Suggestion {
  text: string
  type: 'recent' | 'popular' | 'category'
  count?: number
}

export default function SearchSuggestions({ query, onSelect, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    // Mock suggestions - in real app, fetch from API
    const mockSuggestions: Suggestion[] = [
      { text: `${query} rings`, type: 'category' as const, count: 12 },
      { text: `${query} earrings`, type: 'category' as const, count: 8 },
      { text: `${query} necklace`, type: 'category' as const, count: 5 },
      { text: 'gold jewelry', type: 'popular' as const, count: 25 },
      { text: 'diamond rings', type: 'popular' as const, count: 18 },
      { text: 'pearl earrings', type: 'recent' as const },
      { text: 'silver bracelet', type: 'recent' as const },
    ].filter(s => s.text.toLowerCase().includes(query.toLowerCase()))

    setSuggestions(mockSuggestions.slice(0, 6))
  }, [query])

  if (suggestions.length === 0) {
    return null
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4" />
      case 'popular':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'recent':
        return 'Recent'
      case 'popular':
        return 'Popular'
      default:
        return 'Category'
    }
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-primary-200 rounded-lg shadow-lg z-50 mt-1">
      <div className="p-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => {
              onSelect(suggestion.text)
              onClose()
            }}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-primary-50 rounded-lg transition-colors"
          >
            {getIcon(suggestion.type)}
            <div className="flex-1">
              <div className="font-medium text-primary-800">{suggestion.text}</div>
              <div className="text-sm text-primary-500 flex items-center gap-2">
                <span>{getTypeLabel(suggestion.type)}</span>
                {suggestion.count && (
                  <>
                    <span>•</span>
                    <span>{suggestion.count} items</span>
                  </>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

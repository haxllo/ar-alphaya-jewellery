'use client'

import { useState } from 'react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
  onRatingChange?: (rating: number) => void
  className?: string
}

export default function StarRating({
  rating,
  maxRating = 5,
  interactive = false,
  size = 'md',
  onRatingChange,
  className = ''
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= (hoverRating || rating)
        const isPartiallyFilled = !isFilled && starValue - 1 < rating && rating < starValue
        
        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className={`${sizeClasses[size]} ${
              interactive 
                ? 'cursor-pointer hover:scale-110 transition-transform' 
                : 'cursor-default'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`${sizeClasses[size]} transition-colors ${
                isFilled 
                  ? 'text-yellow-400 fill-current' 
                  : isPartiallyFilled
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            >
              {isPartiallyFilled ? (
                <defs>
                  <linearGradient id={`star-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset={`${(rating - Math.floor(rating)) * 100}%`} stopColor="rgb(251 191 36)" />
                    <stop offset={`${(rating - Math.floor(rating)) * 100}%`} stopColor="rgb(209 213 219)" />
                  </linearGradient>
                </defs>
              ) : null}
              <path
                fill={isPartiallyFilled ? `url(#star-gradient-${index})` : 'currentColor'}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        )
      })}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

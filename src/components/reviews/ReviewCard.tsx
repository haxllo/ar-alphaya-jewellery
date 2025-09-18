'use client'

import { useState } from 'react'
import StarRating from './StarRating'
import type { Review } from '@/types/product'
import { ReviewsService } from '@/lib/reviews'

interface ReviewCardProps {
  review: Review
  className?: string
}

import { memo } from 'react'

function ReviewCardComponent({ review, className = '' }: ReviewCardProps) {
  const [helpful, setHelpful] = useState(review.helpful || 0)
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  const handleHelpfulClick = async () => {
    if (hasVoted || isVoting) return

    setIsVoting(true)
    try {
      const success = await ReviewsService.markReviewHelpful(review.id)
      if (success) {
        setHelpful(prev => prev + 1)
        setHasVoted(true)
      }
    } catch (error) {
      console.error('Failed to mark review as helpful:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-medium text-gray-900">{review.customerName}</h4>
            {review.verified && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified Purchase
              </span>
            )}
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
        <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
      </div>

      <h3 className="font-medium text-gray-900 mb-2">{review.title}</h3>
      <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>

      <div className="flex items-center justify-between text-sm">
        <button
          onClick={handleHelpfulClick}
          disabled={hasVoted || isVoting}
          className={`flex items-center gap-2 transition-colors ${
            hasVoted 
              ? 'text-green-600 cursor-not-allowed' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg 
            className={`w-4 h-4 transition-transform ${isVoting ? 'animate-pulse' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>
            {isVoting ? 'Voting...' : hasVoted ? 'Thank you!' : 'Helpful'} ({helpful})
          </span>
        </button>

        <div className="text-gray-400">
          Review #{review.id.split('-')[1]}
        </div>
      </div>
    </div>
  )
}

export default memo(ReviewCardComponent)

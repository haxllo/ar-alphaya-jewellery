'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TopPromoBarProps {
  messages?: string[]
  duration?: number // Duration in milliseconds
}

const defaultMessages = [
  'Free shipping island-wide across Sri Lanka',
  'Follow @ar_alphaya_jewellery on Instagram',
  'Custom jewelry design services available',
  'New handcrafted arrivals weekly',
]

export default function TopPromoBar({ 
  messages = defaultMessages, 
  duration = 4000 
}: TopPromoBarProps = {}) {
  // Use messages or fall back to default
  const displayMessages = messages || defaultMessages
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [fadeClass, setFadeClass] = useState('opacity-100')

  const goToPrevious = () => {
    setFadeClass('opacity-0')
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? displayMessages.length - 1 : prevIndex - 1
      )
      setFadeClass('opacity-100')
    }, 150)
  }

  const goToNext = () => {
    setFadeClass('opacity-0')
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayMessages.length)
      setFadeClass('opacity-100')
    }, 150)
  }

  useEffect(() => {
    if (displayMessages.length <= 1 || isHovered) return

    const interval = setInterval(() => {
      // Fade out
      setFadeClass('opacity-0')
      
      // After fade out completes, change message and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % displayMessages.length)
        setFadeClass('opacity-100')
      }, 300) // Half of the transition duration
    }, duration)

    return () => clearInterval(interval)
  }, [displayMessages.length, duration, isHovered])

  // Ensure we always have messages to display
  if (!displayMessages || displayMessages.length === 0) {
    console.error('TopPromoBar: No messages available')
    return (
      <div className="bg-black text-white h-[39px] w-full flex items-center justify-center text-xs font-thin sticky top-0 z-[60]">
        <div className="px-4 text-center font-light tracking-wide">
          Free shipping island-wide across Sri Lanka
        </div>
      </div>
    )
  }

  const currentMessage = displayMessages[currentIndex]
  const isInstagramMessage = currentMessage.includes('@ar_alphaya_jewellery')
  const isCustomOrderMessage = currentMessage.includes('Custom jewelry')

  const renderMessage = () => {
    if (isInstagramMessage) {
      return (
        <Link 
          href="https://www.instagram.com/ar_alphaya_jewellery/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline transition-all duration-200 hover:text-gray-300 hover:opacity-80"
        >
          {currentMessage}
        </Link>
      )
    }
    
    if (isCustomOrderMessage) {
      return (
        <Link 
          href="/contact" 
          className="hover:underline transition-all duration-200 hover:text-gray-300 hover:opacity-80"
        >
          {currentMessage}
        </Link>
      )
    }
    
    return currentMessage
  }

  return (
    <div 
      className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white h-[39px] w-full flex items-center justify-between text-xs font-thin overflow-hidden sticky top-0 z-[60] shadow-inner"
      style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #000000 50%, #1a1a1a 75%, #000000 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(255,255,255,0.05)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="flex items-center justify-center w-10 h-full hover:bg-white/10 transition-colors duration-200 group"
        aria-label="Previous message"
      >
        <svg 
          className="w-3 h-3 text-white/60 group-hover:text-white transition-colors duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Message Content */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          className={`transition-opacity duration-300 ${fadeClass} px-4 text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full font-light tracking-wide`}
        >
          {renderMessage()}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="flex items-center justify-center w-10 h-full hover:bg-white/10 transition-colors duration-200 group"
        aria-label="Next message"
      >
        <svg 
          className="w-3 h-3 text-white/60 group-hover:text-white transition-colors duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Optional: Add dots indicator for multiple messages */}
      {displayMessages.length > 1 && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {displayMessages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setFadeClass('opacity-0')
                setTimeout(() => {
                  setCurrentIndex(index)
                  setFadeClass('opacity-100')
                }, 150)
              }}
              className={`w-1 h-1 rounded-full transition-colors duration-300 hover:bg-white/80 ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`Go to message ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

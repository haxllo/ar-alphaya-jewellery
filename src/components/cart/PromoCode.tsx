'use client'

import { useState } from 'react'

interface PromoCodeProps {
  onApply: (code: string) => Promise<{ success: boolean; message: string; discount?: number }>
}

export default function PromoCode({ onApply }: PromoCodeProps) {
  const [code, setCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleApply = async () => {
    if (!code.trim()) {
      setMessage({ type: 'error', text: 'Please enter a promo code' })
      return
    }

    setIsApplying(true)
    setMessage(null)

    try {
      const result = await onApply(code.trim().toUpperCase())
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setCode('')
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to apply promo code. Please try again.' })
    } finally {
      setIsApplying(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply()
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="promo-code" className="block text-sm font-medium text-amber-mirage-700">
        Promo Code
      </label>
      
      <div className="flex gap-2">
        <input
          id="promo-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="Enter code"
          className="flex-1 px-3 py-2 border border-amber-mirage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-mirage-gold focus:border-transparent uppercase text-amber-mirage-brown"
          disabled={isApplying}
        />
        
        <button
          onClick={handleApply}
          disabled={isApplying || !code.trim()}
          className="px-4 py-2 bg-amber-mirage-gold text-amber-mirage-soft rounded-lg hover:bg-amber-mirage-600 disabled:bg-amber-mirage-200 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </button>
      </div>

      {message && (
        <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useComparisonStore } from '@/lib/store/comparison'
import { Scale, X } from 'lucide-react'
import type { Product } from '@/types/product'

interface CompareButtonProps {
  product: Product
  size?: 'sm' | 'md' | 'lg'
}

export default function CompareButton({ product, size = 'md' }: CompareButtonProps) {
  const { addProduct, removeProduct, isInComparison } = useComparisonStore()
  const [isAnimating, setIsAnimating] = useState(false)
  
  const inComparison = isInComparison(product.id)
  
  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    
    if (inComparison) {
      removeProduct(product.id)
    } else {
      addProduct(product)
    }
  }

  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-3 text-sm',
    lg: 'p-4 text-base'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 border rounded-lg font-medium transition-all duration-200
        ${inComparison 
          ? 'border-primary-500 bg-primary-500 text-white hover:bg-primary-600' 
          : 'border-primary-300 text-primary-700 hover:border-primary-500 hover:bg-primary-50'
        }
        ${sizeClasses[size]}
        ${isAnimating ? 'scale-95' : 'scale-100'}
      `}
      title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
    >
      {inComparison ? (
        <X className={iconSizes[size]} />
      ) : (
        <Scale className={iconSizes[size]} />
      )}
      {inComparison ? 'Remove' : 'Compare'}
    </button>
  )
}

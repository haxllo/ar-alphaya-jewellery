import { useState, useCallback } from 'react'
import type { Product } from '@/types/product'

export function useQuickView() {
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  const openQuickView = useCallback((product: Product, related: Product[] = []) => {
    setProduct(product)
    setRelatedProducts(related)
    setIsOpen(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }, [])

  const closeQuickView = useCallback(() => {
    setIsOpen(false)
    setProduct(null)
    setRelatedProducts([])
    // Restore body scroll
    document.body.style.overflow = 'unset'
  }, [])

  const nextProduct = useCallback(() => {
    if (!product || relatedProducts.length === 0) return
    const currentIndex = relatedProducts.findIndex(p => p.id === product.id)
    const nextIndex = (currentIndex + 1) % relatedProducts.length
    setProduct(relatedProducts[nextIndex])
  }, [product, relatedProducts])

  const prevProduct = useCallback(() => {
    if (!product || relatedProducts.length === 0) return
    const currentIndex = relatedProducts.findIndex(p => p.id === product.id)
    const prevIndex = currentIndex === 0 ? relatedProducts.length - 1 : currentIndex - 1
    setProduct(relatedProducts[prevIndex])
  }, [product, relatedProducts])

  return {
    isOpen,
    product,
    relatedProducts,
    openQuickView,
    closeQuickView,
    nextProduct,
    prevProduct,
  }
}

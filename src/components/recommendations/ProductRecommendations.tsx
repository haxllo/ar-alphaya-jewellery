'use client'

import type { Product } from '@/types/product'
import { ProductCardOne } from '@/components/product-card-01'
import { useCartStore } from '@/lib/store/cart'

interface ProductRecommendationsProps {
  products: Product[]
  title?: string
  showQuickAdd?: boolean
  className?: string
}

export default function ProductRecommendations({ 
  products, 
  title = "You might also like",
  showQuickAdd = true,
  className = ""
}: ProductRecommendationsProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = (product: Product, quantity: number = 1, plating?: string) => {
    const platingPrice = plating === '24k-gold' ? 5000 : plating === '18k-rose-gold' ? 3000 : 0
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price + platingPrice,
      quantity,
      image: product.images?.[0] || '',
      slug: product.slug,
      plating,
    })
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-serif mb-6 text-amber-mirage-brown">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCardOne key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  )
}

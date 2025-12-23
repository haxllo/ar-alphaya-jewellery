'use client'

import { memo } from 'react'
import { Product } from '@/lib/cms'
import { ProductCardOne } from '@/components/product-card-01'
import { useCartStore } from '@/lib/store/cart'

interface ProductGridProps {
  products: Product[]
}

function ProductGridComponent({ products }: ProductGridProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0],
    })
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">No products found</h2>
        <p className="text-gray-600">
          Try adjusting your search criteria or browse all products
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
      {products.map((product) => (
        <ProductCardOne 
          key={product.id} 
          product={product} 
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  )
}

export default memo(ProductGridComponent)

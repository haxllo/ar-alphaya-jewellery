'use client'

import Link from 'next/link'
import { ProductCardOne } from '@/components/product-card-01'
import type { Product } from '@/types/product'
import { useCartStore } from '@/lib/store/cart'

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const addToCart = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0],
      gemstone: undefined,
      size: undefined,
    })
  }

  return (
    <section className="mx-auto max-w-7xl px-8">
      <div className="mb-12 text-center space-y-4">
        <p className="text-xs uppercase tracking-wider text-deep-black/40">Studio Collection</p>
        <h2 className="font-serif font-normal text-4xl md:text-5xl text-deep-black">Available Pieces</h2>
        <p className="text-base text-deep-black/60 max-w-2xl mx-auto">
          Ready to wear or customise to your preference
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCardOne key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/collections/rings" className="inline-block text-sm font-semibold text-deep-black underline-offset-8 hover:underline">
          View All Pieces
        </Link>
      </div>
    </section>
  )
}

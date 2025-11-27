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
    <section className="mx-auto max-w-7xl px-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-nocturne-500">Current creations</p>
          <h2 className="mt-2 font-serif text-3xl text-nocturne-900 md:text-4xl">Limited pieces available to customise or claim</h2>
        </div>
        <Link href="/collections/rings" className="text-sm font-semibold text-nocturne-600 underline-offset-6 hover:text-foreground hover:underline">
          View all studio listings
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCardOne key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </section>
  )
}

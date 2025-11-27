'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import ReviewCard from '@/components/reviews/ReviewCard'
import StarRating from '@/components/reviews/StarRating'
import { useRecentlyViewedStore } from '@/lib/store/recentlyViewed'
import { useCartStore } from '@/lib/store/cart'
import type { Product, PlatingOption, Review, ReviewSummary } from '@/types/product'
import { ProductDetailOne } from '@/components/product-detail-01'

// Lazy-load below-the-fold/heavy components to improve TTI
const ProductRecommendations = dynamic(
  () => import('@/components/recommendations/ProductRecommendations'),
  { ssr: false }
)

interface ProductContentProps {
  product: Product
  reviewSummary?: ReviewSummary
  reviews?: Review[]
}

export default function ProductContent({ product, reviewSummary, reviews = [] }: ProductContentProps) {
  const addToRecentlyViewed = useRecentlyViewedStore((state) => state.addProduct)
  const addToCart = useCartStore((state) => state.addItem)

  // Track product view
  useEffect(() => {
    addToRecentlyViewed({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      category: product.category
    })
  }, [product.id, product.slug, product.name, product.price, product.category, product.images, addToRecentlyViewed])

  const handleAddToCart = (prod: Product, options: { plating?: PlatingOption; quantity: number }) => {
    const finalPrice = prod.price + (options.plating?.priceAdjustment || 0)
    addToCart({
      productId: prod.id,
      slug: prod.slug,
      name: prod.name,
      price: finalPrice,
      quantity: options.quantity,
      image: prod.images?.[0],
      gemstone: undefined,
      size: undefined,
    })
  }

  return (
    <>
      {/* Use the new ProductDetailOne component */}
      <ProductDetailOne product={product} onAddToCart={handleAddToCart} />

      {/* Reviews Section */}
      <section className="mx-auto max-w-7xl px-6 mt-16">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-nocturne-500">Client impressions</p>
            <h2 className="font-serif text-3xl text-nocturne-900">Reviews</h2>
          </div>
          {(reviewSummary?.totalReviews ?? 0) > 0 && (
            <div className="flex items-center gap-3 text-sm text-nocturne-600">
              <StarRating rating={reviewSummary?.averageRating ?? 0} size="sm" />
              <span>
                {reviewSummary?.averageRating?.toFixed(1)} average • {reviewSummary?.totalReviews}{' '}
                {reviewSummary && reviewSummary.totalReviews === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
        </div>

        {(reviewSummary?.totalReviews ?? 0) === 0 ? (
          <div className="rounded-3xl border border-nocturne-100 bg-white/75 p-8 text-center text-nocturne-600">
            Be the first to share your story with this piece. Message us to arrange a design consultation or viewing.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      <section className="mx-auto max-w-7xl px-6 mt-16">
        <RelatedProducts product={product} />
      </section>
    </>
  )
}

function RelatedProducts({ product }: { product: Product }) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  
  useEffect(() => {
    let ignore = false
    async function run() {
      try {
        const body: any = {
          category: product.category,
          limit: 4,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }
        if (product.tags && product.tags.length > 0) {
          body.tags = product.tags.slice(0, 3)
        }
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) return setRelatedProducts([])
        const json = await res.json()
        const prods = (json?.data?.products || []).filter((p: any) => p.slug !== product.slug)
        if (!ignore) setRelatedProducts(prods)
      } catch {
        if (!ignore) setRelatedProducts([])
      }
    }
    run()
    return () => { ignore = true }
  }, [product])

  if (relatedProducts.length === 0) return null

  return (
    <ProductRecommendations
      products={relatedProducts as any}
      title="You might also like"
      className="mt-8"
    />
  )
}

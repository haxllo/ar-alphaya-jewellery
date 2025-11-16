'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { CurrencyService } from '@/lib/currency'
import ReviewCard from '@/components/reviews/ReviewCard'
import StarRating from '@/components/reviews/StarRating'
import { useRecentlyViewedStore } from '@/lib/store/recentlyViewed'
import type { Product, GemstoneOption, Review, ReviewSummary } from '@/types/product'
import { Ruler, Truck, MessageCircle, Scale, Gem } from 'lucide-react'
import { fixUploadcareUrl } from '@/lib/fix-uploadcare-url'

// Lazy-load below-the-fold/heavy components to improve TTI
const WishlistButton = dynamic(() => import('@/components/wishlist/WishlistButton'), { ssr: false })
const AddToCart = dynamic(() => import('@/components/cart/add-to-cart'), { ssr: false })
const SizeGuideModal = dynamic(() => import('@/components/ui/SizeGuideModal'), { ssr: false })
const ShippingReturnsModal = dynamic(() => import('@/components/ui/ShippingReturnsModal'), { ssr: false })
const ProductRecommendations = dynamic(
  () => import('@/components/recommendations/ProductRecommendations'),
  { ssr: false }
)
const CompareButton = dynamic(() => import('@/components/product/CompareButton'), { ssr: false })
const RecentlyViewed = dynamic(() => import('@/components/product/RecentlyViewed'), { ssr: false })
const ShareButtons = dynamic(() => import('@/components/product/ShareButtons'), { ssr: false })
const TrustBadges = dynamic(() => import('@/components/product/TrustBadges'), { ssr: false })
const AskQuestion = dynamic(() => import('@/components/product/AskQuestion'), { ssr: false })

interface ProductContentProps {
  product: Product
  reviewSummary?: ReviewSummary
  reviews?: Review[]
}

export default function ProductContent({ product, reviewSummary, reviews = [] }: ProductContentProps) {
  const { formatPrice, currentCurrency } = usePriceFormatter() as any
  const addToRecentlyViewed = useRecentlyViewedStore((state) => state.addProduct)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneOption | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showShippingReturns, setShowShippingReturns] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([] as unknown as Product[])
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

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

  const formatAvailability = (value?: string) => {
    if (!value) return ''
    return value
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }
  const availabilityFallback = product.inStock ? 'Ready to ship' : 'Made to order'
  const availabilityLabel = formatAvailability(product.availability) || availabilityFallback
  const leadTimeCopy = product.leadTime || (product.inStock ? 'Dispatches within 3–5 business days' : '4–6 weeks production + 2–4 days delivery')
  const isCustomisable = product.customizable !== false

  // Calculate final price with gemstone adjustment
  const getFinalPrice = () => {
    const basePrice = product.price
    const adjustment = selectedGemstone?.priceAdjustment || 0
    return basePrice + adjustment
  }

  // WhatsApp link generator
  const getWhatsAppLink = () => {
    const message = `Hi! I'm interested in the ${product.name}. ${selectedSize ? `Size: ${selectedSize}. ` : ''}${selectedGemstone ? `Gemstone: ${selectedGemstone.name}. ` : ''}Please provide more details.`
    const phoneNumber = '+94774293406'
    return `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
  }

  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`

  return (
    <>
      <main className="mx-auto max-w-7xl px-6 py-14">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-xs uppercase tracking-[0.3em] text-nocturne-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/collections/${product.category}`} className="underline-offset-4 capitalize hover:underline">
                {product.category.replace('-', ' ')}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-nocturne-400" aria-current="page">{product.name}</li>
          </ol>
        </nav>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-nocturne-100 bg-white/70 shadow-subtle">
              {product.images && product.images[0] ? (
                <Image 
                  src={fixUploadcareUrl(product.images[0])}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-nocturne-300">
                  <Gem className="h-16 w-16" />
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images?.slice(1, 5).map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-2xl border border-transparent bg-white/60 transition-all duration-300 hover:border-gold-200">
                  <Image 
                    src={fixUploadcareUrl(image)}
                    alt={`${product.name} view ${index + 2}`}
                    fill
                    className="cursor-pointer object-cover transition-opacity duration-300 hover:opacity-80"
                    sizes="(max-width: 768px) 25vw, (max-width: 1024px) 25vw, 25vw"
                    loading="lazy"
                  />
                </div>
              )) || [1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-2xl border border-dashed border-nocturne-100" />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-nocturne-500">{product.category.replace('-', ' ')}</p>
                  <h1 className="mt-3 font-serif text-4xl text-nocturne-900">{product.name}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <CompareButton product={product} size="md" />
                  <WishlistButton product={product} size="lg" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="text-3xl sm:text-4xl font-semibold text-nocturne-900">
                  {formatPrice(getFinalPrice())}
                  {selectedGemstone && selectedGemstone.priceAdjustment !== undefined && selectedGemstone.priceAdjustment !== 0 && (
                    <span className="ml-2 text-base text-nocturne-500">
                      ({selectedGemstone.priceAdjustment > 0 ? '+' : ''}{formatPrice(selectedGemstone.priceAdjustment)} for {selectedGemstone.name})
                    </span>
                  )}
                </div>
                <ShareButtons productName={product.name} productUrl={currentUrl} />
              </div>
              <div className="mt-3 flex flex-col gap-2 rounded-3xl border border-nocturne-100 bg-white/70 p-4 text-sm text-nocturne-600">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.28em] text-nocturne-500">Availability</span>
                  <span className="font-medium text-nocturne-800">{availabilityLabel}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.28em] text-nocturne-500">Estimated timeline</span>
                  <span>{leadTimeCopy}</span>
                </div>
                {product.statusNote && (
                  <div className="rounded-2xl border border-gold-200/60 bg-gold-50/70 p-3 text-nocturne-700">
                    {product.statusNote}
                  </div>
                )}
                {isCustomisable && (
                  <div className="flex items-center gap-2 text-nocturne-600">
                    <span className="h-2 w-2 rounded-full bg-gold-400" />
                    <span>Custom design adjustments welcomed—add notes at checkout or message us.</span>
                  </div>
                )}
              </div>
              {currentCurrency?.code !== 'LKR' && (
                <div className="mt-2 text-sm text-nocturne-500">
                  Base price: <span className="font-semibold text-nocturne-700">LKR {getFinalPrice().toLocaleString()}</span>
                  <span className="ml-2 text-nocturne-400">
                    (rates updated {(() => { const ts = CurrencyService.getLastRatesUpdate?.(); if (!ts) return 'recently'; try { return new Date(ts).toLocaleString(); } catch { return 'recently'; } })()})
                  </span>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <TrustBadges />

            {/* Product Description */}
            <div className="space-y-3 rounded-3xl border border-nocturne-100 bg-white/80 p-6 shadow-subtle">
              <h3 className="text-xs uppercase tracking-[0.3em] text-nocturne-500">Description</h3>
              <div className="text-sm leading-relaxed text-nocturne-600 whitespace-pre-wrap">{product.description}</div>
            </div>

            {/* Product Specifications */}
            <div className="grid grid-cols-1 gap-4 rounded-3xl border border-nocturne-100 bg-white/70 p-6 sm:grid-cols-2">
              {product.materials && product.materials.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-[0.28em] text-nocturne-500">Materials</h4>
                  <p className="mt-2 text-sm text-nocturne-600">{product.materials.join(', ')}</p>
                </div>
              )}
              
              {product.weight && (
                <div className="flex items-center gap-3">
                  <Scale className="h-4 w-4 text-nocturne-400" />
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.28em] text-nocturne-500">Weight</h4>
                    <p className="mt-1 text-sm text-nocturne-600">{product.weight}g</p>
                  </div>
                </div>
              )}
              
              {product.dimensions && (
                <div>
                  <h4 className="text-xs uppercase tracking-[0.28em] text-nocturne-500">Dimensions</h4>
                  <p className="mt-2 text-sm text-nocturne-600">{product.dimensions}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs uppercase tracking-[0.28em] text-nocturne-500">Category</h4>
                <p className="mt-2 text-sm text-nocturne-600 capitalize">{product.category.replace('-', ' ')}</p>
              </div>
            </div>

            {/* Gemstone Selection */}
            {product.gemstones && product.gemstones.length > 0 && (
              <div>
                <h3 className="mb-3 text-xs uppercase tracking-[0.3em] text-nocturne-500">Select Gemstone</h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.gemstones.map((gemstone) => (
                    <label key={gemstone.value} className={`cursor-pointer p-3 border rounded-lg transition-all ${
                      selectedGemstone?.value === gemstone.value 
                        ? 'border-gold-400 bg-gold-50/70' 
                        : 'border-nocturne-100 hover:border-gold-200'
                    } ${!gemstone.available ? 'cursor-not-allowed opacity-40' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="gemstone"
                            value={gemstone.value}
                            checked={selectedGemstone?.value === gemstone.value}
                            onChange={() => setSelectedGemstone(gemstone)}
                            disabled={!gemstone.available}
                            className="text-nocturne-600"
                          />
                          <div>
                            <div className="font-medium text-nocturne-800">{gemstone.name}</div>
                            {gemstone.description && (
                              <div className="text-sm text-nocturne-500">{gemstone.description}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-nocturne-700">
                          {gemstone.priceAdjustment === undefined || gemstone.priceAdjustment === 0 ? 'Included' : 
                           gemstone.priceAdjustment > 0 ? `+${formatPrice(gemstone.priceAdjustment)}` : formatPrice(gemstone.priceAdjustment)}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-nocturne-500">Select Size</h3>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-nocturne-500 underline-offset-4 hover:text-nocturne-800 hover:underline"
                  >
                    <Ruler className="h-4 w-4" />
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                  {product.sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                        selectedSize === size.value 
                          ? 'border-gold-400 bg-gold-500 text-white' 
                          : 'border-nocturne-100 text-nocturne-700 hover:border-gold-200'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <AddToCart product={product} selectedSize={selectedSize} selectedGemstone={selectedGemstone} />
              
              {/* Ask Question Component */}
              <AskQuestion productName={product.name} productSlug={product.slug} />
              {!product.inStock && (
                <div className="rounded-3xl border border-nocturne-100 bg-white/70 p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.28em] text-nocturne-500">Out of stock — join the waitlist</div>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="Your email"
                      className="flex-1 rounded-full border border-nocturne-100 bg-white/80 px-4 py-2 text-sm focus:border-gold-300 focus:outline-none"
                    />
                    <button
                      onClick={async () => {
                        try {
                          setWaitlistStatus('loading')
                          const res = await fetch('/api/waitlist', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ productId: product.id, slug: product.slug, email: waitlistEmail })
                          })
                          if (!res.ok) throw new Error('Failed')
                          setWaitlistStatus('success')
                        } catch {
                          setWaitlistStatus('error')
                        }
                      }}
                      disabled={!waitlistEmail || waitlistStatus === 'loading'}
                      className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5"
                    >
                      {waitlistStatus === 'loading' ? 'Please wait…' : 'Notify me'}
                    </button>
                  </div>
                  {waitlistStatus === 'success' && (
                    <div className="mt-2 text-sm text-emerald-500">We will email you when it’s back in stock.</div>
                  )}
                  {waitlistStatus === 'error' && (
                    <div className="mt-2 text-sm text-red-500">Could not submit. Try again.</div>
                  )}
                </div>
              )}
              
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-3 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold tracking-[0.18em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-green-700"
                >
                  <MessageCircle className="h-5 w-5" />
                  Ask on WhatsApp
                </a>
                
                <button
                  onClick={() => setShowShippingReturns(true)}
                  className="flex flex-1 items-center justify-center gap-3 rounded-full border border-nocturne-100 px-6 py-3 text-sm font-semibold tracking-[0.18em] text-nocturne-700 transition-transform duration-300 hover:-translate-y-0.5 hover:border-gold-200 hover:text-foreground"
                >
                  <Truck className="h-5 w-5" />
                  Delivery Details
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-3 border-t border-nocturne-100 pt-6 text-sm text-nocturne-600">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Each piece is handcrafted in Kandy, Sri Lanka.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-sky-500"></span>
                <span>Typical timeline: {leadTimeCopy}.</span>
              </div>
              {isCustomisable && (
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-violet-500"></span>
                  <span>Need adjustments? Send us your ideas and we will refine them together.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-16 space-y-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
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
      </main>

      {/* Related products */}
      <section className="mx-auto max-w-7xl px-6">
        <RelatedProducts product={product} onLoad={setRelatedProducts} />
        <ProductRecommendations
          products={relatedProducts as any}
          title="You might also like"
          className="mt-8"
        />
      </section>

      {/* Modals */}
      <SizeGuideModal 
        isOpen={showSizeGuide} 
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />
      
      <ShippingReturnsModal 
        isOpen={showShippingReturns} 
        onClose={() => setShowShippingReturns(false)}
      />

      {/* Sticky Add-to-Cart (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-nocturne-200 bg-white/90 p-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm text-nocturne-500">{product.name}</div>
            <div className="text-lg font-semibold text-nocturne-900">{formatPrice(getFinalPrice())}</div>
          </div>
          <button
            onClick={() => {
              const btn = document.querySelector('button:where([type="button"])') as HTMLButtonElement | null
              btn?.click()
            }}
            className="flex-1 rounded-full bg-foreground py-3 px-4 text-center text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  )
}

function RelatedProducts({ product, onLoad }: { product: Product; onLoad: (p: Product[]) => void }) {
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
        if (!res.ok) return onLoad([] as any)
        const json = await res.json()
        const prods = (json?.data?.products || []).filter((p: any) => p.slug !== product.slug)
        if (!ignore) onLoad(prods)
      } catch {
        if (!ignore) onLoad([] as any)
      }
    }
    run()
    return () => { ignore = true }
  }, [product, onLoad])
  return null
}

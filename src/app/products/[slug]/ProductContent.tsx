'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { CurrencyService } from '@/lib/currency'
// Lazy-load below-the-fold/heavy components to improve TTI
const WishlistButton = dynamic(() => import('@/components/wishlist/WishlistButton'), { ssr: false })
const AddToCart = dynamic(() => import('@/components/cart/add-to-cart'), { ssr: false })
const SizeGuideModal = dynamic(() => import('@/components/ui/SizeGuideModal'), { ssr: false })
const ShippingReturnsModal = dynamic(() => import('@/components/ui/ShippingReturnsModal'), { ssr: false })
import type { Product, GemstoneOption } from '@/types/product'
import { Ruler, Truck, MessageCircle, Scale, Gem } from 'lucide-react'
const ProductRecommendations = dynamic(
  () => import('@/components/recommendations/ProductRecommendations'),
  { ssr: false }
)
const CompareButton = dynamic(() => import('@/components/product/CompareButton'), { ssr: false })
import { useRouter } from 'next/navigation'

interface ProductContentProps {
  product: Product
}

export default function ProductContent({ product }: ProductContentProps) {
  const { formatPrice, currentCurrency } = usePriceFormatter() as any
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneOption | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showShippingReturns, setShowShippingReturns] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([] as unknown as Product[])
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

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

  return (
    <>
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="text-sm text-primary-600 mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <a href="/" className="hover:underline">Home</a>
            </li>
            <li aria-hidden>›</li>
            <li>
              <a href={`/collections/${product.category}`} className="capitalize hover:underline">
                {product.category.replace('-', ' ')}
              </a>
            </li>
            <li aria-hidden>›</li>
            <li className="text-primary-800" aria-current="page">{product.name}</li>
          </ol>
        </nav>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-primary-100 rounded-lg mb-4 overflow-hidden relative">
              {product.images && product.images[0] ? (
                <Image 
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-400">
                  <Gem className="h-16 w-16" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square bg-primary-100 rounded-lg overflow-hidden relative">
                  <Image 
                    src={image}
                    alt={`${product.name} view ${index + 2}`}
                    fill
                    className="object-cover cursor-pointer hover:opacity-75 transition-opacity"
                    sizes="(max-width: 768px) 25vw, (max-width: 1024px) 25vw, 25vw"
                    loading="lazy"
                  />
                </div>
              )) || [1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-primary-100 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-primary-800 mb-2">{product.name}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <CompareButton product={product} size="md" />
                  <WishlistButton product={product} size="lg" />
                </div>
              </div>
              
              <div className="text-3xl font-bold text-primary-700 mb-1">
                {formatPrice(getFinalPrice())}
                {selectedGemstone && selectedGemstone.priceAdjustment !== undefined && selectedGemstone.priceAdjustment !== 0 && (
                  <span className="text-lg text-primary-500 ml-2">
                    ({selectedGemstone.priceAdjustment > 0 ? '+' : ''}{formatPrice(selectedGemstone.priceAdjustment)} for {selectedGemstone.name})
                  </span>
                )}
              </div>
              {currentCurrency?.code !== 'LKR' && (
                <div className="text-sm text-primary-600 mb-4">
                  Base price: <span className="font-medium">LKR {getFinalPrice().toLocaleString()}</span>
                  <span className="ml-2 text-primary-500">
                    (rates updated {(() => { const ts = CurrencyService.getLastRatesUpdate?.(); if (!ts) return 'recently'; try { return new Date(ts).toLocaleString(); } catch { return 'recently'; } })()})
                  </span>
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="prose prose-sm max-w-none">
              <h3 className="font-semibold text-primary-800 mb-2">Description</h3>
              <div className="text-primary-600 whitespace-pre-wrap">{product.description}</div>
            </div>

            {/* Product Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-primary-50 rounded-lg">
              {product.materials && product.materials.length > 0 && (
                <div>
                  <h4 className="font-medium text-primary-700 mb-1">Materials</h4>
                  <p className="text-sm text-primary-600">{product.materials.join(', ')}</p>
                </div>
              )}
              
              {product.weight && (
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary-600" />
                  <div>
                    <h4 className="font-medium text-primary-700">Weight</h4>
                    <p className="text-sm text-primary-600">{product.weight}g</p>
                  </div>
                </div>
              )}
              
              {product.dimensions && (
                <div>
                  <h4 className="font-medium text-primary-700 mb-1">Dimensions</h4>
                  <p className="text-sm text-primary-600">{product.dimensions}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-primary-700 mb-1">Category</h4>
                <p className="text-sm text-primary-600 capitalize">{product.category.replace('-', ' ')}</p>
              </div>
            </div>

            {/* Gemstone Selection */}
            {product.gemstones && product.gemstones.length > 0 && (
              <div>
                <h3 className="font-semibold text-primary-800 mb-3">Select Gemstone</h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.gemstones.map((gemstone) => (
                    <label key={gemstone.value} className={`cursor-pointer p-3 border rounded-lg transition-all ${
                      selectedGemstone?.value === gemstone.value 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-primary-200 hover:border-primary-300'
                    } ${!gemstone.available ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="gemstone"
                            value={gemstone.value}
                            checked={selectedGemstone?.value === gemstone.value}
                            onChange={() => setSelectedGemstone(gemstone)}
                            disabled={!gemstone.available}
                            className="text-primary-600"
                          />
                          <div>
                            <div className="font-medium text-primary-800">{gemstone.name}</div>
                            {gemstone.description && (
                              <div className="text-sm text-primary-600">{gemstone.description}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-primary-700">
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
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-primary-800">Select Size</h3>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-primary-600 hover:text-primary-800 underline flex items-center gap-1"
                  >
                    <Ruler className="h-4 w-4" />
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                        selectedSize === size.value 
                          ? 'border-primary-500 bg-primary-500 text-white' 
                          : 'border-primary-200 text-primary-700 hover:border-primary-400'
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
              {!product.inStock && (
                <div className="border border-primary-200 rounded-lg p-4">
                  <div className="font-medium text-primary-800 mb-2">Out of stock — get notified</div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="Your email"
                      className="flex-1 border border-primary-300 rounded px-3 py-2 text-sm"
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
                      className="bg-primary-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-60"
                    >
                      {waitlistStatus === 'loading' ? 'Please wait…' : 'Notify me'}
                    </button>
                  </div>
                  {waitlistStatus === 'success' && (
                    <div className="text-green-700 text-sm mt-2">We will email you when it’s back in stock.</div>
                  )}
                  {waitlistStatus === 'error' && (
                    <div className="text-red-700 text-sm mt-2">Could not submit. Try again.</div>
                  )}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Ask on WhatsApp
                </a>
                
                <button
                  onClick={() => setShowShippingReturns(true)}
                  className="flex-1 flex items-center justify-center gap-2 border border-primary-300 text-primary-700 hover:bg-primary-50 py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  <Truck className="h-5 w-5" />
                  Shipping & Returns
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-t pt-6 space-y-3 text-sm text-primary-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Free shipping on orders over LKR 50,000</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Lifetime warranty on manufacturing defects</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Related products */}
      <section className="mx-auto max-w-7xl px-6">
        <RelatedProducts product={product} onLoad={setRelatedProducts} />
        <ProductRecommendations
          products={relatedProducts as any}
          title="You might also like"
          className="mt-4"
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary-200 p-3 md:hidden z-40">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm text-primary-600 truncate">{product.name}</div>
            <div className="text-lg font-semibold text-primary-800">{formatPrice(getFinalPrice())}</div>
          </div>
          <button
            onClick={() => {
              const btn = document.querySelector('button:where([type="button"])') as HTMLButtonElement | null
              btn?.click()
            }}
            className="flex-1 bg-primary-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-800 text-center"
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

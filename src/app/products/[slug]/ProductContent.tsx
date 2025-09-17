'use client'

import { useState } from 'react'
import Image from 'next/image'
import { usePriceFormatter } from '@/hooks/useCurrency'
import WishlistButton from '@/components/wishlist/WishlistButton'
import AddToCart from '@/components/cart/add-to-cart'
import SizeGuideModal from '@/components/ui/SizeGuideModal'
import ShippingReturnsModal from '@/components/ui/ShippingReturnsModal'
import type { Product, GemstoneOption } from '@/types/product'
import { Ruler, Truck, MessageCircle, Scale, Gem } from 'lucide-react'

interface ProductContentProps {
  product: Product
}

export default function ProductContent({ product }: ProductContentProps) {
  const { formatPrice } = usePriceFormatter()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneOption | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showShippingReturns, setShowShippingReturns] = useState(false)

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
                <WishlistButton product={product} size="lg" />
              </div>
              
              <div className="text-3xl font-bold text-primary-700 mb-4">
                {formatPrice(getFinalPrice())}
                {selectedGemstone && selectedGemstone.priceAdjustment !== undefined && selectedGemstone.priceAdjustment !== 0 && (
                  <span className="text-lg text-primary-500 ml-2">
                    ({selectedGemstone.priceAdjustment > 0 ? '+' : ''}{formatPrice(selectedGemstone.priceAdjustment)} for {selectedGemstone.name})
                  </span>
                )}
              </div>
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
    </>
  )
}

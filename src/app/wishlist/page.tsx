'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useWishlistStore } from '@/lib/store/wishlist'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { useCartStore } from '@/lib/store/cart'
import { ProductCardOne } from '@/components/product-card-01'
import { Share2, ShoppingBag } from 'lucide-react'

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore()
  const { formatPrice } = usePriceFormatter()
  const { addItem } = useCartStore()
  const [shareSuccess, setShareSuccess] = useState(false)
  const [addingAllToCart, setAddingAllToCart] = useState(false)

  const handleAddToCart = (product: any) => {
    // This function is now passed to ProductCardOne which expects a Product type
    // We can just use the store's addItem directly if needed, but ProductCardOne handles the click event
    // The ProductCardOne component takes an onAddToCart prop.
    
    // However, ProductCardOne expects a full Product object. 
    // The wishlist item might be a subset. Let's ensure compatibility.
    
    // Re-construct the product object for the cart store
     addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0],
    })
  }

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist()
    }
  }

  const handleShareWishlist = async () => {
    const wishlistText = items.map(item => 
      `${item.name} - ${formatPrice(item.price)}\n${typeof window !== 'undefined' ? window.location.origin : ''}/products/${item.slug}`
    ).join('\n\n')
    
    const shareData = {
      title: 'My AR Alphaya Jewellery Wishlist',
      text: `Check out my wishlist from AR Alphaya Jewellery:\n\n${wishlistText}`
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData)
      } else if (typeof navigator !== 'undefined') {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}`)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      }
    } catch (err) {
      console.error('Failed to share:', err)
    }
  }

  const handleAddAllToCart = () => {
    setAddingAllToCart(true)
    items.forEach(item => {
      addItem({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image
      })
    })
    setTimeout(() => setAddingAllToCart(false), 1000)
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-center">
          <div className="mb-8">
            <svg 
              className="w-24 h-24 text-gray-300 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <h1 className="text-3xl font-semibold text-deep-black mb-2">Your Wishlist is Empty</h1>
            <p className="text-deep-black/70 mb-8">
              Save items you love to your wishlist and shop them later
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link
              href="/collections/rings"
              className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-[0.25em] text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-deep-black-900"
            >
              View Collections
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-0 min-[376px]:px-4 sm:px-8 py-12">
      <div className="mb-8 px-4 min-[376px]:px-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-black mb-2">Your Wishlist</h1>
            <p className="text-gray-600">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          {items.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddAllToCart}
                disabled={addingAllToCart}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:bg-gray-400"
              >
                <ShoppingBag className="h-4 w-4" />
                {addingAllToCart ? 'Adding...' : 'Add All to Cart'}
              </button>
              <button
                onClick={handleShareWishlist}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Share2 className="h-4 w-4" />
                {shareSuccess ? 'Copied!' : 'Share'}
              </button>
              <button
                onClick={handleClearWishlist}
                className="text-sm text-red-600 hover:text-red-800 px-4 py-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 px-0">
        {items.map((item) => {
          // Adapt wishlist item to Product interface expected by ProductCardOne
          const product = {
            id: item.productId,
            productId: item.productId, // Added to satisfy Product interface
            slug: item.slug,
            name: item.name,
            price: item.price,
            category: item.category,
            materials: item.materials || [],
            images: item.image ? [item.image] : [],
            description: '',
            currency: 'LKR',
            sizes: [],
            inStock: true,
            featured: false,
            tags: [],
          }

          return (
            <ProductCardOne 
              key={item.productId} 
              product={product} 
              onAddToCart={() => handleAddToCart(product)} 
            />
          )
        })}
      </div>
      
      {/* Continue Shopping Section */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center px-4 min-[376px]:px-0">
        <h2 className="text-xl font-semibold text-black mb-4">Continue Shopping</h2>
        <p className="text-gray-600 mb-6">Discover more beautiful jewelry pieces</p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/collections/rings"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold tracking-wide text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-deep-black-900"
          >
            Rings
          </Link>
          <Link
            href="/collections/earrings"
            className="rounded-full border border-deep-black-200 px-4 py-2 text-sm font-semibold tracking-wide text-deep-black-700 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-deep-black-400"
          >
            Earrings
          </Link>
          <Link
            href="/collections/pendants"
            className="rounded-full border border-deep-black-200 px-4 py-2 text-sm font-semibold tracking-wide text-deep-black-700 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-deep-black-400"
          >
            Pendants
          </Link>
          <Link
            href="/collections/bracelets-bangles"
            className="rounded-full border border-deep-black-200 px-4 py-2 text-sm font-semibold tracking-wide text-deep-black-700 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-deep-black-400"
          >
            Bracelets & Bangles
          </Link>
        </div>
      </div>
    </main>
  )
}

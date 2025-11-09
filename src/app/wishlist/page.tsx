'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useWishlistStore } from '@/lib/store/wishlist'
import { usePriceFormatter } from '@/hooks/useCurrency'
import WishlistButton from '@/components/wishlist/WishlistButton'
import { useCartStore } from '@/lib/store/cart'
import { Share2, ShoppingBag } from 'lucide-react'

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore()
  const { formatPrice } = usePriceFormatter()
  const { addItem } = useCartStore()
  const [shareSuccess, setShareSuccess] = useState(false)
  const [addingAllToCart, setAddingAllToCart] = useState(false)

  const handleAddToCart = (item: any) => {
    // Create CartItem from wishlist item data
    const cartItem = {
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    }
    addItem(cartItem)
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
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">
              Save items you love to your wishlist and shop them later
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link
              href="/collections/rings"
              className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-[0.25em] text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-nocturne-900"
            >
              View Collections
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => {
          // Create product object from wishlist item for WishlistButton
          const product = {
            id: item.productId,
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
            <div key={item.productId} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all">
              <div className="relative">
                <Link href={`/products/${item.slug}`}>
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="absolute top-3 right-3">
                  <WishlistButton 
                    product={product}
                    size="sm"
                    className="bg-white rounded-full shadow-sm"
                  />
                </div>
              </div>
              
              <div className="p-4">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-medium text-black group-hover:text-gray-600 transition-colors mb-1 truncate">
                    {item.name}
                  </h3>
                </Link>
                
                <p className="text-sm text-gray-500 capitalize mb-2">
                  {item.category.replace('-', ' ')}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-black">
                    {formatPrice(item.price)}
                  </span>
                </div>
                
                {item.materials && item.materials.length > 0 && (
                  <p className="text-xs text-gray-500 mb-3 truncate">
                    {item.materials.join(', ')}
                  </p>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 rounded-full bg-foreground py-2 px-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-nocturne-900"
                  >
                    Add to Cart
                  </button>
                  
                  <Link
                    href={`/products/${item.slug}`}
                    className="flex-1 rounded-full border border-nocturne-200 py-2 px-3 text-sm font-semibold tracking-wide text-nocturne-700 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-nocturne-400 text-center"
                  >
                    View Details
                  </Link>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Continue Shopping Section */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <h2 className="text-xl font-semibold text-black mb-4">Continue Shopping</h2>
        <p className="text-gray-600 mb-6">Discover more beautiful jewelry pieces</p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/collections/rings"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold tracking-wide text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-nocturne-900"
          >
            Rings
          </Link>
          <Link
            href="/collections/earrings"
            className="rounded-full border border-nocturne-200 px-4 py-2 text-sm font-semibold tracking-wide text-nocturne-700 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-nocturne-400"
          >
            Earrings
          </Link>
          <Link
            href="/collections/pendants"
            className="rounded-full border border-nocturne-200 px-4 py-2 text-sm font-semibold tracking-wide text-nocturne-700 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-nocturne-400"
          >
            Pendants
          </Link>
          <Link
            href="/collections/bracelets-bangles"
            className="rounded-full border border-nocturne-200 px-4 py-2 text-sm font-semibold tracking-wide text-nocturne-700 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-nocturne-400"
          >
            Bracelets & Bangles
          </Link>
        </div>
      </div>
    </main>
  )
}

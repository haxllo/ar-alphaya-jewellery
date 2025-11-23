# Shopify Buy Button Customization Guide

## Quick Start

### 1. Get Your Shopify Credentials

After exporting and importing products to Shopify:

1. Go to your Shopify Admin
2. Navigate to **Sales channels** → **Buy Button**
3. Get your **Storefront Access Token**:
   - Go to **Settings** → **Apps and sales channels**
   - Click **Develop apps**
   - Create a new app or use existing
   - Configure **Storefront API** access
   - Copy the **Storefront access token**

### 2. Get Product/Collection IDs

#### Get Product ID:
1. In Shopify Admin, go to **Products**
2. Click on a product
3. Look at the URL: `https://admin.shopify.com/store/your-store/products/1234567890`
4. The number at the end is your product ID

#### Get Collection ID:
1. Go to **Products** → **Collections**
2. Click on a collection
3. The ID is in the URL

## Usage Examples

### Single Product Button

```tsx
import ShopifyBuyButton from '@/components/shopify/ShopifyBuyButton';

export default function ProductPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Citrin Ring</h1>
      
      <ShopifyBuyButton
        productId="8234567890123"
        storefrontAccessToken="your-token-here"
        domain="your-store.myshopify.com"
        buttonText="Add to Cart"
        buttonStyles={{
          backgroundColor: '#d97706', // Gold color for jewelry
          color: '#ffffff',
          borderRadius: '12px',
        }}
        showImage={true}
        showPrice={true}
        showTitle={true}
      />
    </div>
  );
}
```

### Product Collection Grid

```tsx
import ShopifyCollectionGrid from '@/components/shopify/ShopifyCollectionGrid';

export default function RingsCollection() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Our Ring Collection</h1>
      
      <ShopifyCollectionGrid
        collectionId="456789012345"
        storefrontAccessToken="your-token-here"
        domain="your-store.myshopify.com"
        productsPerRow={3}
        buttonText="Shop Now"
        showPagination={true}
      />
    </div>
  );
}
```

### Integration with Existing Product Page

Replace your current checkout button with Shopify:

```tsx
// src/app/products/[slug]/page.tsx
import ShopifyBuyButton from '@/components/shopify/ShopifyBuyButton';

export default function ProductPage({ params }: { params: { slug: string } }) {
  // Fetch your product data
  const product = await getProduct(params.slug);
  
  // Map your product to Shopify product ID
  const shopifyProductId = product.shopify_id; // Store this when you export
  
  return (
    <div className="product-page">
      {/* Your existing product display */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      
      {/* Replace your checkout button with Shopify */}
      <ShopifyBuyButton
        productId={shopifyProductId}
        storefrontAccessToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!}
        domain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!}
        buttonText="Buy Now"
        showImage={false} // Hide since you're showing your own images
        showTitle={false}
        showPrice={false}
      />
    </div>
  );
}
```

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token-here
```

## Advanced Customization

### Custom Styling

```tsx
<ShopifyBuyButton
  productId="123"
  storefrontAccessToken="token"
  domain="store.myshopify.com"
  buttonStyles={{
    backgroundColor: '#0f172a', // Dark blue
    color: '#fbbf24', // Gold text
    fontSize: '18px',
    borderRadius: '16px',
  }}
/>
```

### Minimal Button (Just Add to Cart)

```tsx
<ShopifyBuyButton
  productId="123"
  storefrontAccessToken="token"
  domain="store.myshopify.com"
  showImage={false}
  showTitle={false}
  showPrice={false}
  buttonText="Add to Cart"
  buttonStyles={{
    backgroundColor: '#059669',
    color: '#ffffff',
  }}
/>
```

### Full Product Card

```tsx
<ShopifyBuyButton
  productId="123"
  storefrontAccessToken="token"
  domain="store.myshopify.com"
  showImage={true}
  showTitle={true}
  showPrice={true}
  buttonText="Buy Now - Fast Checkout"
/>
```

## CSS Customization

Add to your `globals.css`:

```css
/* Shopify Buy Button Custom Styles */
.shopify-buy-button {
  font-family: inherit;
  max-width: 100%;
}

/* Hide Shopify branding (optional) */
.shopify-buy__product__powered-by {
  display: none !important;
}

/* Custom button hover effects */
.shopify-buy__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* Jewelry-specific styling */
.shopify-buy-button .shopify-buy__product__title {
  font-family: 'Playfair Display', serif;
  letter-spacing: 0.5px;
}

.shopify-buy-button .shopify-buy__product__variant-selectors {
  margin: 20px 0;
}

/* Gold accent for jewelry */
.shopify-buy-button .shopify-buy__product__actual-price {
  color: #d97706 !important;
  font-weight: 700;
}
```

## Mapping Products

When you export products to Shopify, save the Shopify product IDs:

```typescript
// Add Shopify ID column to your database
ALTER TABLE products ADD COLUMN shopify_product_id VARCHAR(255);

// After import, update your products with Shopify IDs
UPDATE products 
SET shopify_product_id = 'shopify-product-id-here'
WHERE slug = 'citrin-ring';
```

## Benefits

### For You:
- ✅ No payment gateway registration needed
- ✅ Shopify handles all payments
- ✅ Inventory sync with Shopify
- ✅ Order management in Shopify Admin
- ✅ Supports Sri Lanka payments

### For Customers:
- ✅ Secure Shopify checkout
- ✅ Multiple payment options
- ✅ Order tracking
- ✅ Professional checkout experience

## Complete Example

```tsx
// src/app/shop/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ShopifyBuyButton from '@/components/shopify/ShopifyBuyButton';

interface Product {
  id: string;
  name: string;
  slug: string;
  shopify_id: string;
  price: number;
  image: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products from your API
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Shop Our Collection</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-green-600 text-lg font-bold mb-4">
                Rs. {(product.price / 100).toLocaleString()}
              </p>
              
              <ShopifyBuyButton
                productId={product.shopify_id}
                storefrontAccessToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!}
                domain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!}
                showImage={false}
                showTitle={false}
                showPrice={false}
                buttonText="Quick Buy"
                buttonStyles={{
                  backgroundColor: '#d97706',
                  borderRadius: '8px',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Troubleshooting

### Button Not Showing
- Check Storefront Access Token is correct
- Verify product ID exists in Shopify
- Check browser console for errors

### Wrong Currency
- Update `moneyFormat` in component
- Default is set to `Rs.` for Sri Lanka

### Styling Issues
- Add `!important` to CSS overrides
- Check browser dev tools for Shopify's inline styles

## Next Steps

1. Export products to Shopify (done ✅)
2. Get Storefront Access Token
3. Add environment variables
4. Install components
5. Map product IDs
6. Test checkout flow
7. Go live!

---

**Need Help?** Check Shopify's [Buy Button documentation](https://shopify.dev/docs/api/storefront) for more advanced customization options.

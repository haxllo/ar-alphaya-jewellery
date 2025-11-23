# Shopify Buy Button Setup - AR Alphaya Jewellery

## Your Shopify Store Details

- **Store URL**: https://admin.shopify.com/store/ar-alphaya-jewellery
- **Store Domain**: `ar-alphaya-jewellery.myshopify.com`
- **Storefront Access Token**: `b1d8a5d5de79b1c65cf4356c65540f01`

### Example IDs:
- **Product ID**: `7500957188155` (Citrin Ring)
- **Collection ID**: `303182118971` (Your jewelry collection)

---

## Quick Setup (5 Minutes)

### Step 1: Add Environment Variables

1. Create/update `.env.local` file in your project root:

```env
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_DOMAIN=ar-alphaya-jewellery.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=b1d8a5d5de79b1c65cf4356c65540f01
```

2. **IMPORTANT**: Make sure `.env.local` is in your `.gitignore` (it already is ✅)

### Step 2: Test the Implementation

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Visit test pages:
   - Single Product: http://localhost:3000/shop-test
   - Collection Grid: http://localhost:3000/collection-test

3. Click "Buy Now" and test checkout flow

### Step 3: Integrate into Your Product Pages

Replace your existing checkout button:

```tsx
// Before (your current checkout)
<button onClick={handleCheckout}>
  Place Order
</button>

// After (Shopify checkout)
import ShopifyBuyButton from '@/components/shopify/ShopifyBuyButton';

<ShopifyBuyButton
  productId={product.shopify_id}
  storefrontAccessToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!}
  domain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!}
  buttonText="Buy Now"
  showImage={false}
  showTitle={false}
  showPrice={false}
/>
```

---

## Getting Product IDs for All Products

### Method 1: From Shopify Admin

1. Go to https://admin.shopify.com/store/ar-alphaya-jewellery/products
2. Click any product
3. Look at URL: `.../products/7500957188155`
4. That number is the Product ID

### Method 2: Store IDs in Database

When you export products to Shopify, save their IDs:

```sql
ALTER TABLE products ADD COLUMN shopify_product_id VARCHAR(255);

-- After importing to Shopify, update each product:
UPDATE products 
SET shopify_product_id = '7500957188155'
WHERE slug = 'citrin-ring';
```

### Method 3: Bulk Export from Shopify

Export products from Shopify and create a mapping:

```typescript
// scripts/sync-shopify-ids.ts
const productMappings = [
  { slug: 'citrin-ring', shopify_id: '7500957188155' },
  { slug: 'ruby-pendant', shopify_id: '7500957188156' },
  // ... etc
];
```

---

## Integration Examples

### Example 1: Product Detail Page

```tsx
// src/app/products/[slug]/page.tsx
import { getProduct } from '@/lib/products';
import ShopifyBuyButton from '@/components/shopify/ShopifyBuyButton';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  
  return (
    <div className="product-page">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Your existing product display */}
        <div>
          <img src={product.images[0]} alt={product.name} />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl text-green-600 my-4">
            Rs. {(product.price / 100).toLocaleString()}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          {/* Shopify Buy Button */}
          <ShopifyBuyButton
            productId={product.shopify_product_id || '7500957188155'}
            storefrontAccessToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!}
            domain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!}
            buttonText="Buy Now - Secure Checkout"
            buttonStyles={{
              backgroundColor: '#d97706',
              color: '#ffffff',
              borderRadius: '12px',
            }}
            showImage={false}
            showTitle={false}
            showPrice={false}
          />
        </div>
      </div>
    </div>
  );
}
```

### Example 2: Shop Page with Multiple Products

```tsx
// src/app/shop/page.tsx
import ShopifyCollectionGrid from '@/components/shopify/ShopifyCollectionGrid';

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shop Our Jewelry Collection</h1>
      
      <ShopifyCollectionGrid
        collectionId="303182118971"
        storefrontAccessToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!}
        domain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!}
        productsPerRow={3}
        buttonText="Shop Now"
      />
    </div>
  );
}
```

### Example 3: Homepage Featured Product

```tsx
// src/app/page.tsx
import ShopifyBuyButton from '@/components/shopify/ShopifyBuyButton';

export default function HomePage() {
  return (
    <div>
      <section className="featured-product py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Featured: Citrin Ring</h2>
          
          <ShopifyBuyButton
            productId="7500957188155"
            storefrontAccessToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!}
            domain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!}
            buttonText="Shop Featured Product"
            buttonStyles={{
              backgroundColor: '#b45309',
              color: '#fef3c7',
            }}
          />
        </div>
      </section>
    </div>
  );
}
```

---

## Customization Guide

### Color Schemes

#### Gold Theme (Jewelry)
```tsx
buttonStyles={{
  backgroundColor: '#d97706', // Amber 600
  color: '#ffffff',
  borderRadius: '12px',
}}
```

#### Luxury Dark Theme
```tsx
buttonStyles={{
  backgroundColor: '#0f172a', // Slate 900
  color: '#fbbf24', // Amber 400
  borderRadius: '16px',
}}
```

#### Emerald Theme
```tsx
buttonStyles={{
  backgroundColor: '#059669', // Emerald 600
  color: '#ffffff',
  borderRadius: '8px',
}}
```

### Button Text Options

- `"Buy Now"`
- `"Add to Cart"`
- `"Shop Now"`
- `"Quick Buy"`
- `"Purchase - Secure Checkout"`
- `"Buy with Shopify"`

---

## Testing Checklist

- [ ] Environment variables added to `.env.local`
- [ ] Dev server running
- [ ] Visit `/shop-test` page loads
- [ ] Click "Buy Now" button works
- [ ] Product modal opens
- [ ] Can select variants (size, gemstone)
- [ ] Add to cart works
- [ ] Cart displays correctly
- [ ] Checkout flow works
- [ ] Currency shows as Rs.
- [ ] Collection grid at `/collection-test` works
- [ ] Multiple products display
- [ ] Can checkout from collection

---

## Next Steps

1. ✅ Test with the provided test pages
2. Choose where to integrate:
   - Product pages
   - Collection pages
   - Homepage
   - Category pages
3. Update product database with Shopify IDs
4. Replace existing checkout flow
5. Test thoroughly
6. Deploy to production

---

## Troubleshooting

### Button Not Showing
- Check `.env.local` exists and has correct values
- Restart dev server: `Ctrl+C` then `npm run dev`
- Check browser console for errors

### Wrong Product Displayed
- Verify Product ID is correct
- Check product exists in Shopify
- Try accessing product in Shopify Admin

### Checkout Not Working
- Verify Storefront Access Token is valid
- Check Shopify store is not in password-protected mode
- Ensure product has inventory

### Currency Wrong
- Currency is set to `Rs.` in components
- Check `moneyFormat` in component files

---

## Support

**Shopify Admin**: https://admin.shopify.com/store/ar-alphaya-jewellery

**Test Pages**:
- `/shop-test` - Single product examples
- `/collection-test` - Collection grid examples

**Documentation**:
- `docs/SHOPIFY_BUY_BUTTON_CUSTOMIZATION.md` - Full customization guide
- `docs/SHOPIFY_EXPORT_GUIDE.md` - Product export guide

---

**Ready to go live?** Test thoroughly in development, then deploy to production!

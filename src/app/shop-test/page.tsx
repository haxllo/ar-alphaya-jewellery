import ShopifyBuyButton from '@/components/shopify/ShopifyBuyButton';

export default function ShopTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shopify Buy Button Test
          </h1>
          <p className="text-gray-600">
            Testing Shopify integration with your product
          </p>
        </div>

        {/* Single Product Test */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Single Product Button (Full Display)
          </h2>
          <ShopifyBuyButton
            productId="7500957188155"
            storefrontAccessToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!}
            domain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!}
            buttonText="Buy Now"
            buttonStyles={{
              backgroundColor: '#d97706',
              color: '#ffffff',
              borderRadius: '12px',
            }}
            showImage={true}
            showPrice={true}
            showTitle={true}
          />
        </div>

        {/* Minimal Button Test */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Minimal Button (Button Only)
          </h2>
          <p className="text-gray-600 mb-4">
            Use this style to integrate with your existing product pages
          </p>
          <ShopifyBuyButton
            productId="7500957188155"
            storefrontAccessToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!}
            domain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!}
            buttonText="Add to Cart"
            buttonStyles={{
              backgroundColor: '#059669',
              color: '#ffffff',
              borderRadius: '8px',
            }}
            showImage={false}
            showPrice={false}
            showTitle={false}
          />
        </div>

        {/* Gold Themed Button */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Gold Themed Button (Jewelry Style)
          </h2>
          <ShopifyBuyButton
            productId="7500957188155"
            storefrontAccessToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!}
            domain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!}
            buttonText="Shop Now - Secure Checkout"
            buttonStyles={{
              backgroundColor: '#b45309',
              color: '#fef3c7',
              borderRadius: '16px',
            }}
            showImage={true}
            showPrice={true}
            showTitle={true}
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📝 Testing Instructions
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>✅ Click any "Buy Now" button to test checkout</li>
            <li>✅ Use Shopify's test payment details</li>
            <li>✅ Check product variants (size, gemstone)</li>
            <li>✅ Test cart functionality</li>
            <li>✅ Verify currency displays as Rs.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

import ShopifyCollectionGrid from '@/components/shopify/ShopifyCollectionGrid';

export default function CollectionTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Collection Grid Test
          </h1>
          <p className="text-gray-600">
            Testing Shopify collection display with multiple products
          </p>
        </div>

        {/* Collection Grid - 3 Products Per Row */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            3 Products Per Row
          </h2>
          <ShopifyCollectionGrid
            collectionId="303182118971"
            storefrontAccessToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!}
            domain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!}
            productsPerRow={3}
            buttonText="Buy Now"
            showPagination={true}
          />
        </div>

        {/* Collection Grid - 4 Products Per Row */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            4 Products Per Row
          </h2>
          <ShopifyCollectionGrid
            collectionId="303182118971"
            storefrontAccessToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!}
            domain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!}
            productsPerRow={4}
            buttonText="Shop Now"
            showPagination={true}
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📝 Collection Display Features
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>✅ Automatically displays all products in collection</li>
            <li>✅ Responsive grid layout</li>
            <li>✅ Pagination for large collections</li>
            <li>✅ Click any product to see modal with details</li>
            <li>✅ Add to cart from grid or modal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

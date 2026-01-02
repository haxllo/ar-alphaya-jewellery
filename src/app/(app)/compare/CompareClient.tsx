'use client'

import { useComparisonStore } from '@/lib/store/comparison'
import ProductComparison from '@/components/product/ProductComparison'

export default function CompareClient() {
  const { products, removeProduct, clearProducts } = useComparisonStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-4">Product Comparison</h1>
          <p className="text-primary-600">
            Compare up to 4 products side by side to make the best choice for your jewelry needs.
          </p>
        </div>

        <ProductComparison
          products={products}
          onRemove={removeProduct}
          onClear={clearProducts}
        />

        {products.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Comparison Tips</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Compare materials, weight, and dimensions to find the right fit</li>
              <li>• Check availability and pricing to make informed decisions</li>
              <li>• Consider your style preferences and intended use</li>
              <li>• Contact us for personalized recommendations</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}



import Link from 'next/link'

export default function ReturnPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Return & Refund Policy</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          <strong>Last updated: January 4, 2025</strong>
        </p>

        <p className="text-gray-700 mb-8">
          At Ar Alphaya Jewellery, your satisfaction is our priority. We want you to be completely happy with your jewelry purchase. If for any reason you are not satisfied, we offer a comprehensive return and refund policy.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">RETURN OVERVIEW</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ 30-day return window</li>
            <li>✓ Full refund on eligible items</li>
            <li>✓ Free return shipping for defective items</li>
            <li>✓ Exchange options available</li>
            <li>✓ Quality guarantee</li>
          </ul>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Return Eligibility</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">✓ Eligible for Return</h3>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Items in original condition with all tags</li>
                <li>• Unworn jewelry with original packaging</li>
                <li>• Returns within 30 days of delivery</li>
                <li>• Items with original receipt or order number</li>
                <li>• Defective or damaged items</li>
                <li>• Items not matching description</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-800 mb-4">✗ Not Eligible for Return</h3>
              <ul className="space-y-2 text-red-700 text-sm">
                <li>• Custom or personalized jewelry</li>
                <li>• Engraved items (unless defective)</li>
                <li>• Worn or damaged items</li>
                <li>• Items missing original packaging</li>
                <li>• Returns after 30-day period</li>
                <li>• Pierced earrings (hygiene reasons)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">How to Return Items</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
              <div>
                <h3 className="font-semibold text-gray-800">Contact Us</h3>
                <p className="text-gray-700 text-sm mb-2">Email us at aralphayajewellery@gmail.com or call +94 77 429 3406</p>
                <p className="text-gray-600 text-xs">Include your order number and reason for return</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
              <div>
                <h3 className="font-semibold text-gray-800">Receive Return Instructions</h3>
                <p className="text-gray-700 text-sm mb-2">We&apos;ll email you detailed return instructions and a return authorization number</p>
                <p className="text-gray-600 text-xs">Instructions valid for 7 days</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
              <div>
                <h3 className="font-semibold text-gray-800">Package Your Return</h3>
                <p className="text-gray-700 text-sm mb-2">Pack items securely in original packaging with all accessories</p>
                <p className="text-gray-600 text-xs">Include return authorization number and original receipt</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">4</div>
              <div>
                <h3 className="font-semibold text-gray-800">Ship the Return</h3>
                <p className="text-gray-700 text-sm mb-2">Use the prepaid return label (for eligible returns) or arrange your own shipping</p>
                <p className="text-gray-600 text-xs">We recommend insured shipping for valuable items</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">5</div>
              <div>
                <h3 className="font-semibold text-gray-800">Processing & Refund</h3>
                <p className="text-gray-700 text-sm mb-2">We inspect and process your return within 3-5 business days</p>
                <p className="text-gray-600 text-xs">Refund issued within 7-10 business days</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Refund Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Refund Timeline</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li><strong>Credit Card:</strong> 5-7 business days</li>
                <li><strong>Bank Transfer:</strong> 3-5 business days</li>
                <li><strong>PayHere:</strong> 3-7 business days</li>
                <li><strong>Store Credit:</strong> Immediate</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Refund Options</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li>• <strong>Full Refund:</strong> Original payment method</li>
                <li>• <strong>Store Credit:</strong> 110% of purchase value</li>
                <li>• <strong>Exchange:</strong> For different size/style</li>
                <li>• <strong>Partial Refund:</strong> For damaged packaging</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Refund Amounts</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• <strong>Product Cost:</strong> Full refund of item price</li>
              <li>• <strong>Shipping Cost:</strong> Refunded only for defective items</li>
              <li>• <strong>Return Shipping:</strong> Customer responsibility unless item is defective</li>
              <li>• <strong>Engraving/Customization:</strong> Non-refundable unless error on our part</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Exchanges</h2>
          
          <p className="text-gray-700 mb-6">
            We offer exchanges for size or style changes within 30 days of purchase. Exchange process follows the same steps as returns.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Size Exchange</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Ring sizing adjustments</li>
                <li>• Bracelet length changes</li>
                <li>• Chain length modifications</li>
                <li>• Free for first exchange</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Style Exchange</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Different design same value</li>
                <li>• Upgrade with price difference</li>
                <li>• Subject to availability</li>
                <li>• Processing fee may apply</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Credit Exchange</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Store credit for future purchase</li>
                <li>• 12-month validity</li>
                <li>• Cannot be combined with sales</li>
                <li>• Transferable to family</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Quality Guarantee</h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Manufacturing Defects</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• 1-year warranty on craftsmanship</li>
                  <li>• Free repair or replacement</li>
                  <li>• Covers loose stones, broken clasps</li>
                  <li>• Does not cover normal wear</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Material Quality</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Genuine materials guarantee</li>
                  <li>• Certificates provided</li>
                  <li>• Metal purity assurance</li>
                  <li>• Gemstone authenticity</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Special Circumstances</h2>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Damaged in Transit</h3>
              <p className="text-yellow-700 text-sm">
                Items damaged during shipping are fully covered. Contact us immediately with photos of the damage and packaging.
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Wrong Item Received</h3>
              <p className="text-purple-700 text-sm">
                If you receive the wrong item, we&apos;ll arrange immediate exchange at no cost to you, including return shipping.
              </p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">International Returns</h3>
              <p className="text-orange-700 text-sm">
                International returns may take longer to process. Additional customs fees may apply and are customer&apos;s responsibility.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Contact Information</h2>
          <p className="text-gray-700 mb-4">
            For return inquiries or to initiate a return, please contact us:
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <ul className="space-y-3 text-gray-700">
              <li><strong>Email:</strong> <a href="mailto:aralphayajewellery@gmail.com" className="text-black hover:underline">aralphayajewellery@gmail.com</a></li>
              <li><strong>Phone:</strong> <a href="tel:+94774293406" className="text-black hover:underline">+94 77 429 3406</a></li>
              <li><strong>WhatsApp:</strong> Quick response for urgent return queries</li>
              <li><strong>Business Hours:</strong> Monday - Saturday, 9 AM - 6 PM</li>
              <li><strong>Return Address:</strong> 143/5 Rainbow park, Temple road, Kengalla - 20186</li>
            </ul>
          </div>
        </section>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-800 mb-3">Our Promise</h3>
          <p className="text-green-700 text-sm">
            We stand behind the quality of our jewelry and are committed to ensuring your complete satisfaction. 
            If you&apos;re not happy with your purchase, we&apos;ll work with you to make it right.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <Link 
            href="/" 
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

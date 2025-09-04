import Link from 'next/link'

export default function ShippingPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          <strong>Last updated: January 4, 2025</strong>
        </p>

        <p className="text-gray-700 mb-8">
          At Ar Alphaya Jewellery, we are committed to delivering your precious jewelry safely and efficiently. This policy outlines our shipping methods, timeframes, and procedures.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">SHIPPING OVERVIEW</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Free shipping within Colombo for orders over Rs 50,000</li>
            <li>✓ Island-wide delivery available</li>
            <li>✓ International shipping to selected countries</li>
            <li>✓ Express delivery options available</li>
            <li>✓ Secure packaging for all jewelry items</li>
            <li>✓ Order tracking provided</li>
          </ul>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Domestic Shipping (Within Sri Lanka)</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Standard Delivery</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Timeframe:</strong> 3-7 business days</li>
                <li><strong>Cost:</strong> Rs 500 (Free over Rs 50,000)</li>
                <li><strong>Coverage:</strong> All major cities and towns</li>
                <li><strong>Tracking:</strong> Yes</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Express Delivery</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Timeframe:</strong> 1-2 business days</li>
                <li><strong>Cost:</strong> Rs 1,500</li>
                <li><strong>Coverage:</strong> Colombo, Kandy, Galle, Negombo</li>
                <li><strong>Tracking:</strong> Real-time tracking</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Special Delivery Areas</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• <strong>Colombo Metro Area:</strong> Same-day delivery available for orders placed before 2 PM</li>
              <li>• <strong>Remote Areas:</strong> Additional 2-3 days may be required</li>
              <li>• <strong>Post Office Box:</strong> Not available for jewelry deliveries (signature required)</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">International Shipping</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Countries</h3>
            <div className="grid md:grid-cols-3 gap-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">Asia Pacific</h4>
                <ul className="text-sm space-y-1">
                  <li>• India</li>
                  <li>• Singapore</li>
                  <li>• Malaysia</li>
                  <li>• Australia</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Europe</h4>
                <ul className="text-sm space-y-1">
                  <li>• United Kingdom</li>
                  <li>• Germany</li>
                  <li>• France</li>
                  <li>• Netherlands</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">North America</h4>
                <ul className="text-sm space-y-1">
                  <li>• United States</li>
                  <li>• Canada</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Times & Costs</h3>
              <ul className="space-y-3 text-gray-700">
                <li><strong>Asia Pacific:</strong> 7-14 days | Rs 3,500 - Rs 5,000</li>
                <li><strong>Europe:</strong> 10-21 days | Rs 4,500 - Rs 6,500</li>
                <li><strong>North America:</strong> 10-21 days | Rs 5,000 - Rs 7,000</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">International Requirements</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Customs forms completed</li>
                <li>• Import duties may apply</li>
                <li>• Minimum order Rs 25,000</li>
                <li>• Jewelry certificates included</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Order Processing</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
              <div>
                <h3 className="font-semibold text-gray-800">Order Confirmation</h3>
                <p className="text-gray-700 text-sm">Orders are processed within 1-2 business days after payment confirmation.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
              <div>
                <h3 className="font-semibold text-gray-800">Quality Check</h3>
                <p className="text-gray-700 text-sm">Each piece undergoes careful inspection and professional packaging.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
              <div>
                <h3 className="font-semibold text-gray-800">Dispatch</h3>
                <p className="text-gray-700 text-sm">Items are dispatched with tracking information sent to your email.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">4</div>
              <div>
                <h3 className="font-semibold text-gray-800">Delivery</h3>
                <p className="text-gray-700 text-sm">Secure delivery with signature confirmation required.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Packaging & Security</h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Secure Packaging</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Premium jewelry boxes</li>
                  <li>• Protective cushioning materials</li>
                  <li>• Tamper-evident sealing</li>
                  <li>• Discreet exterior packaging</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Insurance & Security</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Full insurance coverage included</li>
                  <li>• Signature required on delivery</li>
                  <li>• Safe drop-off not available</li>
                  <li>• GPS tracking available</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Important Information</h2>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Delivery Delays</h3>
              <p className="text-yellow-700 text-sm">
                Delivery times may be extended during peak seasons (Valentine&apos;s Day, Christmas) or due to weather conditions. We&apos;ll notify you of any significant delays.
              </p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Failed Deliveries</h3>
              <p className="text-red-700 text-sm">
                If delivery fails due to incorrect address or recipient unavailability, additional charges may apply for redelivery attempts.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Order Tracking</h3>
              <p className="text-green-700 text-sm">
                Track your order 24/7 using the tracking number provided in your shipping confirmation email.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            For shipping inquiries or special delivery requirements, please contact us:
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <ul className="space-y-3 text-gray-700">
              <li><strong>Email:</strong> <a href="mailto:aralphayajewellery@gmail.com" className="text-black hover:underline">aralphayajewellery@gmail.com</a></li>
              <li><strong>Phone:</strong> <a href="tel:+94774293406" className="text-black hover:underline">+94 77 429 3406</a></li>
              <li><strong>WhatsApp:</strong> Available for delivery updates and queries</li>
              <li><strong>Business Hours:</strong> Monday - Saturday, 9 AM - 6 PM</li>
            </ul>
          </div>
        </section>

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

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
          At AR Alphaya Jewellery, we are committed to delivering your precious jewelry safely and efficiently. This policy outlines our shipping methods, timeframes, and procedures.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">SHIPPING OVERVIEW</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Custom commissions require 4–6 weeks from design approval to completion before dispatch.</li>
            <li>✓ Island-wide delivery across Sri Lanka with tracked courier partners (2–4 business days).</li>
            <li>✓ Studio collection in Kandy can be arranged by appointment.</li>
            <li>✓ International shipping is available on request and quoted individually.</li>
            <li>✓ Every piece ships in discreet, secure packaging with care instructions.</li>
          </ul>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Domestic Shipping (Within Sri Lanka)</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Standard Delivery</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Production:</strong> Custom commissions require 4–6 weeks from design approval to completion.</li>
                <li><strong>Transit time:</strong> 2–4 business days with tracking updates.</li>
                <li><strong>Coverage:</strong> All major cities and town centres in Sri Lanka.</li>
                <li><strong>Cost:</strong> Rs 750 flat rate.</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Hand Delivery / Pick-up</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Dispatch:</strong> Coordinated once your piece has passed final polishing.</li>
                <li><strong>Options:</strong> Studio collection in Kandy or personal delivery within Kandy city.</li>
                <li><strong>Extended handover:</strong> Delivery to Colombo is available on select dates; please enquire for scheduling and fees.</li>
                <li><strong>Cost:</strong> Quoted during confirmation.</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Special Delivery Areas</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• <strong>Kandy District:</strong> Same-day handover is possible once your piece is ready.</li>
              <li>• <strong>Remote areas:</strong> Couriers may require an additional 1–2 business days.</li>
              <li>• <strong>PO Boxes:</strong> Unavailable; a signature is required on delivery.</li>
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
            <p className="mt-4 text-sm text-gray-600">International delivery is coordinated manually to ensure paperwork, insurance, and timelines fit your destination. Availability for a country may change based on local regulations and carrier schedules.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Times & Costs</h3>
              <ul className="space-y-3 text-gray-700">
                <li><strong>Asia Pacific:</strong> 6–12 business days in transit. Rates start around Rs 4,500; final cost confirmed before payment.</li>
                <li><strong>Europe:</strong> 10–18 business days in transit. Rates vary by destination; expect Rs 6,000–9,000.</li>
                <li><strong>North America:</strong> 10–18 business days in transit. Rates typically begin at Rs 7,500.</li>
                <li className="text-sm text-gray-500">Transit times are counted after your piece leaves the studio. Customs processing may extend delivery windows.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">International Requirements</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Completed customs forms and identification where requested by carriers.</li>
                <li>• Import duties, VAT, and brokerage fees are the responsibility of the recipient.</li>
                <li>• Minimum order value of Rs 30,000 for international consignments.</li>
                <li>• Care cards and material notes are included; insurance can be arranged on request.</li>
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
                <p className="text-gray-700 text-sm">Each piece is inspected under magnification, photographed for records, and packaged securely.</p>
                <p className="text-gray-700 text-sm">Orders are processed within 1-2 business days after payment confirmation.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
              <div>
                <p className="text-gray-700 text-sm">Your parcel is booked with a trusted courier and tracking details are shared via email.</p>
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
                <p className="text-gray-700 text-sm">Signature confirmation is required on delivery or at pick-up.</p>
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
                  <li>• Discreet, unbranded exterior cartons</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Insurance & Security</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Signature required on delivery or collection</li>
                  <li>• Safe drop-off is not available for jewellery shipments</li>
                  <li>• Insurance for domestic parcels is included up to Rs 150,000; higher coverage can be arranged on request.</li>
                  <li>• International insurance is quoted separately when required.</li>
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
              <li><strong>Email:</strong> <a href="mailto:info@aralphayajewellery.com" className="text-black hover:underline">info@aralphayajewellery.com</a></li>
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

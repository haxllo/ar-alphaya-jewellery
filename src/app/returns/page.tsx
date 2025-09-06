import Link from 'next/link'

export default function ReturnPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Return Policy</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          <strong>Last updated: August 28, 2025</strong>
        </p>

        <p className="text-gray-700 mb-8">
          Thank you for your purchase. We hope you are happy with your purchase. However, if you are not completely satisfied with your purchase for any reason, you may return it to us for a refund only. Please see below for more information on our return policy.
        </p>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Returns</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              <strong>Return Timeframe:</strong> All returns must be postmarked within seven (7) days of the purchase date.
            </p>
            <p className="text-gray-700">
              <strong>Condition Requirement:</strong> All returned items must be in new and unused condition, with all original tags and labels attached.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Return Process</h2>
          <div className="space-y-6">
            <p className="text-gray-700">
              To return an item, place the item securely in its original packaging and include your proof of purchase, then mail your return to the following address:
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Mailing Address</h3>
              <div className="text-blue-800">
                <p><strong>Ar Alphaya Jewellery</strong></p>
                <p>Attn: Returns</p>
                <p>143/5 Rainbow park, Temple road, Kengalla</p>
                <p>Kandy, Central 20186</p>
                <p>Sri Lanka</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Important Note</h3>
              <p className="text-yellow-700 text-sm">
                You will be responsible for all return shipping charges. We strongly recommend that you use a trackable method to mail your return.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Refunds</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              After receiving your return and inspecting the condition of your item, we will process your return.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Processing Time:</strong> Please allow at least four (4) days from the receipt of your item to process your return</li>
              <li><strong>Refund Timeline:</strong> Refunds may take 1-2 billing cycles to appear on your credit card statement, depending on your credit card company</li>
              <li><strong>Notification:</strong> We will notify you by email when your return has been processed</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Exceptions</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">The following items cannot be returned:</h3>
            <ul className="space-y-2 text-red-700">
              <li>• Personalized or engraved jewellery</li>
              <li>• Custom-made orders</li>
              <li>• Pierced earrings (for hygiene reasons)</li>
            </ul>
            <p className="text-red-700 mt-4 text-sm">
              For defective or damaged products, please contact us at the contact details below to arrange a refund or exchange.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Questions</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about our return policy, please contact us:
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <ul className="space-y-3 text-gray-700">
              <li><strong>Phone:</strong> <a href="tel:+94774293406" className="text-black hover:underline">+94 77 429 3406</a></li>
              <li><strong>Email:</strong> <a href="mailto:aralphayajewellery@gmail.com" className="text-black hover:underline">aralphayajewellery@gmail.com</a></li>
              <li><strong>Address:</strong> 143/5 Rainbow park, Temple road, Kengalla, Kandy, Central 20186, Sri Lanka</li>
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

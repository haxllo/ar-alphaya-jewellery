import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          <strong>Last updated: January 4, 2025</strong>
        </p>

        <p className="text-gray-700 mb-6">
          Welcome to Ar Alphaya Jewellery. These Terms of Service govern your use of our website and services. By using our services, you agree to these terms.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">TABLE OF CONTENTS</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li><a href="#acceptance" className="text-black hover:underline">Acceptance of Terms</a></li>
            <li><a href="#services" className="text-black hover:underline">Description of Services</a></li>
            <li><a href="#account" className="text-black hover:underline">User Accounts</a></li>
            <li><a href="#orders" className="text-black hover:underline">Orders and Payment</a></li>
            <li><a href="#shipping" className="text-black hover:underline">Shipping and Delivery</a></li>
            <li><a href="#returns" className="text-black hover:underline">Returns and Refunds</a></li>
            <li><a href="#intellectual" className="text-black hover:underline">Intellectual Property</a></li>
            <li><a href="#prohibited" className="text-black hover:underline">Prohibited Uses</a></li>
            <li><a href="#limitation" className="text-black hover:underline">Limitation of Liability</a></li>
            <li><a href="#termination" className="text-black hover:underline">Termination</a></li>
            <li><a href="#governing" className="text-black hover:underline">Governing Law</a></li>
            <li><a href="#contact-terms" className="text-black hover:underline">Contact Information</a></li>
          </ol>
        </div>

        <section id="acceptance" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using the Ar Alphaya Jewellery website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          <p className="text-gray-700">
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section id="services" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">2. Description of Services</h2>
          <p className="text-gray-700 mb-4">
            Ar Alphaya Jewellery provides an online platform for the sale of fine jewelry, including rings, earrings, necklaces, bracelets, and related accessories.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• High-quality handcrafted jewelry</li>
            <li>• Custom jewelry design services</li>
            <li>• Professional jewelry consultation</li>
            <li>• Secure online ordering and payment processing</li>
          </ul>
        </section>

        <section id="account" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">3. User Accounts</h2>
          <p className="text-gray-700 mb-4">
            While not required for browsing, creating an account allows you to:
          </p>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li>• Track your orders</li>
            <li>• Save shipping and billing information</li>
            <li>• Access order history</li>
            <li>• Receive exclusive offers</li>
          </ul>
          <p className="text-gray-700">
            You are responsible for maintaining the confidentiality of your account information and password.
          </p>
        </section>

        <section id="orders" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">4. Orders and Payment</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Acceptance</h3>
          <p className="text-gray-700 mb-4">
            All orders are subject to acceptance and availability. We reserve the right to refuse or cancel orders at our discretion.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing</h3>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li>• All prices are listed in Sri Lankan Rupees (LKR)</li>
            <li>• Prices are subject to change without notice</li>
            <li>• Additional taxes may apply based on delivery location</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Methods</h3>
          <p className="text-gray-700">
            We accept various payment methods including credit cards, PayHere, and bank transfers. Payment must be received before order processing.
          </p>
        </section>

        <section id="shipping" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">5. Shipping and Delivery</h2>
          <ul className="space-y-3 text-gray-700">
            <li><strong>Domestic Shipping:</strong> 3-7 business days within Sri Lanka</li>
            <li><strong>International Shipping:</strong> 7-14 business days (additional charges apply)</li>
            <li><strong>Express Shipping:</strong> Available for urgent orders</li>
            <li><strong>Packaging:</strong> All items are carefully packaged with protective materials</li>
          </ul>
        </section>

        <section id="returns" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">6. Returns and Refunds</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Return Policy</h3>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li>• 30-day return window from delivery date</li>
            <li>• Items must be in original condition with all packaging</li>
            <li>• Custom or personalized items are non-returnable</li>
            <li>• Return shipping costs are customer&apos;s responsibility</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Refund Process</h3>
          <p className="text-gray-700">
            Refunds are processed within 7-10 business days after we receive the returned item. Refunds are issued to the original payment method.
          </p>
        </section>

        <section id="intellectual" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">7. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            All content on this website, including designs, images, text, and logos, is the property of Ar Alphaya Jewellery and is protected by copyright and trademark laws.
          </p>
          <p className="text-gray-700">
            You may not reproduce, distribute, or create derivative works without our express written permission.
          </p>
        </section>

        <section id="prohibited" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">8. Prohibited Uses</h2>
          <p className="text-gray-700 mb-4">You may not use our service:</p>
          <ul className="space-y-2 text-gray-700">
            <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>• To violate any international, federal, provincial, or state regulations or laws</li>
            <li>• To transmit or procure the sending of any advertising or promotional material</li>
            <li>• To impersonate or attempt to impersonate the company, employees, or other users</li>
            <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
          </ul>
        </section>

        <section id="limitation" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">9. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            Ar Alphaya Jewellery shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
          <p className="text-gray-700">
            Our total liability to you for all claims arising from or relating to this agreement shall not exceed the amount you paid for the products or services.
          </p>
        </section>

        <section id="termination" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">10. Termination</h2>
          <p className="text-gray-700">
            We may terminate or suspend your access immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section id="governing" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">11. Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be governed and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law provisions.
          </p>
        </section>

        <section id="contact-terms" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">12. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <ul className="space-y-3 text-gray-700">
              <li><strong>Email:</strong> <a href="mailto:aralphayajewellery@gmail.com" className="text-black hover:underline">aralphayajewellery@gmail.com</a></li>
              <li><strong>Phone:</strong> <a href="tel:+94774293406" className="text-black hover:underline">+94 77 429 3406</a></li>
              <li><strong>Address:</strong> 143/5 Rainbow park, Temple road, Kengalla - 20186</li>
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

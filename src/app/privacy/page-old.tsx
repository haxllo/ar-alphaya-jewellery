import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          <strong>Last updated: August 28, 2025</strong>
        </p>

        <p className="text-gray-700 mb-6">
          This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
        </p>

        <p className="text-gray-700 mb-8">
          We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">TABLE OF CONTENTS</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li><a href="#interpretation" className="text-black hover:underline">Interpretation and Definitions</a></li>
            <li><a href="#collecting" className="text-black hover:underline">Collecting and Using Your Personal Data</a></li>
            <li><a href="#disclosure" className="text-black hover:underline">Disclosure of Your Personal Data</a></li>
            <li><a href="#security" className="text-black hover:underline">Security of Your Personal Data</a></li>
            <li><a href="#children" className="text-black hover:underline">Children&apos;s Privacy</a></li>
            <li><a href="#links" className="text-black hover:underline">Links to Other Websites</a></li>
            <li><a href="#changes" className="text-black hover:underline">Changes to this Privacy Policy</a></li>
            <li><a href="#contact" className="text-black hover:underline">Contact Us</a></li>
          </ol>
        </div>

        <section id="interpretation" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Interpretation and Definitions</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h3>
          <p className="text-gray-700 mb-6">
            The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Definitions</h3>
          <ul className="space-y-3 text-gray-700">
            <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
            <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party...</li>
            <li><strong>Company</strong> refers to Ar Alphaya Jewellery.</li>
            <li><strong>Cookies</strong> are small files placed on Your Device...</li>
            <li><strong>Country</strong> refers to: Sri Lanka</li>
            <li><strong>Device</strong> means any device that can access the Service...</li>
            <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
            <li><strong>Service</strong> refers to the Website.</li>
            <li><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company...</li>
            <li><strong>Usage Data</strong> refers to data collected automatically...</li>
            <li><strong>Website</strong> refers to Ar Alphaya Jewellery, accessible at <a href="https://aralphaya.netlify.app/" className="text-black hover:underline">https://aralphaya.netlify.app/</a></li>
            <li><strong>You</strong> means the individual using the Service, or the company/entity they represent.</li>
          </ul>
        </section>

        <section id="collecting" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Collecting and Using Your Personal Data</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Types of Data Collected</h3>
          <ul className="space-y-2 text-gray-700 mb-6">
            <li><strong>Personal Data:</strong> Email, First/Last name, Phone, Address, Usage Data</li>
            <li><strong>Usage Data:</strong> Device info, IP, browser, pages visited, etc.</li>
            <li><strong>Tracking Technologies and Cookies</strong></li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Use of Your Personal Data</h3>
          <ul className="space-y-2 text-gray-700 mb-6">
            <li>• To provide and maintain the Service</li>
            <li>• To manage Your Account</li>
            <li>• For contract performance</li>
            <li>• To contact You</li>
            <li>• To provide news, offers, and updates</li>
            <li>• To manage requests</li>
            <li>• For business transfers</li>
            <li>• For other purposes (analytics, improvements, etc.)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Data Sharing</h3>
          <ul className="space-y-2 text-gray-700 mb-6">
            <li>• With Service Providers</li>
            <li>• For business transfers</li>
            <li>• With Affiliates</li>
            <li>• With business partners</li>
            <li>• With other users (if shared publicly)</li>
            <li>• With Your consent</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Retention of Data</h3>
          <ul className="space-y-2 text-gray-700 mb-6">
            <li>• <strong>Personal Data:</strong> kept as long as necessary for purposes outlined.</li>
            <li>• <strong>Usage Data:</strong> kept shorter, unless needed for security or legal compliance.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Transfer of Data</h3>
          <p className="text-gray-700 mb-6">
            • May be stored/processed outside your country. Company ensures secure handling.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Delete Your Data</h3>
          <p className="text-gray-700 mb-6">
            • You may request deletion, updates, or corrections of personal data.
          </p>
        </section>

        <section id="disclosure" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Disclosure of Your Personal Data</h2>
          <ul className="space-y-3 text-gray-700">
            <li><strong>Business Transactions:</strong> May be transferred in case of merger/acquisition.</li>
            <li><strong>Law Enforcement:</strong> May disclose if required by law.</li>
            <li><strong>Other Legal Requirements:</strong> To comply with obligations, defend rights, prevent wrongdoing, protect safety, or avoid liability.</li>
          </ul>
        </section>

        <section id="security" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Security of Your Personal Data</h2>
          <p className="text-gray-700">
            • We use commercially acceptable means but cannot guarantee 100% security.
          </p>
        </section>

        <section id="children" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Children&apos;s Privacy</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Service not directed to under 13.</li>
            <li>• No knowingly collected data from under 13.</li>
          </ul>
        </section>

        <section id="links" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Links to Other Websites</h2>
          <p className="text-gray-700">
            • Not responsible for third-party sites&apos; content/policies.
          </p>
        </section>

        <section id="changes" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Changes to this Privacy Policy</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• May update from time to time.</li>
            <li>• Changes notified on this page with updated &ldquo;Last updated&rdquo; date.</li>
          </ul>
        </section>

        <section id="contact" className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions, contact us:
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <ul className="space-y-3 text-gray-700">
              <li><strong>Email:</strong> <a href="mailto:aralphayajewellery@gmail.com" className="text-black hover:underline">aralphayajewellery@gmail.com</a></li>
              <li><strong>Phone:</strong> <a href="tel:+94774293406" className="text-black hover:underline">+94 77 429 3406</a></li>
              <li><strong>Mail:</strong> 143/5 Rainbow park, Temple road, Kengalla - 20186</li>
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

import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          <strong>Last updated: August 29, 2025</strong>
        </p>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Agreement to Our Legal Terms</h2>
          <p className="text-gray-700 mb-4">
            We are Ar Alphaya jewellery ("Company", "we", "us", or "our"), a sole proprietorship operating in Sri Lanka at 143/5 Rainbow park, Temple road, Kengalla, Kandy, Central 20186.
          </p>
          <p className="text-gray-700 mb-4">
            We operate the website https://aralphaya.netlify.app (the "Site"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
          </p>
          <p className="text-gray-700 mb-4">
            Ar Alphaya jewellery offers a curated collection of elegant and modern jewellery pieces. Discover unique necklaces, bracelets, rings, and earrings designed to add a touch of sophistication to any style.
          </p>
          <p className="text-gray-700 mb-4">
            You can contact us by phone at 0774293406, email at aralphayajewellery@gmail.com, or by mail to 143/5 Rainbow park, Temple road, Kengalla, Kandy, Central 20186, Sri Lanka.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 mb-4">
              These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Ar Alphaya jewellery, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms.
            </p>
            <p className="text-blue-800 font-semibold">
              IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </p>
          </div>
          <p className="text-gray-700 mt-6">
            The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <ol className="space-y-1 text-gray-700">
              <li>1. Our Services</li>
              <li>2. Intellectual Property Rights</li>
              <li>3. User Representations</li>
              <li>4. User Registration</li>
              <li>5. Products</li>
              <li>6. Purchases and Payment</li>
              <li>7. Return Policy</li>
              <li>8. Prohibited Activities</li>
              <li>9. User Generated Contributions</li>
              <li>10. Contribution License</li>
              <li>11. Guidelines for Reviews</li>
              <li>12. Third-Party Websites and Content</li>
              <li>13. Services Management</li>
              <li>14. Privacy Policy</li>
            </ol>
            <ol start="15" className="space-y-1 text-gray-700">
              <li>15. Digital Millennium Copyright Act</li>
              <li>16. Term and Termination</li>
              <li>17. Modifications and Interruptions</li>
              <li>18. Governing Law</li>
              <li>19. Dispute Resolution</li>
              <li>20. Corrections</li>
              <li>21. Disclaimer</li>
              <li>22. Limitations of Liability</li>
              <li>23. Indemnification</li>
              <li>24. User Data</li>
              <li>25. Electronic Communications</li>
              <li>26. California Users and Residents</li>
              <li>27. Miscellaneous</li>
              <li>28. Contact Us</li>
            </ol>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">1. Our Services</h2>
          <p className="text-gray-700">
            The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">2. Intellectual Property Rights</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Intellectual Property</h3>
              <p className="text-gray-700 mb-4">
                We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the 'Content'), as well as the trademarks, service marks, and logos contained therein (the 'Marks').
              </p>
              <p className="text-gray-700 mb-4">
                The Content and Marks are provided in or through the Services 'AS IS' for your personal, non-commercial use only.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Use of Our Services</h3>
              <p className="text-gray-700 mb-4">
                Subject to your compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable licence to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>access the Services; and</li>
                <li>download or print a copy of any portion of the Content to which you have properly gained access,</li>
              </ul>
              <p className="text-gray-700">
                solely for your personal, non-commercial use.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">5. Products</h2>
          <p className="text-gray-700 mb-4">
            We make every effort to display as accurately as possible the colours, features, specifications, and details of the products available on the Services. However, we do not guarantee that the colours, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors.
          </p>
          <p className="text-gray-700">
            All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">6. Purchases and Payment</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              We accept the following forms of payment:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
              <li>Visa</li>
              <li>Mastercard</li>
              <li>American Express</li>
              <li>Discover</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. All payments shall be in Sri Lankan Rupees.
            </p>
            <p className="text-gray-700">
              We reserve the right to refuse any order placed through the Services and may limit or cancel quantities purchased per person, per household, or per order.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">7. Return Policy</h2>
          <p className="text-gray-700 mb-4">
            Please review our Return Policy prior to making any purchases:
          </p>
          <Link 
            href="/returns" 
            className="inline-block text-black hover:underline font-medium"
          >
            View Return Policy →
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">8. Prohibited Activities</h2>
          <p className="text-gray-700 mb-4">
            You may not access or use the Services for any purpose other than that for which we make the Services available. As a user of the Services, you agree not to:
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <ul className="space-y-2 text-red-800 text-sm">
              <li>• Use the Services for any illegal or unauthorised purpose</li>
              <li>• Systematically retrieve data or content from the Services without written permission</li>
              <li>• Trick, defraud, or mislead us and other users</li>
              <li>• Circumvent, disable, or interfere with security-related features</li>
              <li>• Use any information obtained from the Services to harass, abuse, or harm another person</li>
              <li>• Upload or transmit viruses, Trojan horses, or other harmful material</li>
              <li>• Engage in automated use of the system or data mining</li>
              <li>• Make any unauthorised or fraudulent purchases</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">14. Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            We care about data privacy and security. Please review our Privacy Policy. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms.
          </p>
          <Link 
            href="/privacy" 
            className="inline-block text-black hover:underline font-medium"
          >
            View Privacy Policy →
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">18. Governing Law</h2>
          <p className="text-gray-700">
            These Legal Terms shall be governed by and defined following the laws of Sri Lanka. You and we irrevocably consent that the courts of Sri Lanka shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">21. Disclaimer</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800 text-sm uppercase font-semibold">
              THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">28. Contact Us</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Ar Alphaya Jewellery</strong></p>
              <p>143/5 Rainbow park, Temple road, Kengalla</p>
              <p>Kandy, Central 20186</p>
              <p>Sri Lanka</p>
              <p><strong>Phone:</strong> <a href="tel:+94774293406" className="text-black hover:underline">0774293406</a></p>
              <p><strong>Email:</strong> <a href="mailto:aralphayajewellery@gmail.com" className="text-black hover:underline">aralphayajewellery@gmail.com</a></p>
            </div>
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

import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Policies | AR Alphaya Jewellery',
  description: 'Privacy Policy, Terms of Service, and Return Policy for AR Alphaya Jewellery',
}

export default function PoliciesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-serif text-4xl text-deep-black-900 mb-3">Policies</h1>
      <p className="text-deep-black-600 mb-10">Last updated: August 28, 2025</p>

      {/* Quick Navigation */}
      <div className="mb-12 flex flex-wrap gap-3">
        <a href="#returns" className="rounded-full border border-deep-black-200 px-5 py-2 text-sm font-medium text-deep-black-700 transition-colors hover:bg-deep-black-50">
          Returns Policy
        </a>
        <a href="#privacy" className="rounded-full border border-deep-black-200 px-5 py-2 text-sm font-medium text-deep-black-700 transition-colors hover:bg-deep-black-50">
          Privacy Policy
        </a>
        <a href="#terms" className="rounded-full border border-deep-black-200 px-5 py-2 text-sm font-medium text-deep-black-700 transition-colors hover:bg-deep-black-50">
          Terms & Conditions
        </a>
      </div>

      {/* RETURNS POLICY */}
      <section id="returns" className="mb-16 scroll-mt-20">
        <div className="rounded-3xl border border-deep-black-100 bg-white/80 p-8 shadow-subtle">
          <h2 className="font-serif text-3xl text-deep-black-900 mb-6">Returns & Exchanges</h2>
          
          <div className="prose prose-gray max-w-none space-y-6 text-deep-black-700">
            <p>
              We want you to be completely satisfied with your purchase. If you're not happy with your piece for any reason, you may return it for a refund within 7 days of receipt.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="rounded-2xl border border-deep-black-100 bg-deep-black-50/50 p-5">
                <h3 className="text-lg font-semibold text-deep-black-900 mb-3">✓ Eligible for Return</h3>
                <ul className="space-y-2 text-sm text-deep-black-600">
                  <li>• Items in new, unworn condition</li>
                  <li>• Original packaging included</li>
                  <li>• All tags and labels attached</li>
                  <li>• Returned within 7 days of delivery</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
                <h3 className="text-lg font-semibold text-red-900 mb-3">✗ Not Eligible for Return</h3>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Personalized or engraved pieces</li>
                  <li>• Custom-made commissions</li>
                  <li>• Pierced earrings (hygiene reasons)</li>
                  <li>• Items showing signs of wear</li>
                </ul>
              </div>
            </div>

            <div className="my-8 rounded-2xl border border-blue-200 bg-blue-50/50 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Return</h3>
              <ol className="space-y-3 text-sm text-blue-800">
                <li><strong>1. Contact us</strong> via email or WhatsApp to initiate your return</li>
                <li><strong>2. Package securely</strong> in original packaging with proof of purchase</li>
                <li><strong>3. Ship to:</strong> AR Alphaya Jewellery, 143/5 Rainbow Park, Temple Road, Kengalla, Kandy 20186, Sri Lanka</li>
                <li><strong>4. Track your return</strong> — you're responsible for return shipping costs</li>
              </ol>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Refunds</h3>
              <p>Once we receive and inspect your return, we'll process your refund within 4 business days. Refunds appear on your statement within 1-2 billing cycles depending on your bank. You'll receive an email confirmation when processed.</p>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Defective or Damaged Items</h3>
              <p>If you receive a defective or damaged piece, contact us immediately. We'll arrange for a replacement or full refund at no cost to you, including return shipping.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY POLICY */}
      <section id="privacy" className="mb-16 scroll-mt-20">
        <div className="rounded-3xl border border-deep-black-100 bg-white/80 p-8 shadow-subtle">
          <h2 className="font-serif text-3xl text-deep-black-900 mb-6">Privacy Policy</h2>
          
          <div className="prose prose-gray max-w-none space-y-6 text-deep-black-700">
            <p>
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use our website and services.
            </p>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Information We Collect</h3>
              <p className="mb-3">When you use our services, we may collect:</p>
              <ul className="space-y-2 text-sm">
                <li><strong>Contact Information:</strong> Name, email address, phone number, shipping address</li>
                <li><strong>Payment Information:</strong> Billing details (processed securely through our payment providers)</li>
                <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent on site</li>
                <li><strong>Communication:</strong> Messages sent through contact forms or WhatsApp</li>
              </ul>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">How We Use Your Information</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Process orders</strong> and deliver your purchases</li>
                <li>• <strong>Communicate with you</strong> about orders, custom commissions, and inquiries</li>
                <li>• <strong>Improve our services</strong> through analytics and feedback</li>
                <li>• <strong>Send updates</strong> about new collections (only if you opt-in)</li>
                <li>• <strong>Comply with legal obligations</strong> and prevent fraud</li>
              </ul>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Data Security</h3>
              <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Your Rights</h3>
              <p className="mb-3">You have the right to:</p>
              <ul className="space-y-2 text-sm">
                <li>• Access the personal data we hold about you</li>
                <li>• Request correction of inaccurate data</li>
                <li>• Request deletion of your data</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Object to data processing in certain circumstances</li>
              </ul>
              <p className="mt-4 text-sm">To exercise these rights, contact us at <a href="mailto:info@aralphayajewellery.com" className="text-deep-black-900 underline">info@aralphayajewellery.com</a></p>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Cookies</h3>
              <p>We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookies through your browser settings.</p>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Third-Party Services</h3>
              <p>We may use third-party services (payment processors, analytics tools) that collect and process data according to their own privacy policies. We are not responsible for their practices.</p>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Children's Privacy</h3>
              <p>Our services are not directed to individuals under 18. We do not knowingly collect personal information from children.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TERMS & CONDITIONS */}
      <section id="terms" className="mb-16 scroll-mt-20">
        <div className="rounded-3xl border border-deep-black-100 bg-white/80 p-8 shadow-subtle">
          <h2 className="font-serif text-3xl text-deep-black-900 mb-6">Terms & Conditions</h2>
          
          <div className="prose prose-gray max-w-none space-y-6 text-deep-black-700">
            <p>
              By accessing and using our website and services, you agree to be bound by these terms and conditions. Please read them carefully.
            </p>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">About Us</h3>
              <p>
                AR Alphaya Jewellery operates in Sri Lanka, specializing in bespoke and handcrafted jewelry with Sri Lankan gemstones and recycled gold.
              </p>
              <div className="mt-3 rounded-2xl bg-deep-black-50 p-4 text-sm">
                <p><strong>Contact Address:</strong> 143/5 Rainbow Park, Temple Road, Kengalla, Kandy 20186, Sri Lanka</p>
                <p className="mt-1"><strong>Phone:</strong> <a href="tel:+94774293406" className="underline">+94 77 429 3406</a> | <strong>Email:</strong> <a href="mailto:info@aralphayajewellery.com" className="underline">info@aralphayajewellery.com</a></p>
              </div>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Product Information</h3>
              <p>We strive to display accurate product colors, specifications, and details. However, actual colors may vary due to screen settings. All products are subject to availability and prices may change without notice.</p>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Orders & Payment</h3>
              <ul className="space-y-2 text-sm">
                <li>• We accept Visa, Mastercard, American Express, and bank transfers</li>
                <li>• All prices are in Sri Lankan Rupees (LKR) unless otherwise stated</li>
                <li>• Payment is required before work begins on custom pieces</li>
                <li>• We reserve the right to refuse or cancel any order</li>
                <li>• For custom commissions, a 50% deposit is typically required</li>
              </ul>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Custom Commissions</h3>
              <p>Custom-made pieces typically require 4–6 weeks from design approval to completion, plus 2–4 business days for domestic delivery (Sri Lanka). Timelines may vary based on complexity and gemstone sourcing. We'll keep you updated throughout the process.</p>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Intellectual Property</h3>
              <p>All content on this website—including designs, photographs, text, and logos—is owned by AR Alphaya Jewellery and protected by copyright. You may not reproduce or use our content without written permission.</p>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Prohibited Activities</h3>
              <p className="mb-3">You may not:</p>
              <ul className="space-y-1 text-sm">
                <li>• Use our services for illegal purposes</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Make fraudulent purchases</li>
                <li>• Copy or reproduce our designs without permission</li>
                <li>• Harass or abuse our staff</li>
              </ul>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Limitation of Liability</h3>
              <p>Our services are provided "as is" without warranties of any kind. We are not liable for indirect, incidental, or consequential damages arising from your use of our services.</p>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Governing Law</h3>
              <p>These terms are governed by the laws of Sri Lanka. Any disputes will be resolved in the courts of Sri Lanka.</p>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-semibold text-deep-black-900 mb-3">Changes to Terms</h3>
              <p>We may update these terms from time to time. We'll notify you of significant changes via email or a notice on our website. Continued use of our services after changes constitutes acceptance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="rounded-3xl border border-gold-200/60 bg-gold-50/30 p-8 text-center">
        <h2 className="font-serif text-2xl text-deep-black-900 mb-3">Questions About Our Policies?</h2>
        <p className="text-deep-black-600 mb-6">We're here to help. Reach out anytime.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/94774293406?text=Hi!%20I%20have%20a%20question%20about%20your%20policies"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-green-700"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Us
          </a>
          <a
            href="mailto:info@aralphayajewellery.com"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-deep-black-200 bg-white px-6 py-3 text-sm font-semibold text-deep-black-700 transition-transform duration-300 hover:-translate-y-0.5 hover:border-deep-black-400"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Us
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-deep-black-200 bg-white px-6 py-3 text-sm font-semibold text-deep-black-700 transition-transform duration-300 hover:-translate-y-0.5 hover:border-deep-black-400"
          >
            Contact Form
          </Link>
        </div>
      </section>

      <div className="mt-12 text-center">
        <Link 
          href="/" 
          className="text-sm font-medium text-deep-black-600 underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}

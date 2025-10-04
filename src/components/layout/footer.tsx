'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import SizeGuideModal from '@/components/ui/SizeGuideModal'

export default function Footer() {
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  
  return (
    <footer className="relative overflow-hidden bg-nocturne-900 text-white/90">
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
        <div className="absolute -left-24 top-[-10%] h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="absolute bottom-[-30%] right-[-10%] h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Image 
                src="/images/LOGO1.png" 
                alt="AR Alphaya Jewellery" 
                width={44} 
                height={48}
                loading="lazy"
                className="h-12 w-12 object-contain"
              />
              <div>
                <p className="font-serif text-2xl font-semibold tracking-[0.24em] text-white">AR ALPHAYA</p>
                <p className="text-xs uppercase tracking-[0.38em] text-white/60">Jewellery Atelier</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              Bespoke fine jewellery hand-finished in Sri Lanka. We specialise in heirloom redesigns, ethically sourced gemstones, and modern silhouettes for every celebration.
            </p>
            <div className="flex items-center gap-4 text-white/60">
              <a href="https://www.instagram.com/ar_alphaya_jewellery/" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-white/40 hover:text-white" aria-label="Visit our Instagram">
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.9 224.1 370.9 339 319.6 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7 0-41.1 33.5-74.7 74.7-74.7 41.1 0 74.7 33.5 74.7 74.7 0 41.1-33.6 74.7-74.7 74.7zm146.4-194.3a26.6 26.6 0 1 1-26.6-26.6 26.6 26.6 0 0 1 26.6 26.6zm76.1 27.2c-1.7-35.7-9.9-67.3-36.2-93.5S352.6 63.9 316.9 62.2C280.4 60.5 167.6 60.5 131.1 62.2c-35.7 1.7-67.3 9.9-93.5 36.2S3.1 165.7 1.4 201.3c-1.7 36.5-1.7 149.3 0 185.8 1.7 35.7 9.9 67.3 36.2 93.5s57.8 34.5 93.5 36.2c36.5 1.7 149.3 1.7 185.8 0 35.7-1.7 67.3-9.9 93.5-36.2s34.5-57.8 36.2-93.5c1.7-36.5 1.7-149.3 0-185.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.7-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </a>
              <a href="https://wa.me/94774293406" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-white/40 hover:text-white" aria-label="Chat on WhatsApp">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.3em] text-white/50">Discover</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-white">About</Link></li>
              <li>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="transition-colors hover:text-white"
                  aria-label="Open size guide modal"
                >
                  Size Guide
                </button>
              </li>
              <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
              <li><Link href="/cart" className="transition-colors hover:text-white">Cart</Link></li>
              <li><Link href="/policies" className="transition-colors hover:text-white">Policies</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.3em] text-white/50">Collections</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/collections/rings" className="transition-colors hover:text-white">Rings</Link></li>
              <li><Link href="/collections/earrings" className="transition-colors hover:text-white">Earrings</Link></li>
              <li><Link href="/collections/pendants" className="transition-colors hover:text-white">Pendants</Link></li>
              <li><Link href="/collections/bracelets-bangles" className="transition-colors hover:text-white">Bracelets & Bangles</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.3em] text-white/50">Get in Touch</h3>
            <div className="space-y-3 text-sm text-white/70">
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:aralphayajewellery@gmail.com" className="transition-colors hover:text-white">Email Us</a>
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+94774293406" className="transition-colors hover:text-white">+94 77 429 3406</a>
              </p>
              <p className="text-xs">143/5 Rainbow Park, Temple Road,<br/>Kengalla 20186, Sri Lanka</p>
            </div>
            <a
              href="https://wa.me/94774293406?text=Hi!%20I'd%20like%20to%20discuss%20a%20custom%20piece"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.32em] text-white transition-all hover:bg-green-700"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row md:justify-between">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/policies#returns" className="transition-colors hover:text-white/80">Returns</Link>
            <Link href="/policies#privacy" className="transition-colors hover:text-white/80">Privacy</Link>
            <Link href="/policies#terms" className="transition-colors hover:text-white/80">Terms</Link>
            <Link href="/shipping" className="transition-colors hover:text-white/80">Shipping</Link>
          </div>
          <p className="text-center">© {new Date().getFullYear()} AR Alphaya Jewellery. All rights reserved.</p>
        </div>
      </div>
      
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </footer>
  )
}

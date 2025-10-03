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
              <a href="https://www.instagram.com/ar_alphaya_jewellery/" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-white/40 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.491-3.312-1.295-.301-.281-.301-.756.037-1.037.301-.244.756-.244 1.056.037.562.525 1.297.825 2.219.825 1.709 0 3.094-1.385 3.094-3.094s-1.385-3.094-3.094-3.094-3.094 1.385-3.094 3.094c0 .469.094.938.281 1.369.188.431-.037.938-.469 1.125-.431.188-.938-.037-1.125-.469-.281-.637-.431-1.297-.431-2.025 0-2.569 2.088-4.657 4.657-4.657s4.657 2.088 4.657 4.657-2.088 4.657-4.657 4.657z"/>
                </svg>
              </a>
              <a href="https://wa.me/94774293406" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-white/40 hover:text-white">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
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
            <h3 className="text-xs uppercase tracking-[0.3em] text-white/50">Boutique</h3>
            <div className="space-y-3 text-sm text-white/70">
              <p>aralphayajewellery@gmail.com</p>
              <p>+94 77 429 3406</p>
              <p>143/5 Rainbow Park, Temple Road,<br/>Kengalla 20186, Sri Lanka</p>
            </div>
            <Link
              href="https://wa.me/94774293406"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/80 transition-all hover:border-white/60 hover:text-white"
            >
              Book a Consultation
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row md:justify-between">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white/80">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-white/80">Terms of Service</Link>
            <Link href="/shipping" className="transition-colors hover:text-white/80">Shipping Policy</Link>
            <Link href="/returns" className="transition-colors hover:text-white/80">Return Policy</Link>
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

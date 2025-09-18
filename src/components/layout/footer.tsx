'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import SizeGuideModal from '@/components/product/SizeGuideModal'

export default function Footer() {
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image 
                src="/images/LOGO1.png" 
                alt="AR Alphaya Jewellery" 
                width={40} 
                height={45}
                loading="lazy"
                className="w-8 md:w-10 h-auto object-contain filter brightness-0 invert"
              />
              <span className="font-serif text-lg font-semibold text-white">AR Alphaya</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Fine jewelry and custom pieces crafted with precision and passion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/ar_alphaya_jewellery/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.491-3.312-1.295-.301-.281-.301-.756.037-1.037.301-.244.756-.244 1.056.037.562.525 1.297.825 2.219.825 1.709 0 3.094-1.385 3.094-3.094s-1.385-3.094-3.094-3.094-3.094 1.385-3.094 3.094c0 .469.094.938.281 1.369.188.431-.037.938-.469 1.125-.431.188-.938-.037-1.125-.469-.281-.637-.431-1.297-.431-2.025 0-2.569 2.088-4.657 4.657-4.657s4.657 2.088 4.657 4.657-2.088 4.657-4.657 4.657z"/>
                </svg>
              </a>
              <a href="https://wa.me/94774293406" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-100">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
              <li>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                  aria-label="Open size guide modal"
                >
                  Size Guide
                </button>
              </li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/cart" className="text-gray-300 hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-100">Collections</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/collections/rings" className="text-gray-300 hover:text-white transition-colors">Rings</Link></li>
              <li><Link href="/collections/earrings" className="text-gray-300 hover:text-white transition-colors">Earrings</Link></li>
              <li><Link href="/collections/pendants" className="text-gray-300 hover:text-white transition-colors">Pendants</Link></li>
              <li><Link href="/collections/bracelets-bangles" className="text-gray-300 hover:text-white transition-colors">Bracelets & Bangles</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-100">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Email: aralphayajewellery@gmail.com</p>
              <p>Phone: +94 77 429 3406</p>
              <p>Address: 143/5 Rainbow park, Temple road, Kengalla - 20186</p>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
              Shipping Policy
            </Link>
            <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
              Return Policy
            </Link>
          </div>
        </div>
        
        {/* Copyright at very bottom */}
        <div className="border-t border-gray-800 mt-6 pt-4 text-center">
          <p className="text-xs text-gray-500">
            © 2025 AR Alphaya Jewellery. All rights reserved.
          </p>
        </div>
      </div>
      
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </footer>
  )
}

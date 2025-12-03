'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  category?: string
}

export default function SizeGuideModal({ isOpen, onClose, category = 'rings' }: SizeGuideModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-deep-black/70 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-metal-gold/20 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] mx-auto my-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-metal-gold/20 bg-neutral-soft px-6 sm:px-8 py-5">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-deep-black">Find Your Ring Size</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-metal-gold/30 p-2 text-deep-black/70 transition-colors hover:border-metal-gold hover:text-deep-black hover:bg-white"
            aria-label="Close size guide"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Main Content */}
        <main className="space-y-8 sm:space-y-12 px-6 sm:px-8 py-8">
          {/* Measure Your Finger Section */}
          <section className="space-y-5">
            <h3 className="font-serif text-xl sm:text-2xl text-deep-black">Measure Your Finger</h3>
            
            {/* Image */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white border border-metal-gold/20">
              <Image
                src="/images/2024_SIZEGUIDE-Ring2-16x9.jpg"
                alt="How to measure your finger for ring size"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Instructions */}
            <ol className="space-y-4 text-deep-black leading-relaxed">
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-metal-gold text-white font-semibold text-sm">1</span>
                <span>Use a flexible measuring tape or length of string.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-metal-gold text-white font-semibold text-sm">2</span>
                <span>Wrap it around the finger you'll wear your ring on, if you're creating a ring stack, consider where on your finger the ring will sit. If using string, mark the point on the string where the ends meet with a pen.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-metal-gold text-white font-semibold text-sm">3</span>
                <span>Lay the string on a flat surface and use a ruler to measure the length (in inches or millimeters) up to the mark. Compare your measurement to the size chart to determine your ring size. If you are between sizes, opt for the larger size.</span>
              </li>
            </ol>
          </section>

          {/* Measure an Existing Ring Section */}
          <section className="space-y-5">
            <h3 className="font-serif text-xl sm:text-2xl text-deep-black">Measure an Existing Ring</h3>
            
            {/* Image */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white border border-metal-gold/20">
              <Image
                src="/images/2024_SIZEGUIDE-Ring1-16x9.jpg"
                alt="How to measure an existing ring for size"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Instructions */}
            <ol className="space-y-4 text-deep-black leading-relaxed">
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-metal-gold text-white font-semibold text-sm">1</span>
                <span>Choose a ring that already fits your finger well.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-metal-gold text-white font-semibold text-sm">2</span>
                <span>Measure the interior diameter of the ring in millimeters (mm).</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-metal-gold text-white font-semibold text-sm">3</span>
                <span>Use the measurement chart to match the size of your ring to the closest size in mm. The interior of the ring should align with the outer edge of the circle.</span>
              </li>
            </ol>
          </section>

          {/* Help Notice */}
          <div className="rounded-xl border border-metal-gold/30 bg-neutral-soft px-5 py-4 text-sm text-deep-black leading-relaxed">
            <p>
              <strong className="text-deep-black font-semibold">Need help?</strong> Our team is here to assist you with finding the perfect size. 
              Contact us via WhatsApp, phone, or email for personalized guidance.
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row gap-3 items-center justify-center border-t border-metal-gold/20 bg-neutral-soft px-6 sm:px-8 py-5">
          <a 
            href="mailto:info@aralphayajewellery.com" 
            className="w-full sm:w-auto text-center px-6 py-2.5 rounded-lg border border-metal-gold/30 text-sm font-medium text-deep-black hover:bg-white hover:border-metal-gold transition-colors"
          >
            Email Us
          </a>
          <a 
            href="tel:+94774293406" 
            className="w-full sm:w-auto text-center px-6 py-2.5 rounded-lg border border-metal-gold/30 text-sm font-medium text-deep-black hover:bg-white hover:border-metal-gold transition-colors"
          >
            Call Us
          </a>
          <a 
            href="https://wa.me/94774293406" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto text-center px-6 py-2.5 rounded-lg border border-metal-gold/30 text-sm font-medium text-deep-black hover:bg-white hover:border-metal-gold transition-colors"
          >
            WhatsApp Us
          </a>
        </footer>
      </div>
    </div>
  )
}

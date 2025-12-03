'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  category?: string
  selectedSize?: string
  onSelectSize?: (size: string) => void
  initialTab?: 'measure' | 'select'
}

const RING_SIZES = [
  { usa: '3', uk: 'F', diameter: '14.1', circumference: '44.2' },
  { usa: '3.5', uk: 'G½', diameter: '14.5', circumference: '45.5' },
  { usa: '4', uk: 'H½', diameter: '14.9', circumference: '46.8' },
  { usa: '4.5', uk: 'J', diameter: '15.3', circumference: '48.0' },
  { usa: '5', uk: 'K½', diameter: '15.7', circumference: '49.3' },
  { usa: '5.5', uk: 'L½', diameter: '16.1', circumference: '50.6' },
  { usa: '6', uk: 'M½', diameter: '16.5', circumference: '51.9' },
  { usa: '6.5', uk: 'O', diameter: '16.9', circumference: '53.1' },
  { usa: '7', uk: 'P', diameter: '17.3', circumference: '54.4' },
  { usa: '7.5', uk: 'Q½', diameter: '17.7', circumference: '55.7' },
  { usa: '8', uk: 'R½', diameter: '18.1', circumference: '57' },
]

export default function SizeGuideModal({ isOpen, onClose, category = 'rings', selectedSize, onSelectSize, initialTab = 'measure' }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'measure' | 'select'>(initialTab)
  useEffect(() => {
    if (!isOpen) {
      return
    }

    // Set active tab based on initialTab when modal opens
    setActiveTab(initialTab)

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
  }, [isOpen, onClose, initialTab])

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
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-metal-gold/20 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] mx-auto my-auto scrollbar-hide"
        onClick={(event) => event.stopPropagation()}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Header */}
        <header className="border-b border-metal-gold/20 bg-neutral-soft">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5">
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
          </div>
          
          {/* Tabs */}
          <div className="flex border-t border-metal-gold/10">
            <button
              onClick={() => setActiveTab('measure')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'measure'
                  ? 'text-deep-black border-b-2 border-metal-gold bg-white/50'
                  : 'text-deep-black/60 hover:text-deep-black hover:bg-white/30'
              }`}
            >
              How to Measure
            </button>
            <button
              onClick={() => setActiveTab('select')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'select'
                  ? 'text-deep-black border-b-2 border-metal-gold bg-white/50'
                  : 'text-deep-black/60 hover:text-deep-black hover:bg-white/30'
              }`}
            >
              Select Your Size
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 sm:px-8 py-8">
          {activeTab === 'measure' ? (
            <div className="space-y-8 sm:space-y-12">
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
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-deep-black mb-2">Select Your Size</h3>
                <p className="text-sm text-deep-black/70">Choose your ring size from the chart below</p>
              </div>
              
              {/* Size Chart Table */}
              <div className="overflow-x-auto rounded-xl border border-metal-gold/20">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-soft">
                    <tr className="border-b border-metal-gold/20">
                      <th className="px-4 py-3 text-left font-semibold text-deep-black">USA Standard</th>
                      <th className="px-4 py-3 text-left font-semibold text-deep-black">UK Standard</th>
                      <th className="px-4 py-3 text-left font-semibold text-deep-black">
                        <div>Interior Diameter /</div>
                        <div>Inside Circumference</div>
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-deep-black">Circumference (MM)</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {RING_SIZES.map((size, index) => (
                      <tr 
                        key={size.usa} 
                        className={`border-b border-metal-gold/10 last:border-0 hover:bg-neutral-soft/50 transition-colors ${
                          selectedSize === size.usa ? 'bg-metal-gold/10' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-deep-black">{size.usa}</td>
                        <td className="px-4 py-3 text-deep-black">{size.uk}</td>
                        <td className="px-4 py-3 text-deep-black">{size.diameter}</td>
                        <td className="px-4 py-3 text-deep-black">{size.circumference}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => onSelectSize?.(size.usa)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              selectedSize === size.usa
                                ? 'border-metal-gold bg-metal-gold'
                                : 'border-metal-gold/30 hover:border-metal-gold'
                            }`}
                            aria-label={`Select size ${size.usa}`}
                          >
                            {selectedSize === size.usa && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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

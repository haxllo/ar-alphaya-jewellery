'use client'

import { useEffect, useMemo } from 'react'
import { X, Ruler } from 'lucide-react'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  category?: string
}

const RING_SIZES = [
  { us: '5', uk: 'J', eu: '49', circumference: '15.7mm' },
  { us: '6', uk: 'L', eu: '52', circumference: '16.5mm' },
  { us: '7', uk: 'N', eu: '54', circumference: '17.3mm' },
  { us: '8', uk: 'P', eu: '57', circumference: '18.1mm' },
  { us: '9', uk: 'R', eu: '59', circumference: '19.0mm' },
]

const BRACELET_SIZES = [
  { label: 'Small', bracelet: '16-17cm', wrist: '14-15cm' },
  { label: 'Medium', bracelet: '18-19cm', wrist: '16-17cm' },
  { label: 'Large', bracelet: '20-21cm', wrist: '18-19cm' },
  { label: 'X-Large', bracelet: '22-23cm', wrist: '20-21cm' },
]

const CHAIN_LENGTHS = [
  { length: '35cm / 14″', label: 'Choker', description: 'Sits close to the neck' },
  { length: '40cm / 16″', label: 'Collarbone', description: 'Everyday classic length' },
  { length: '45cm / 18″', label: 'Princess', description: 'Falls just below the collarbone' },
  { length: '50cm / 20″', label: 'Matinee', description: 'Elegant for layering and high necklines' },
  { length: '60cm / 24″', label: 'Opera', description: 'Drapes below the bust line' },
]

export default function SizeGuideModal({ isOpen, onClose, category = 'rings' }: SizeGuideModalProps) {
  const ringSizes = useMemo(() => RING_SIZES, [])
  const braceletSizes = useMemo(() => BRACELET_SIZES, [])
  const chainLengths = useMemo(() => CHAIN_LENGTHS, [])

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

  const showRings = category === 'rings' || category === 'all'
  const showBracelets = category === 'bracelets-bangles' || category === 'all'
  const showNecklaces = category === 'pendants' || category === 'all'

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-nocturne-900/70 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-nocturne-200/60 bg-white/95 shadow-luxe mx-auto my-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-nocturne-100 bg-white/80 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-50/70 text-gold-600">
              <Ruler className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-nocturne-400">Bespoke Sizing</p>
              <h2 className="font-serif text-2xl text-nocturne-900">Size Guide</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-nocturne-100 p-2 text-nocturne-400 transition-colors hover:border-nocturne-200 hover:text-nocturne-700"
            aria-label="Close size guide"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <main className="space-y-10 px-6 py-8 text-nocturne-600">
          <p className="rounded-2xl border border-gold-100/60 bg-gold-50/50 px-5 py-4 text-sm text-nocturne-700">
            Measure at the end of the day for the most accurate fit. If you are between sizes we recommend selecting the larger size for enduring comfort.
          </p>

          {showRings && (
            <section className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-nocturne-500">Rings</p>
                  <h3 className="font-serif text-xl text-nocturne-900">Ring Size Conversion Chart</h3>
                </div>
                <p className="text-xs text-nocturne-400">
                  Wrap a ribbon around the base of your finger and compare the measurement below.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-nocturne-100">
                <table className="w-full border-separate border-spacing-0 text-sm">
                  <thead className="bg-nocturne-50/80 text-nocturne-500">
                    <tr>
                      {['US Size', 'UK Size', 'EU Size', 'Circumference'].map((label) => (
                        <th key={label} className="px-4 py-3 text-left font-semibold uppercase tracking-[0.15em] text-[0.68rem]">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ringSizes.map((size) => (
                      <tr key={size.us} className="border-t border-nocturne-100/80">
                        <td className="px-4 py-3 font-medium text-nocturne-800">{size.us}</td>
                        <td className="px-4 py-3 text-nocturne-700">{size.uk}</td>
                        <td className="px-4 py-3 text-nocturne-700">{size.eu}</td>
                        <td className="px-4 py-3 text-nocturne-700">{size.circumference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {showBracelets && (
            <section className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-nocturne-500">Bracelets</p>
                <h3 className="font-serif text-xl text-nocturne-900">Wrist Measurement Guide</h3>
              </div>
              <div className="grid gap-4 rounded-2xl border border-nocturne-100 bg-white/80 p-5 sm:grid-cols-2">
                {braceletSizes.map((size) => (
                  <div key={size.label} className="rounded-xl border border-nocturne-100/70 bg-white/70 p-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-nocturne-400">{size.label}</div>
                    <div className="mt-2 text-sm font-medium text-nocturne-800">Bracelet: {size.bracelet}</div>
                    <div className="text-xs text-nocturne-500">Fits wrist {size.wrist}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {showNecklaces && (
            <section className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-nocturne-500">Necklaces</p>
                <h3 className="font-serif text-xl text-nocturne-900">Chain Length Overview</h3>
              </div>
              <div className="space-y-3">
                {chainLengths.map((item) => (
                  <div key={item.length} className="flex flex-col gap-2 rounded-2xl border border-nocturne-100 bg-white/70 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-nocturne-800">{item.length}</div>
                      <div className="text-xs uppercase tracking-[0.3em] text-nocturne-400">{item.label}</div>
                    </div>
                    <p className="text-sm text-nocturne-600 md:text-right">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-3">
            <h3 className="font-semibold text-nocturne-800">Convert your measurement</h3>
            <div className="grid gap-4 rounded-2xl border border-nocturne-100 bg-white/70 p-5 md:grid-cols-3">
              {['US Size', 'UK Size', 'Circumference (mm)'].map((label) => (
                <div key={label}>
                  <label className="text-xs uppercase tracking-[0.3em] text-nocturne-400">{label}</label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-xl border border-nocturne-100 bg-white/80 px-3 py-2 text-sm text-nocturne-700 placeholder:text-nocturne-300 focus:border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-100"
                    placeholder="Tap to enter"
                    aria-label={label}
                  />
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="flex flex-col gap-3 border-t border-nocturne-100 bg-white/85 px-6 py-5 text-sm text-nocturne-500 md:flex-row md:items-center md:justify-between">
          <div>
            Unsure after measuring? Our concierge team will assist via WhatsApp or email with bespoke guidance.
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-nocturne-500">
            <a href="mailto:aralphayajewellery@gmail.com" className="rounded-full border border-nocturne-200 px-4 py-2 hover:border-gold-300 hover:text-nocturne-800">
              Email Concierge
            </a>
            <a href="https://wa.me/94774293406" target="_blank" rel="noopener noreferrer" className="rounded-full border border-nocturne-200 px-4 py-2 hover:border-gold-300 hover:text-nocturne-800">
              WhatsApp Us
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

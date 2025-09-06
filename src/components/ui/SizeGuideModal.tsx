'use client'

import { useState, useEffect } from 'react'
import { X, Ruler } from 'lucide-react'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  category?: string
}

export default function SizeGuideModal({ isOpen, onClose, category = 'rings' }: SizeGuideModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const ringSizes = [
    { us: '5', uk: 'J', eu: '49', circumference: '15.7mm' },
    { us: '6', uk: 'L', eu: '52', circumference: '16.5mm' },
    { us: '7', uk: 'N', eu: '54', circumference: '17.3mm' },
    { us: '8', uk: 'P', eu: '57', circumference: '18.1mm' },
    { us: '9', uk: 'R', eu: '59', circumference: '19.0mm' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ruler className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-primary-800">Size Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Ring Sizing */}
          {(category === 'rings' || category === 'all') && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary-800">Ring Size Guide</h3>
              
              <div className="mb-4 p-4 bg-primary-50 rounded-lg">
                <h4 className="font-medium mb-2 text-primary-700">How to Measure Your Ring Size</h4>
                <ol className="list-decimal list-inside text-sm text-primary-600 space-y-2">
                  <li>Wrap a string or paper around the base of your finger</li>
                  <li>Mark where the string/paper overlaps with a pen</li>
                  <li>Measure the length with a ruler (in mm)</li>
                  <li>Compare with the chart below to find your size</li>
                </ol>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-primary-200">
                  <thead>
                    <tr className="bg-primary-100">
                      <th className="border border-primary-200 px-3 py-2 text-sm font-semibold">US Size</th>
                      <th className="border border-primary-200 px-3 py-2 text-sm font-semibold">UK Size</th>
                      <th className="border border-primary-200 px-3 py-2 text-sm font-semibold">EU Size</th>
                      <th className="border border-primary-200 px-3 py-2 text-sm font-semibold">Circumference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ringSizes.map((size, index) => (
                      <tr key={index} className="hover:bg-primary-50">
                        <td className="border border-primary-200 px-3 py-2 text-sm text-center">{size.us}</td>
                        <td className="border border-primary-200 px-3 py-2 text-sm text-center">{size.uk}</td>
                        <td className="border border-primary-200 px-3 py-2 text-sm text-center">{size.eu}</td>
                        <td className="border border-primary-200 px-3 py-2 text-sm text-center">{size.circumference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bracelet Sizing */}
          {(category === 'bracelets-bangles' || category === 'all') && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary-800">Bracelet Size Guide</h3>
              
              <div className="mb-4 p-4 bg-primary-50 rounded-lg">
                <h4 className="font-medium mb-2 text-primary-700">How to Measure Your Wrist</h4>
                <ol className="list-decimal list-inside text-sm text-primary-600 space-y-2">
                  <li>Use a flexible measuring tape or string</li>
                  <li>Wrap around your wrist just below the wrist bone</li>
                  <li>Add 1.5-2cm for comfort</li>
                  <li>This is your ideal bracelet length</li>
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 border border-primary-200 rounded">
                  <div className="font-medium">Small: 16-17cm</div>
                  <div className="text-primary-600">Wrist 14-15cm</div>
                </div>
                <div className="p-3 border border-primary-200 rounded">
                  <div className="font-medium">Medium: 18-19cm</div>
                  <div className="text-primary-600">Wrist 16-17cm</div>
                </div>
                <div className="p-3 border border-primary-200 rounded">
                  <div className="font-medium">Large: 20-21cm</div>
                  <div className="text-primary-600">Wrist 18-19cm</div>
                </div>
                <div className="p-3 border border-primary-200 rounded">
                  <div className="font-medium">X-Large: 22-23cm</div>
                  <div className="text-primary-600">Wrist 20-21cm</div>
                </div>
              </div>
            </div>
          )}

          {/* Chain Length Guide */}
          {(category === 'pendants' || category === 'all') && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary-800">Chain Length Guide</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 border border-primary-200 rounded">
                  <div className="font-medium">14" (35cm)</div>
                  <div className="text-primary-600">Choker length</div>
                </div>
                <div className="flex justify-between items-center p-3 border border-primary-200 rounded">
                  <div className="font-medium">16" (40cm)</div>
                  <div className="text-primary-600">At the collarbone</div>
                </div>
                <div className="flex justify-between items-center p-3 border border-primary-200 rounded">
                  <div className="font-medium">18" (45cm)</div>
                  <div className="text-primary-600">Just below the collarbone</div>
                </div>
                <div className="flex justify-between items-center p-3 border border-primary-200 rounded">
                  <div className="font-medium">20" (50cm)</div>
                  <div className="text-primary-600">At the neckline</div>
                </div>
                <div className="flex justify-between items-center p-3 border border-primary-200 rounded">
                  <div className="font-medium">24" (60cm)</div>
                  <div className="text-primary-600">Below the neckline</div>
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-4 text-xs text-primary-500">
            <p>Need help finding your size? Contact us for personalized assistance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

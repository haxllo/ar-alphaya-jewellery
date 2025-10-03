export { default } from '@/components/ui/SizeGuideModal'
'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  productType?: 'rings' | 'bracelets' | 'necklaces' | 'earrings'
}

export default function SizeGuideModal({ 
  isOpen, 
  onClose, 
  productType = 'rings' 
}: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'chart' | 'measure' | 'convert'>('chart')

  if (!isOpen) return null

  const ringSizes = [
    { us: '4', uk: 'H', circumference: '46.8mm', diameter: '14.9mm' },
    { us: '4.5', uk: 'I', circumference: '48.0mm', diameter: '15.3mm' },
    { us: '5', uk: 'J', circumference: '49.3mm', diameter: '15.7mm' },
    { us: '5.5', uk: 'K', circumference: '50.6mm', diameter: '16.1mm' },
    { us: '6', uk: 'L', circumference: '51.8mm', diameter: '16.5mm' },
    { us: '6.5', uk: 'M', circumference: '53.1mm', diameter: '16.9mm' },
    { us: '7', uk: 'N', circumference: '54.4mm', diameter: '17.3mm' },
    { us: '7.5', uk: 'O', circumference: '55.6mm', diameter: '17.7mm' },
    { us: '8', uk: 'P', circumference: '56.9mm', diameter: '18.1mm' },
    { us: '8.5', uk: 'Q', circumference: '58.2mm', diameter: '18.5mm' },
    { us: '9', uk: 'R', circumference: '59.4mm', diameter: '18.9mm' },
    { us: '9.5', uk: 'S', circumference: '60.7mm', diameter: '19.3mm' },
    { us: '10', uk: 'T', circumference: '62.0mm', diameter: '19.7mm' }
  ]

  const braceletSizes = [
    { size: 'XS', circumference: '15-16cm', wrist: '13-14cm' },
    { size: 'S', circumference: '17-18cm', wrist: '15-16cm' },
    { size: 'M', circumference: '19-20cm', wrist: '17-18cm' },
    { size: 'L', circumference: '21-22cm', wrist: '19-20cm' },
    { size: 'XL', circumference: '23-24cm', wrist: '21-22cm' }
  ]

  const necklaceLengths = [
    { length: '35-40cm', name: 'Choker', description: 'Sits close to the neck' },
    { length: '40-45cm', name: 'Princess', description: 'Falls to collarbone' },
    { length: '45-55cm', name: 'Matinee', description: 'Falls to bust line' },
    { length: '55-65cm', name: 'Opera', description: 'Falls below bust line' },
    { length: '65cm+', name: 'Rope', description: 'Long necklace for layering' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Size Guide</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('chart')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'chart'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Size Chart
            </button>
            <button
              onClick={() => setActiveTab('measure')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'measure'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              How to Measure
            </button>
            <button
              onClick={() => setActiveTab('convert')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'convert'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Size Converter
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'chart' && (
            <div className="space-y-8">
              {(productType === 'rings' || !productType) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ring Sizes</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">US Size</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">UK Size</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Circumference</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Diameter</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {ringSizes.map((size, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-900">{size.us}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{size.uk}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{size.circumference}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{size.diameter}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {productType === 'bracelets' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Bracelet Sizes</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Size</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Bracelet Length</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Wrist Size</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {braceletSizes.map((size, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-900">{size.size}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{size.circumference}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{size.wrist}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {productType === 'necklaces' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Necklace Lengths</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Length</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Style Name</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {necklaceLengths.map((length, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-900">{length.length}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{length.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{length.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'measure' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">How to Measure for Rings</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Method 1: Measure an Existing Ring</h4>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li>1. Take a ring that fits the intended finger perfectly</li>
                      <li>2. Measure the inside diameter of the ring in millimeters</li>
                      <li>3. Use our size chart to find the corresponding size</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Method 2: Measure Your Finger</h4>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li>1. Wrap a string or paper strip around your finger</li>
                      <li>2. Mark where the string/paper overlaps</li>
                      <li>3. Measure the length in millimeters</li>
                      <li>4. Use the circumference column in our size chart</li>
                    </ol>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Pro Tips:</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Measure at the end of the day when fingers are largest</li>
                    <li>• Consider the width of the ring - wider bands need larger sizes</li>
                    <li>• If between sizes, choose the larger size for comfort</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">How to Measure for Bracelets</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Wrist Measurement</h4>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li>1. Wrap a flexible measuring tape around your wrist</li>
                      <li>2. Place it where you normally wear bracelets</li>
                      <li>3. Add 2-3cm for comfortable fit</li>
                      <li>4. Use our bracelet size chart</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">String Method</h4>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li>1. Wrap a string around your wrist</li>
                      <li>2. Mark where it overlaps</li>
                      <li>3. Measure the string length</li>
                      <li>4. Add 2-3cm for comfortable movement</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">How to Choose Necklace Length</h3>
                <div className="space-y-4 text-sm text-gray-700">
                  <p><strong>Choker (35-40cm):</strong> Sits close to the neck, great for high necklines</p>
                  <p><strong>Princess (40-45cm):</strong> Falls to the collarbone, most versatile length</p>
                  <p><strong>Matinee (45-55cm):</strong> Falls to the bust line, perfect for business attire</p>
                  <p><strong>Opera (55-65cm):</strong> Falls below the bust, elegant for evening wear</p>
                  <p><strong>Rope (65cm+):</strong> Very long, can be doubled or knotted for variety</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'convert' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">International Size Conversion</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700 mb-2">
                    Enter your ring size in any system to see conversions:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">US Size</label>
                      <input 
                        type="text" 
                        placeholder="e.g., 7"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">UK Size</label>
                      <input 
                        type="text" 
                        placeholder="e.g., N"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Circumference (mm)</label>
                      <input 
                        type="text" 
                        placeholder="e.g., 54.4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Common Size Conversions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-3">US to UK Ring Sizes</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>US 5</span><span>UK J</span></div>
                      <div className="flex justify-between"><span>US 6</span><span>UK L</span></div>
                      <div className="flex justify-between"><span>US 7</span><span>UK N</span></div>
                      <div className="flex justify-between"><span>US 8</span><span>UK P</span></div>
                      <div className="flex justify-between"><span>US 9</span><span>UK R</span></div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Measurement Units</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>• 1 inch = 25.4 millimeters</p>
                      <p>• 1 centimeter = 10 millimeters</p>
                      <p>• Ring sizing typically uses millimeters</p>
                      <p>• Bracelet sizing uses centimeters</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Still unsure about sizing? Contact our experts at{' '}
              <a href="mailto:aralphayajewellery@gmail.com" className="text-blue-600 hover:text-blue-700">aralphayajewellery@gmail.com</a>
              {' '}or{' '}
              <a href="tel:+94774293406" className="text-blue-600 hover:text-blue-700">+94 77 429 3406</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

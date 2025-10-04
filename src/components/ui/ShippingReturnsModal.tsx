'use client'

import { useEffect } from 'react'
import { X, Truck, RotateCcw, Shield, Clock } from 'lucide-react'

interface ShippingReturnsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShippingReturnsModal({ isOpen, onClose }: ShippingReturnsModalProps) {
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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-primary-800">Shipping & Returns</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Shipping Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-primary-800">Shipping Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary-600" />
                  <h4 className="font-medium text-primary-700">Delivery Times</h4>
                </div>
                <div className="text-sm text-primary-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Bench time:</span>
                    <span className="font-medium">4–6 weeks (made to order)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sri Lanka transit:</span>
                    <span className="font-medium">2–4 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>International transit:</span>
                    <span className="font-medium">Quoted per destination</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-primary-200 rounded-lg">
                  <h4 className="font-medium mb-2 text-primary-700">Domestic Courier</h4>
                  <p className="text-sm text-primary-600">Tracked courier delivery across Sri Lanka with signature on arrival. Flat rate of LKR 750.</p>
                </div>
                <div className="p-4 border border-primary-200 rounded-lg">
                  <h4 className="font-medium mb-2 text-primary-700">Studio Collection</h4>
                  <p className="text-sm text-primary-600">Pick up from the Kandy studio or request a handover in Kandy city by appointment.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium mb-2 text-amber-800">Custom Orders</h4>
                <p className="text-sm text-amber-700">All pieces are handcrafted to order. We will email check-ins at key stages and confirm dispatch dates once polishing is complete.</p>
              </div>
            </div>
          </div>

          {/* Returns Policy */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-primary-800">Returns Policy</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium mb-2 text-green-800">Return Policy</h4>
                <p className="text-sm text-green-700 mb-2">
                  Because each commission is custom made, finished pieces are non-refundable. Adjustments such as resizing or chain length alterations are complimentary within 14 days of delivery.
                </p>
                <p className="text-sm text-green-700">
                  Ready-to-ship items (when listed) may be returned within 7 days in original, unworn condition. Return courier fees are the customer’s responsibility.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-primary-200 rounded-lg">
                  <h4 className="font-medium mb-2 text-primary-700">Complimentary Adjustments</h4>
                  <ul className="text-sm text-primary-600 space-y-1">
                    <li>• Ring resizing within one size (where design allows)</li>
                    <li>• Chain length adjustments or extender fittings</li>
                    <li>• Minor polishing or finishing touch-ups</li>
                    <li>• Support with safe care and storage</li>
                  </ul>
                </div>
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <h4 className="font-medium mb-2 text-red-700">Not Eligible</h4>
                  <ul className="text-sm text-red-600 space-y-1">
                    <li>• Completed bespoke and personalised pieces</li>
                    <li>• Earrings once worn (for hygiene reasons)</li>
                    <li>• Items showing wear or accidental damage</li>
                    <li>• Sale or sample items marked final sale</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Warranty & Care */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-primary-800">Warranty & Care</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <h4 className="font-medium mb-2 text-primary-700">Care Guarantee</h4>
                <p className="text-sm text-primary-600">
                  Every piece is inspected before it leaves the studio. If you notice a craftsmanship issue within 90 days of delivery, please get in touch and it will be repaired at no additional cost.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 border border-primary-200 rounded">
                  <div className="font-medium mb-1">Complimentary clean</div>
                  <div className="text-primary-600">One free clean and polish within six months of delivery.</div>
                </div>
                <div className="p-3 border border-primary-200 rounded">
                  <div className="font-medium mb-1">Repair service</div>
                  <div className="text-primary-600">Future repairs and restorations are quoted individually.</div>
                </div>
                <div className="p-3 border border-primary-200 rounded">
                  <div className="font-medium mb-1">Materials</div>
                  <div className="text-primary-600">Each order includes a care card detailing metals and gemstones used.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h4 className="font-medium mb-3 text-primary-700">Questions about shipping or returns?</h4>
            <div className="space-y-2 text-sm text-primary-600">
              <p>Contact us at: <span className="font-medium">aralphayajewellery@gmail.com</span></p>
              <p>WhatsApp: <span className="font-medium">+94 77 429 3406</span></p>
              <p>Visit our store: <span className="font-medium">143/5 Rainbow park, Temple road, Kengalla - 20186</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

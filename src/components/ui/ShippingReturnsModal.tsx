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
                    <span>Colombo & Suburbs:</span>
                    <span className="font-medium">1-2 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Cities in Sri Lanka:</span>
                    <span className="font-medium">3-5 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remote Areas:</span>
                    <span className="font-medium">5-7 business days</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-primary-200 rounded-lg">
                  <h4 className="font-medium mb-2 text-primary-700">Free Shipping</h4>
                  <p className="text-sm text-primary-600">Orders over LKR 50,000 qualify for free shipping island-wide.</p>
                </div>
                <div className="p-4 border border-primary-200 rounded-lg">
                  <h4 className="font-medium mb-2 text-primary-700">Express Delivery</h4>
                  <p className="text-sm text-primary-600">Same-day delivery available in Colombo for orders placed before 2 PM.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium mb-2 text-amber-800">Custom Orders</h4>
                <p className="text-sm text-amber-700">Custom jewelry pieces require 2-3 weeks for crafting and delivery.</p>
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
                <h4 className="font-medium mb-2 text-green-800">30-Day Return Window</h4>
                <p className="text-sm text-green-700 mb-2">
                  We offer a 30-day return policy for most items. Items must be returned in original condition with all packaging and certificates.
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Unworn and unaltered condition</li>
                  <li>• Original packaging and authentication certificates</li>
                  <li>• Return initiated within 30 days of delivery</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-primary-200 rounded-lg">
                  <h4 className="font-medium mb-2 text-primary-700">Eligible for Return</h4>
                  <ul className="text-sm text-primary-600 space-y-1">
                    <li>• Rings, earrings, pendants</li>
                    <li>• Bracelets and bangles</li>
                    <li>• Items with original tags</li>
                    <li>• Non-personalized jewelry</li>
                  </ul>
                </div>
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <h4 className="font-medium mb-2 text-red-700">Not Eligible</h4>
                  <ul className="text-sm text-red-600 space-y-1">
                    <li>• Custom/personalized items</li>
                    <li>• Pierced earrings (hygiene)</li>
                    <li>• Items worn or damaged</li>
                    <li>• Sale items (final sale)</li>
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
                <h4 className="font-medium mb-2 text-primary-700">Lifetime Warranty</h4>
                <p className="text-sm text-primary-600">
                  All AR Alphaya jewelry comes with a lifetime warranty covering manufacturing defects. 
                  This includes loose stones, broken clasps, and structural issues under normal wear.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 border border-primary-200 rounded">
                  <div className="font-medium mb-1">Free Cleaning</div>
                  <div className="text-primary-600">Bring your jewelry for professional cleaning anytime</div>
                </div>
                <div className="p-3 border border-primary-200 rounded">
                  <div className="font-medium mb-1">Repair Service</div>
                  <div className="text-primary-600">Professional repair and restoration services available</div>
                </div>
                <div className="p-3 border border-primary-200 rounded">
                  <div className="font-medium mb-1">Authenticity</div>
                  <div className="text-primary-600">All pieces come with authenticity certificates</div>
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

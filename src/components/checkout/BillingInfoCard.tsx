'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Phone, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CustomerInfo, ValidationErrors, TouchedFields } from './checkout-types'

interface BillingInfoCardProps {
  customerInfo: CustomerInfo
  errors: ValidationErrors
  touched: TouchedFields
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
}

export default function BillingInfoCard({
  customerInfo,
  errors,
  touched,
  onChange,
  onBlur,
}: BillingInfoCardProps) {
  const hasError = (field: keyof CustomerInfo) => {
    return !!(errors[field] && touched[field])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Full Name</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={customerInfo.firstName}
                onChange={onChange}
                onBlur={onBlur}
                required
                autoComplete="given-name"
                className={cn(
                  hasError('firstName') &&
                    "border-red-500 bg-red-50 focus-visible:ring-red-500"
                )}
                aria-invalid={hasError('firstName')}
                aria-describedby={hasError('firstName') ? "firstName-error" : undefined}
              />
              {hasError('firstName') && (
                <p id="firstName-error" className="text-xs text-red-600">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={customerInfo.lastName}
                onChange={onChange}
                onBlur={onBlur}
                required
                autoComplete="family-name"
                className={cn(
                  hasError('lastName') &&
                    "border-red-500 bg-red-50 focus-visible:ring-red-500"
                )}
                aria-invalid={hasError('lastName')}
                aria-describedby={hasError('lastName') ? "lastName-error" : undefined}
              />
              {hasError('lastName') && (
                <p id="lastName-error" className="text-xs text-red-600">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Mail className="h-4 w-4" />
            Contact Information
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={customerInfo.email}
                onChange={onChange}
                onBlur={onBlur}
                required
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                className={cn(
                  hasError('email') &&
                    "border-red-500 bg-red-50 focus-visible:ring-red-500"
                )}
                aria-invalid={hasError('email')}
                aria-describedby={hasError('email') ? "email-error" : undefined}
              />
              {hasError('email') && (
                <p id="email-error" className="text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={onChange}
                onBlur={onBlur}
                required
                autoComplete="tel"
                inputMode="tel"
                placeholder="+94 or 07x"
                className={cn(
                  hasError('phone') &&
                    "border-red-500 bg-red-50 focus-visible:ring-red-500"
                )}
                aria-invalid={hasError('phone')}
                aria-describedby={hasError('phone') ? "phone-error" : undefined}
              />
              {hasError('phone') && (
                <p id="phone-error" className="text-xs text-red-600">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Shipping Address */}
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4" />
            Shipping Address
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor="address">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={customerInfo.address}
              onChange={onChange}
              onBlur={onBlur}
              required
              autoComplete="street-address"
              placeholder="House number and street name"
              className={cn(
                hasError('address') &&
                  "border-red-500 bg-red-50 focus-visible:ring-red-500"
              )}
              aria-invalid={hasError('address')}
              aria-describedby={hasError('address') ? "address-error" : undefined}
            />
            {hasError('address') && (
              <p id="address-error" className="text-xs text-red-600">
                {errors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={customerInfo.city}
                onChange={onChange}
                onBlur={onBlur}
                required
                autoComplete="address-level2"
                className={cn(
                  hasError('city') &&
                    "border-red-500 bg-red-50 focus-visible:ring-red-500"
                )}
                aria-invalid={hasError('city')}
                aria-describedby={hasError('city') ? "city-error" : undefined}
              />
              {hasError('city') && (
                <p id="city-error" className="text-xs text-red-600">
                  {errors.city}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                type="text"
                value={customerInfo.postalCode || ''}
                onChange={onChange}
                autoComplete="postal-code"
                inputMode="numeric"
                placeholder="00000"
                maxLength={5}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

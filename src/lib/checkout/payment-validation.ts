// Payment and checkout form validation utilities

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode?: string
}

export interface ValidationErrors {
  [key: string]: string
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate Sri Lankan phone number
 * Accepts: +94xxxxxxxxx, 94xxxxxxxxx, 07xxxxxxxx, 7xxxxxxxx
 */
export const isValidSriLankanPhone = (phone: string): boolean => {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '')
  
  // Check various formats
  const patterns = [
    /^\+94\d{9}$/,      // +94xxxxxxxxx
    /^94\d{9}$/,        // 94xxxxxxxxx
    /^0\d{9}$/,         // 0xxxxxxxxx
    /^7\d{8}$/,         // 7xxxxxxxx (without 0)
  ]
  
  return patterns.some(pattern => pattern.test(cleaned))
}

/**
 * Validate postal code (optional field)
 * Sri Lankan postal codes are typically 5 digits
 */
export const isValidPostalCode = (postalCode: string): boolean => {
  if (!postalCode) return true // Optional field
  const cleaned = postalCode.replace(/\s/g, '')
  return /^\d{5}$/.test(cleaned)
}

/**
 * Validate customer information
 */
export const validateCustomerInfo = (info: CustomerInfo): ValidationErrors => {
  const errors: ValidationErrors = {}

  // First name validation
  if (!info.firstName || info.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters'
  } else if (info.firstName.length > 50) {
    errors.firstName = 'First name must be less than 50 characters'
  }

  // Last name validation
  if (!info.lastName || info.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters'
  } else if (info.lastName.length > 50) {
    errors.lastName = 'Last name must be less than 50 characters'
  }

  // Email validation
  if (!info.email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(info.email)) {
    errors.email = 'Please enter a valid email address'
  }

  // Phone validation
  if (!info.phone) {
    errors.phone = 'Phone number is required'
  } else if (!isValidSriLankanPhone(info.phone)) {
    errors.phone = 'Please enter a valid Sri Lankan phone number (e.g., +94xxxxxxxxx or 07xxxxxxxx)'
  }

  // Address validation
  if (!info.address || info.address.trim().length < 10) {
    errors.address = 'Address must be at least 10 characters'
  } else if (info.address.length > 200) {
    errors.address = 'Address must be less than 200 characters'
  }

  // City validation
  if (!info.city || info.city.trim().length < 2) {
    errors.city = 'City is required'
  } else if (info.city.length > 50) {
    errors.city = 'City name must be less than 50 characters'
  }

  // Postal code validation (optional)
  if (info.postalCode && !isValidPostalCode(info.postalCode)) {
    errors.postalCode = 'Please enter a valid postal code (5 digits)'
  }

  return errors
}

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[\s-]/g, '')
  
  if (cleaned.startsWith('+94')) {
    return cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 5) + ' ' + cleaned.slice(5)
  } else if (cleaned.startsWith('94')) {
    return '+' + cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4)
  } else if (cleaned.startsWith('0')) {
    return cleaned.slice(0, 3) + ' ' + cleaned.slice(3)
  }
  
  return phone
}

/**
 * Normalize phone number for storage
 * Converts to +94xxxxxxxxx format
 */
export const normalizePhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[\s-]/g, '')
  
  if (cleaned.startsWith('+94')) {
    return cleaned
  } else if (cleaned.startsWith('94')) {
    return '+' + cleaned
  } else if (cleaned.startsWith('0')) {
    return '+94' + cleaned.slice(1)
  } else if (cleaned.startsWith('7')) {
    return '+94' + cleaned
  }
  
  return phone
}

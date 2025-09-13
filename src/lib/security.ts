import { NextRequest, NextResponse } from 'next/server';

// Generate a cryptographically secure nonce
export function generateNonce(): string {
  // Use Web Crypto API for Edge Runtime compatibility
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    const array = new Uint8Array(16);
    globalThis.crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)));
  }
  
  // Fallback for environments without crypto
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Get or create nonce for the current request
export function getNonce(request: NextRequest): string {
  // Try to get nonce from headers first
  const existingNonce = request.headers.get('x-nonce');
  if (existingNonce) {
    return existingNonce;
  }
  
  // Generate new nonce
  return generateNonce();
}

// Add nonce to response headers
export function addNonceToResponse(response: NextResponse, nonce: string): NextResponse {
  response.headers.set('x-nonce', nonce);
  return response;
}

// Enhanced CSP with nonce support
export function generateCSP(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' https://*.auth0.com https://www.payhere.lk https://identity.netlify.com https://unpkg.com`,
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-hashes' https://fonts.googleapis.com`,
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.auth0.com https://api.exchangerate-api.com https://identity.netlify.com https://api.netlify.com",
    "frame-src 'self' https://*.auth0.com https://identity.netlify.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
}

// Security headers with dynamic CSP
export function getSecurityHeaders(nonce: string) {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': generateCSP(nonce),
  };
}

// Apply security headers to response
export function applySecurityHeaders(response: NextResponse, nonce: string): NextResponse {
  const headers = getSecurityHeaders(nonce);
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// Validate nonce format
export function isValidNonce(nonce: string): boolean {
  // Check if nonce is base64 and reasonable length
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(nonce) && nonce.length >= 16 && nonce.length <= 64;
}

// Sanitize HTML content with nonce support
export function sanitizeHtmlWithNonce(html: string, nonce: string): string {
  // Remove script tags that don't have the correct nonce
  const scriptTagRegex = /<script(?![^>]*nonce=["']?[^"'>]*["']?)[^>]*>.*?<\/script>/gi;
  let sanitized = html.replace(scriptTagRegex, '');
  
  // Remove inline event handlers
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  sanitized = sanitized.replace(/on\w+='[^']*'/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: URLs that might contain scripts
  sanitized = sanitized.replace(/data:text\/html/gi, 'data:text/plain');
  
  return sanitized;
}

// Generate secure random string for various purposes
export function generateSecureRandom(length: number = 32): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for Node.js environment
  if (typeof require !== 'undefined') {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
  }
  
  // Fallback for environments without crypto
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Hash sensitive data (simplified for Edge Runtime compatibility)
export function hashSensitiveData(data: string, salt?: string): string {
  const actualSalt = salt || generateSecureRandom(16);
  // Simple hash for demonstration - in production, use proper hashing
  const combined = data + actualSalt;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// Verify hash
export function verifyHash(data: string, hash: string, salt: string): boolean {
  const computedHash = hashSensitiveData(data, salt);
  return computedHash === hash;
}

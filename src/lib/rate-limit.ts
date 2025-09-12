import { NextRequest, NextResponse } from 'next/server';
import { logRateLimitViolation, logInvalidInput } from './logger';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: {
    general: 100,      // General API requests
    auth: 10,          // Authentication requests
    payment: 5,        // Payment requests
    upload: 20,        // File upload requests
    contact: 3,        // Contact form submissions
  },
};

// In-memory store for rate limiting (in production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limiting middleware
export function rateLimit(
  request: NextRequest,
  type: keyof typeof RATE_LIMIT_CONFIG.maxRequests = 'general'
): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const windowMs = RATE_LIMIT_CONFIG.windowMs;
  const maxRequests = RATE_LIMIT_CONFIG.maxRequests[type];
  
  // Get or create rate limit entry
  const entry = requestCounts.get(ip) || { count: 0, resetTime: now + windowMs };
  
  // Reset if window has expired
  if (now > entry.resetTime) {
    entry.count = 0;
    entry.resetTime = now + windowMs;
  }
  
  // Check if limit exceeded
  if (entry.count >= maxRequests) {
    // Log rate limit violation
    logRateLimitViolation(
      request.nextUrl.pathname,
      { 
        ip, 
        count: entry.count, 
        maxRequests, 
        windowMs: RATE_LIMIT_CONFIG.windowMs 
      },
      request
    );
    
    return NextResponse.json(
      { 
        error: 'Too many requests', 
        message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000 / 60} minutes.`,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString(),
        }
      }
    );
  }
  
  // Increment counter
  entry.count++;
  requestCounts.set(ip, entry);
  
  // Add rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', (maxRequests - entry.count).toString());
  response.headers.set('X-RateLimit-Reset', entry.resetTime.toString());
  
  return null; // Allow request to continue
}

// Enhanced CORS configuration
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://aralphaya.netlify.app' 
    : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Nonce, X-CSRF-Token',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Access-Control-Expose-Headers': 'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset',
};

// CORS middleware
export function handleCORS(request: NextRequest): NextResponse | null {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  
  return null; // Allow request to continue
}

// Enhanced request size limiting with different limits for different endpoints
export function limitRequestSize(request: NextRequest, endpointType: 'general' | 'upload' | 'api' = 'general'): NextResponse | null {
  const sizeLimits = {
    general: 1024 * 1024,      // 1MB for general requests
    upload: 10 * 1024 * 1024,  // 10MB for file uploads
    api: 512 * 1024,           // 512KB for API requests
  };
  
  const maxSize = sizeLimits[endpointType];
  const contentLength = request.headers.get('content-length');
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    return NextResponse.json(
      { 
        error: 'Request too large', 
        message: `Request size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB for ${endpointType} endpoints` 
      },
      { 
        status: 413,
        headers: {
          'Retry-After': '60', // Suggest retry after 60 seconds
        }
      }
    );
  }
  
  return null; // Allow request to continue
}

// Validate request headers
export function validateRequestHeaders(request: NextRequest): NextResponse | null {
  const userAgent = request.headers.get('user-agent');
  const contentType = request.headers.get('content-type');
  
  // Block requests without user agent (likely bots)
  if (!userAgent || userAgent.length < 10) {
    logInvalidInput(
      'missing_user_agent',
      { userAgent, ip: request.headers.get('x-forwarded-for') || 'unknown' },
      request
    );
    
    return NextResponse.json(
      { error: 'Invalid request headers' },
      { status: 400 }
    );
  }
  
  // Validate content type for POST requests
  if (request.method === 'POST' && contentType) {
    const allowedContentTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain'
    ];
    
    const isValidContentType = allowedContentTypes.some(type => 
      contentType.toLowerCase().includes(type)
    );
    
    if (!isValidContentType) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }
  }
  
  return null; // Allow request to continue
}

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

// Apply security headers
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// Enhanced combined security middleware
export function securityMiddleware(
  request: NextRequest,
  options: {
    rateLimitType?: keyof typeof RATE_LIMIT_CONFIG.maxRequests;
    endpointType?: 'general' | 'upload' | 'api';
    requireAuth?: boolean;
  } = {}
): NextResponse | null {
  // Handle CORS
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;
  
  // Validate request headers
  const headerValidationResponse = validateRequestHeaders(request);
  if (headerValidationResponse) return headerValidationResponse;
  
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request, options.rateLimitType);
  if (rateLimitResponse) return rateLimitResponse;
  
  // Limit request size based on endpoint type
  const sizeLimitResponse = limitRequestSize(request, options.endpointType);
  if (sizeLimitResponse) return sizeLimitResponse;
  
  return null; // Allow request to continue
}

// Cleanup old rate limit entries (call periodically)
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [ip, entry] of requestCounts.entries()) {
    if (now > entry.resetTime) {
      requestCounts.delete(ip);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

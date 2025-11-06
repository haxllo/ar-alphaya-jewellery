import { NextRequest, NextResponse } from 'next/server';
import { generateSecureRandom } from './security';

// CSRF token storage (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>();

// Generate CSRF token
export function generateCSRFToken(sessionId: string): string {
  const token = generateSecureRandom(32);
  const expires = Date.now() + (15 * 60 * 1000); // 15 minutes
  
  csrfTokens.set(sessionId, { token, expires });
  
  return token;
}

// Verify CSRF token
export function verifyCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored) {
    return false;
  }
  
  // Check if token has expired
  if (Date.now() > stored.expires) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  // Verify token matches
  if (stored.token !== token) {
    return false;
  }
  
  return true;
}

// Clean up expired tokens
export function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now > data.expires) {
      csrfTokens.delete(sessionId);
    }
  }
}

// CSRF middleware for API routes
export function csrfProtection(request: NextRequest): NextResponse | null {
  // Skip CSRF for GET requests
  if (request.method === 'GET') {
    return null;
  }
  
  // Skip CSRF for public endpoints
  const publicEndpoints = ['/api/auth/signin', '/api/auth/signout', '/api/auth/callback', '/api/contact'];
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    request.nextUrl.pathname.startsWith(endpoint)
  );
  
  if (isPublicEndpoint) {
    return null;
  }
  
  // Get session ID from cookie
  const sessionId = request.cookies.get('appSession')?.value;
  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session required for CSRF protection' },
      { status: 401 }
    );
  }
  
  // Get CSRF token from header
  const csrfToken = request.headers.get('x-csrf-token');
  if (!csrfToken) {
    return NextResponse.json(
      { error: 'CSRF token required' },
      { status: 403 }
    );
  }
  
  // Verify CSRF token
  if (!verifyCSRFToken(sessionId, csrfToken)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }
  
  return null; // Allow request to continue
}

// Add CSRF token to response
export function addCSRFTokenToResponse(response: NextResponse, sessionId: string): NextResponse {
  const token = generateCSRFToken(sessionId);
  response.headers.set('x-csrf-token', token);
  return response;
}

// Clean up tokens periodically (call this in a cron job or background task)
setInterval(cleanupExpiredTokens, 5 * 60 * 1000); // Every 5 minutes

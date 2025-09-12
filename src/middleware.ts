import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generateNonce, getSecurityHeaders } from "@/lib/security";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/checkout', 
    '/orders',
  ];

  // Define API routes that require authentication
  const protectedApiRoutes = [
    '/api/user',
    '/api/checkout',
  ];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Generate nonce for CSP
  const nonce = generateNonce();
  
  // Create response
  const response = NextResponse.next();
  
  // Apply security headers with nonce
  const securityHeaders = getSecurityHeaders(nonce);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add nonce to response headers for client-side use
  response.headers.set('x-nonce', nonce);
  
  // For API routes, check for authentication token
  if (isProtectedApiRoute) {
    const authHeader = request.headers.get('authorization');
    const sessionToken = request.cookies.get('appSession')?.value;
    
    if (!authHeader && !sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }
  
  // For protected routes, redirect to login if not authenticated
  if (isProtectedRoute) {
    const sessionToken = request.cookies.get('appSession')?.value;
    
    if (!sessionToken) {
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/checkout',
    '/orders',
    '/api/user', // Protect any user-specific API routes
  ];

  // Define public routes that should always be accessible
  const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/collections',
    '/products',
    '/cart',
    '/wishlist',
    '/auth/error',
    '/privacy',
    '/terms',
    '/shipping',
    '/returns',
    '/api/auth', // Auth0 authentication routes
    '/api/checkout/payhere', // Payment webhooks should be public
  ];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current route is explicitly public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  ) || pathname.startsWith('/_next') || 
      pathname.startsWith('/images') ||
      pathname === '/favicon.ico' ||
      pathname === '/sitemap.xml' ||
      pathname === '/robots.txt';

  // If it's a public route, allow it through
  if (isPublicRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    try {
      const response = NextResponse.next();
      const session = await getSession(request, response);
      
      if (!session || !session.user) {
        // Redirect to login with return URL
        const loginUrl = new URL('/api/auth/login', request.url);
        loginUrl.searchParams.set('returnTo', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // User is authenticated, allow access
      return response;
    } catch (error) {
      console.error('Middleware authentication error:', error);
      // On error, redirect to login
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // For all other routes, allow access
  return NextResponse.next();
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

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/checkout', 
    '/orders',
  ];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // For protected routes, let the withPageAuthRequired handle auth on the client side
  // This middleware now just handles basic routing logic without Auth0 session checks
  // to avoid Edge Runtime compatibility issues
  
  // Allow all routes to continue - auth protection is handled by:
  // 1. withPageAuthRequired wrapper on protected pages
  // 2. Client-side useUser hook checks
  // 3. API route getSession calls
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

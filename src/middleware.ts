import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generateNonce, getSecurityHeaders } from "@/lib/security";
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes are now protected by Supabase auth in the layout
  // No Basic Auth needed - authentication happens at the page level

  // Generate nonce for CSP
  const nonce = generateNonce();
  const response = NextResponse.next();

  const securityHeaders = getSecurityHeaders(nonce, pathname);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set('x-nonce', nonce);

  // Note: Route protection is handled at the page level using server components
  // See src/lib/auth.ts for requireAuth() helper

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - api/auth (NextAuth routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth).*)",
  ],
};

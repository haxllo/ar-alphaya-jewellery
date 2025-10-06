import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generateNonce, getSecurityHeaders } from "@/lib/security";
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ----------------------
  // 1️⃣ Protect /admin with Basic Auth
  // ----------------------
  if (pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');

    const username = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASS;
    const validBase64 = Buffer.from(`${username}:${password}`).toString('base64');

    if (authHeader !== `Basic ${validBase64}`) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }
  }

  // ----------------------
  // 2️⃣ Existing protected routes
  // ----------------------
  const protectedRoutes = ['/profile', '/checkout', '/orders'];
  const protectedApiRoutes = ['/api/user', '/api/checkout'];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route));

  // Generate nonce for CSP
  const nonce = generateNonce();
  const response = NextResponse.next();

  const securityHeaders = getSecurityHeaders(nonce, pathname);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set('x-nonce', nonce);

  // API route auth
  if (isProtectedApiRoute) {
    const authHeader = request.headers.get('authorization');
    const sessionToken = request.cookies.get('appSession')?.value;
    if (!authHeader && !sessionToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
  }

  // Page route auth
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

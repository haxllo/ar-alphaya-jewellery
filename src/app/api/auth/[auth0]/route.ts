import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Export dynamic to prevent static optimization issues with Next.js 15
export const dynamic = 'force-dynamic';

// OAuth callback handler
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth0: string }> }
) {
  try {
    const { auth0 } = await params;
    const { searchParams } = new URL(request.url);
    
    console.log('[Auth Route] Handling route:', auth0);
    console.log('[Auth Route] Full URL:', request.url);
    
    // Handle different auth routes
    switch (auth0) {
    case 'login':
      // Redirect to Auth0 Universal Login
      const loginUrl = new URL(`${process.env.AUTH0_ISSUER_BASE_URL}/authorize`);
      loginUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
      loginUrl.searchParams.set('redirect_uri', `${process.env.AUTH0_BASE_URL}/api/auth/callback`);
      loginUrl.searchParams.set('response_type', 'code');
      loginUrl.searchParams.set('scope', process.env.AUTH0_SCOPE || 'openid profile email');
      loginUrl.searchParams.set('state', Math.random().toString(36).substring(7));
      return NextResponse.redirect(loginUrl);
      
    case 'logout':
      // Clear session cookie
      const cookieStore = await cookies();
      cookieStore.delete('appSession');
      
      // Redirect to Auth0 logout
      const logoutUrl = new URL(`${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout`);
      logoutUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
      logoutUrl.searchParams.set('returnTo', process.env.AUTH0_BASE_URL!);
      return NextResponse.redirect(logoutUrl);
      
    case 'callback':
      // Handle OAuth callback
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      console.log('[Auth Callback] Received callback request');
      console.log('[Auth Callback] Code:', code ? 'present' : 'missing');
      console.log('[Auth Callback] Error:', error);
      console.log('[Auth Callback] Callback URL:', `${process.env.AUTH0_BASE_URL}/api/auth/callback`);
      
      // Check for errors from Auth0
      if (error) {
        console.error('Auth0 callback error:', error, errorDescription);
        return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/auth/error?error=${encodeURIComponent(error)}`);
      }
      
      // Validate code exists
      if (!code) {
        console.error('[Auth Callback] No authorization code received');
        return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/auth/error?error=missing_code`);
      }
      
      try {
        console.log('[Auth Callback] Exchanging code for tokens...');
        console.log('[Auth Callback] Token endpoint:', `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`);
        
        // Exchange authorization code for tokens
        const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.AUTH0_CLIENT_ID!,
            client_secret: process.env.AUTH0_CLIENT_SECRET!,
            code,
            redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
          }),
        });
        
        console.log('[Auth Callback] Token response status:', tokenResponse.status);
        
        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json().catch(() => ({ error: 'unknown' }));
          console.error('[Auth Callback] Token exchange failed:', {
            status: tokenResponse.status,
            statusText: tokenResponse.statusText,
            error: errorData,
          });
          return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/auth/error?error=token_exchange_failed&details=${encodeURIComponent(JSON.stringify(errorData))}`);
        }
        
        const tokens = await tokenResponse.json();
        
        // Decode the ID token to get user info (basic JWT decode)
        const idTokenPayload = JSON.parse(
          Buffer.from(tokens.id_token.split('.')[1], 'base64').toString()
        );
        
        // Create session object
        const session = {
          user: {
            sub: idTokenPayload.sub,
            email: idTokenPayload.email,
            name: idTokenPayload.name,
            picture: idTokenPayload.picture,
            email_verified: idTokenPayload.email_verified,
          },
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          expiresAt: Date.now() + (tokens.expires_in * 1000),
        };
        
        // Store session in cookie
        const cookieStore = await cookies();
        cookieStore.set('appSession', JSON.stringify(session), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: tokens.expires_in || 86400, // 24 hours default
          path: '/',
        });
        
        // Redirect to home or returnTo URL
        const returnTo = searchParams.get('returnTo') || '/';
        return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}${returnTo}`);
        
      } catch (error) {
        console.error('Callback processing error:', error);
        return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/auth/error?error=callback_failed`);
      }
      
    case 'me':
      // Return user profile from session
      try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('appSession');
        
        if (!sessionCookie) {
          return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
        
        const session = JSON.parse(sessionCookie.value);
        
        // Check if session is expired
        if (session.expiresAt && Date.now() > session.expiresAt) {
          cookieStore.delete('appSession');
          return NextResponse.json({ error: 'Session expired' }, { status: 401 });
        }
        
        return NextResponse.json({ user: session.user });
      } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
      }
      
    default:
      console.error('[Auth Route] Invalid route:', auth0);
      return NextResponse.json({ error: 'Invalid auth route' }, { status: 404 });
    }
  } catch (error) {
    console.error('[Auth Route] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(
      `${process.env.AUTH0_BASE_URL}/auth/error?error=server_error&details=${encodeURIComponent(errorMessage)}`
    );
  }
}

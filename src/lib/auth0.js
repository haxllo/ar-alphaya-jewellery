import { initAuth0 } from '@auth0/nextjs-auth0';

// Initialize the Auth0 instance with custom configuration
export const auth0 = initAuth0({
  // Core Auth0 configuration (loaded from environment variables)
  domain: process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', ''),
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  secret: process.env.AUTH0_SECRET,
  
  // Session configuration
  session: {
    rollingDuration: 24 * 60 * 60, // 24 hours in seconds
    absoluteDuration: 7 * 24 * 60 * 60, // 7 days in seconds
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
    },
  },
  
  // Routes configuration
  routes: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    callback: '/api/auth/callback',
    postLogoutRedirect: '/',
  },
  
  // Login configuration
  authorizationParams: {
    response_type: 'code',
    scope: process.env.AUTH0_SCOPE || 'openid profile email',
    audience: process.env.AUTH0_AUDIENCE,
  },
  
  // Login configuration with dynamic returnTo support
  login: {
    returnTo: (req) => {
      // Support returnTo query parameter from middleware
      const returnTo = req.query?.returnTo;
      if (returnTo && typeof returnTo === 'string') {
        // Ensure it's a safe internal URL
        if (returnTo.startsWith('/') && !returnTo.startsWith('//')) {
          return returnTo;
        }
      }
      return process.env.AUTH0_LOGIN_RETURN_TO || '/profile';
    }
  },
  
  logout: {
    returnTo: process.env.AUTH0_LOGOUT_RETURN_TO || '/'
  },
  
  // Enable ID token validation
  idTokenSigningAlg: 'RS256',
  
  // Custom claims namespace (if using custom claims)
  identityClaimFilter: [
    'aud',
    'iss', 
    'iat',
    'exp',
    'sub',
    'azp',
    'auth_time'
  ],
  
  // Custom error handling
  onError: (req, res, error) => {
    console.error('Auth0 Error:', error);
    // You can customize error handling here
    // For example, redirect to a custom error page
    if (error.code === 'MISSING_STATE_PARAM') {
      res.redirect('/auth/error?message=authentication_failed');
    }
  }
});

// Export individual handlers for custom use
export const {
  handleAuth,
  handleCallback,
  handleLogin,
  handleLogout,
  handleProfile,
  getSession,
  getAccessToken,
  updateSession,
  withApiAuthRequired,
  withPageAuthRequired
} = auth0;

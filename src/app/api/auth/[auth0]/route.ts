import { handleAuth } from '@auth0/nextjs-auth0';

// Temporary debug logging - remove after checking
console.log('🔍 Auth0 Environment Check:');
console.log('AUTH0_ISSUER_BASE_URL:', process.env.AUTH0_ISSUER_BASE_URL);
console.log('AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID ? 'Set' : 'Not set');
console.log('AUTH0_CLIENT_SECRET:', process.env.AUTH0_CLIENT_SECRET ? 'Set' : 'Not set');
console.log('AUTH0_BASE_URL:', process.env.AUTH0_BASE_URL);

export const GET = handleAuth();

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check Auth0 environment variables
    const auth0Config = {
      AUTH0_SECRET: process.env.AUTH0_SECRET ? '✅ Set' : '❌ Not set',
      AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || '❌ Not set',
      AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL || '❌ Not set',
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID ? '✅ Set (hidden)' : '❌ Not set',
      AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET ? '✅ Set (hidden)' : '❌ Not set',
      AUTH0_SCOPE: process.env.AUTH0_SCOPE || 'openid profile email',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
    };

    // Construct URLs that will be used
    const loginUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/authorize`;
    const tokenUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`;
    const callbackUrl = `${process.env.AUTH0_BASE_URL}/api/auth/callback`;

    // Test Auth0 connectivity
    let auth0Test = { status: 'Not tested', details: '' };
    try {
      const testResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/openid-configuration`);
      if (testResponse.ok) {
        auth0Test = { 
          status: '✅ Auth0 is reachable', 
          details: 'Successfully connected to Auth0'
        };
      } else {
        auth0Test = { 
          status: '⚠️ Auth0 responded with error', 
          details: `Status: ${testResponse.status}`
        };
      }
    } catch (error) {
      auth0Test = { 
        status: '❌ Cannot reach Auth0', 
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Check for common issues
    const issues = [];
    if (!process.env.AUTH0_BASE_URL) {
      issues.push('❌ AUTH0_BASE_URL is not set');
    } else if (process.env.AUTH0_BASE_URL.endsWith('/')) {
      issues.push('⚠️ AUTH0_BASE_URL has trailing slash - remove it!');
    } else if (!process.env.AUTH0_BASE_URL.startsWith('https://')) {
      issues.push('❌ AUTH0_BASE_URL must use HTTPS in production');
    }

    if (!process.env.AUTH0_ISSUER_BASE_URL) {
      issues.push('❌ AUTH0_ISSUER_BASE_URL is not set');
    } else if (process.env.AUTH0_ISSUER_BASE_URL.endsWith('/')) {
      issues.push('⚠️ AUTH0_ISSUER_BASE_URL has trailing slash - remove it!');
    }

    if (!process.env.AUTH0_CLIENT_ID) {
      issues.push('❌ AUTH0_CLIENT_ID is not set');
    }

    if (!process.env.AUTH0_CLIENT_SECRET) {
      issues.push('❌ AUTH0_CLIENT_SECRET is not set');
    }

    return NextResponse.json({
      status: issues.length === 0 ? '✅ Configuration looks good' : '⚠️ Issues detected',
      config: auth0Config,
      urls: {
        login: loginUrl,
        token: tokenUrl,
        callback: callbackUrl,
        logout: `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout`,
      },
      auth0Connectivity: auth0Test,
      issues: issues.length > 0 ? issues : ['No issues detected'],
      instructions: {
        step1: 'Verify all environment variables are set in Netlify',
        step2: 'Add callback URL to Auth0 dashboard: ' + callbackUrl,
        step3: 'Ensure no trailing slashes in URLs',
        step4: 'Use HTTPS for AUTH0_BASE_URL in production',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Debug endpoint error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

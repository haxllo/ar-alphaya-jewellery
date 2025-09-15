/** @type {import('next').NextConfig} */
const nextConfig = {

  // Server-side rendering for Auth0 API routes (no static export)
  webpack: (config, { isServer }) => {
    // Fix for Auth0 client module resolution
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  images: {
    // Auth0 user avatars and external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.auth0.com',
      },
      {
        protocol: 'https',
        hostname: '**.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // Keep unoptimized for Netlify compatibility
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Enable trailing slash for consistent routing
  trailingSlash: true,
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disabled for deployment
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Environment variables available on client
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

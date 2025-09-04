/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-side rendering for Auth0 API routes (no static export)
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
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Environment variables available on client
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export for Auth0 API routes during development
  // output: 'export',
  images: {
    // Auth0 user avatars are external images
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
    ],
    unoptimized: true
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  }
};

export default nextConfig;

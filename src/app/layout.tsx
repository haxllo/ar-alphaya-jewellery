import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AR Alphaya Jewellery | Fine Jewelry & Custom Pieces",
  description: "Discover exquisite fine jewelry and custom pieces at AR Alphaya Jewellery. Specializing in rings, earrings, pendants, and bracelets crafted with precision and passion.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: '/images/LOGO1.png',
    shortcut: '/images/LOGO1.png',
    apple: '/images/LOGO2.png',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport = {
  themeColor: '#121212',
};

import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import NetlifyIdentityLoader from '@/components/layout/NetlifyIdentityLoader'
import Providers from './providers'
import AbandonedCartTracker from '@/components/AbandonedCartTracker'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#121212" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/images/LOGO1.png" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://2vhk07la2x.ucarecd.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.auth0.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); }); }`,
          }}
        />
      </head>
      <body className={`${inter.className} h-full flex flex-col`}>
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AR Alphaya Jewellery',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
              logo: '/images/BRAND.svg',
              sameAs: [
                'https://www.instagram.com/ar_alphaya_jewellery/'
              ],
              contactPoint: [{
                '@type': 'ContactPoint',
                telephone: '+94-77-429-3406',
                contactType: 'customer support',
                areaServed: 'LK',
                availableLanguage: ['en']
              }]
            })
          }}
        />
        <NetlifyIdentityLoader />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AbandonedCartTracker />
        </Providers>
      </body>
    </html>
  )
}

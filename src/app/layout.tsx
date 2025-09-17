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
};

import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import NetlifyIdentityLoader from '@/components/layout/NetlifyIdentityLoader'
import { UserProvider } from '@auth0/nextjs-auth0/client'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
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
        {/* <UserProvider> */}
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        {/* </UserProvider> */}
      </body>
    </html>
  )
}

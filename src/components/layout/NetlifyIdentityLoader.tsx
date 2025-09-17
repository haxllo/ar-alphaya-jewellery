'use client'

import Script from 'next/script'

export default function NetlifyIdentityLoader() {
  return (
    <Script
      src="https://unpkg.com/netlify-identity-widget@1.9.2/build/netlify-identity-widget.js"
      strategy="afterInteractive"
      onLoad={() => {
        const w = window as any
        if (w && w.netlifyIdentity) {
          const ni = w.netlifyIdentity
          ni.on('init', (user: any) => {
            if (!user) {
              ni.on('login', () => {
                window.location.href = '/admin/'
              })
            }
          })
        }
      }}
    />
  )
}



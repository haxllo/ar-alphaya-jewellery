## Phase 1 – Fix Foundation

- Security and stability
  - Keep strict CSP in production; restrict 'unsafe-eval' to dev/admin only
  - Add nonces to any inline scripts that must remain
  - Harden API routes with input validation, CSRF, and rate limits (extend current)
- Data & pricing
  - Replace all mock conversions with live rates (done); surface last-updated time
  - Ensure all price displays use `usePriceFormatter` consistently
  - Validate product JSON schema; block deploy on invalid product files
- Content & media
  - Replace remaining placeholder images/content; enforce alt text policy
  - Standardize product image aspect ratios and min resolution
- Routing & errors
  - Add error boundaries and user-friendly error/empty states for search/PDP
  - Add 404 and 500 with clear recovery paths
- Build health
  - Enable typecheck and lint in CI; fix existing warnings
  - Add minimal smoke tests (home, PDP, add-to-cart, cart, checkout render)

## Phase 2 – Improve User Experience

- Product discovery
  - Enhance search with filters (price range, materials, in-stock, tags)
  - Autocomplete suggestions for search; handle zero-results gracefully
- PDP enhancements
  - Size guide, gemstone options with price deltas, stock status, trust badges
  - Secondary images zoom and keyboard navigation
- Cart and checkout
  - Inline validation, quantity steppers, saved cart, recently viewed
  - Clear shipping/returns info, progress indicators, guest checkout flow
- Internationalization
  - Persist user currency/locale; show “base price” + converted price on PDP
  - Add currency update timestamp tooltip
- Navigation and layout
  - Improve header nav for collections; add breadcrumbs on PDP/collections
  - Sticky add-to-cart on mobile

## Phase 3 – Growth Features

- Recommendations and personalization
  - Category/tag-based recommendations on PDP and cart (contextual)
  - “Frequently bought together” bundles
- Content & SEO
  - Structured data (Product, BreadcrumbList), canonical tags, per-page meta
  - Dynamic sitemap and robots; collection and blog landing pages
- CRM and analytics
  - Event tracking for add-to-cart, checkout steps, purchases
  - Lightweight analytics (e.g., Plausible) with ecommerce goals
- Email & retention
  - Back-in-stock and price-drop waitlists
  - Abandoned cart emails (if supported)
- Social proof
  - Reviews/ratings with moderation and schema.org markup

## Phase 4 – Optimization

- Performance
  - Universal Next.js `Image` usage, responsive sizes, WebP/AVIF
  - Route-level code splitting and lazy-load below-the-fold modules
  - Cache API responses with SWR/stale-while-revalidate; CDN tuning
- Core Web Vitals
  - CLS audits, LCP optimization, preconnect to CDNs
  - Automated Lighthouse CI for key pages
- PWA & offline
  - Manifest, service worker, offline fallbacks for browsing products
- Observability
  - Error tracking (Sentry) client/server; RUM for vitals and conversion
- Hardening
  - Dependency audits, lockfile maintenance, third-party script review



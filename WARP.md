# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AR Alphaya Jewellery is a modern, customizable jewelry e-commerce website built with Next.js 15, TypeScript, and Tailwind CSS. The project features a headless CMS system (Decap CMS) for easy product management, complete Auth0 authentication, PayHere payment integration, and a sophisticated shopping cart with AI-powered recommendations.

**Live Site:** https://aralphaya.netlify.app  
**Repository:** https://github.com/haxllo/ar-alphaya-jewellery

## Quick Start

```bash
# Install Node.js 18+ and clone repository
export PATH="/usr/local/opt/node@18/bin:$PATH"  # macOS with Homebrew
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Prerequisites

- **Node.js 18.x or higher** (project uses Node 18.20.8)
- **npm 9.x or higher** (comes with Node.js)
- **Git** for version control
- **Auth0 account** for authentication (required for profile/checkout)
- **Netlify account** for deployment and CMS hosting
- **PayHere merchant account** for payment processing (Sri Lankan gateway)

### macOS Setup

```bash
# Install Node.js 18 via Homebrew
brew install node@18
echo 'export PATH="/usr/local/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Common Development Commands

### Development Server
```bash
npm run dev           # Start development server on http://localhost:3000
```

### Build & Production
```bash
npm run build         # Build for production
npm run start         # Start production server
```

### Code Quality
```bash
npm run lint          # Run ESLint (will be deprecated in Next.js 16)
npm run type-check    # Run TypeScript compiler without emitting files
```

### Testing Commands
*Note: No test framework is currently configured. Consider adding Jest/Vitest for testing.*

### CMS Development
```bash
# Access CMS admin panel (after deployment)
# Navigate to https://your-site.netlify.app/admin
# Login with Netlify Identity credentials

# For local CMS development (if needed)
npm install -g netlify-cms-proxy-server
```

## Architecture Overview

### Tech Stack
- **Frontend:** Next.js 15 with App Router, React 19, TypeScript
- **Styling:** Tailwind CSS with custom design system
- **State Management:** Zustand (cart, wishlist)
- **Authentication:** Auth0 with Next.js integration
- **CMS:** Decap CMS (formerly Netlify CMS)
- **Payments:** PayHere payment gateway
- **Deployment:** Netlify with automatic deployments

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/auth/          # Auth0 authentication routes
│   ├── collections/       # Product collections pages  
│   ├── products/          # Individual product pages
│   ├── profile/          # User profile (protected)
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow (protected)
│   └── layout.tsx        # Root layout with Auth0 UserProvider
├── components/            # Reusable React components
│   ├── ui/               # Basic UI components
│   ├── layout/           # Header, Footer components
│   ├── product/          # Product-related components
│   ├── cart/             # Cart functionality
│   ├── reviews/          # Review and rating system
│   ├── recommendations/  # AI-powered product suggestions
│   └── marketing/        # Newsletter components
├── lib/                  # Utilities and configurations
│   ├── store/            # Zustand stores (cart, wishlist)
│   ├── cms/              # CMS utility functions
│   ├── recommendations.ts # Smart product recommendations
│   ├── reviews.ts        # Review system service
│   ├── newsletter.ts     # Newsletter management
│   ├── currency.ts       # Multi-currency support (9 currencies)
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
│   └── product.ts        # Product, Cart, Review types
├── data/                 # CMS content and sample data
│   ├── products/         # Product markdown files
│   └── site.json         # Site configuration
└── middleware.ts         # Route protection and authentication
```

### Key Architectural Decisions

**Authentication Strategy**
- Auth0 for user management instead of custom implementation
- Route-level protection via Next.js middleware
- Protected routes: `/profile`, `/checkout`, `/orders`
- Public routes: all product pages, cart, about pages

**State Management**
- Zustand for client-side state (cart, wishlist)
- Persistent cart storage with local storage
- React Context for Auth0 user state

**Content Management**
- Decap CMS for non-technical product management
- Git-based workflow with markdown frontmatter
- User-friendly CMS interface with hints and labels
- Real-time product updates without coding
- Image optimization via Next.js Image component
- Netlify Identity integration for secure access

**Payment Integration**
- PayHere for Sri Lankan market focus
- Sandbox/production environment switching
- Webhook handling for payment confirmations

**Styling & Design**
- Professional black/white theme matching brand
- Tailwind utility classes with custom color palette
- Responsive mobile-first design

## Environment Variables

### Required for Development
```bash
# Create .env.local file
AUTH0_SECRET="your-32-byte-secret-key"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://your-tenant.auth0.com"
AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_CLIENT_SECRET="your-auth0-client-secret"
AUTH0_SCOPE="openid profile email"
```

### Required for Production
```bash
# Netlify environment variables
NEXT_PUBLIC_SITE_URL="https://aralphaya.netlify.app"
NEXT_PUBLIC_SITE_NAME="AR Alphaya Jewellery"

# PayHere Payment Gateway
NEXT_PUBLIC_PAYHERE_MERCHANT_ID="your-merchant-id"
PAYHERE_MERCHANT_SECRET="your-merchant-secret"
NEXT_PUBLIC_PAYHERE_SANDBOX="false"  # Set to true for testing

# Optional Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"
```

## Deployment

### Netlify Deployment (Recommended)
1. **Connect Repository:** Link GitHub repo to Netlify
2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`

3. **Environment Variables:** Add all production environment variables in Netlify dashboard
4. **Enable Netlify Identity:** For CMS admin access
5. **Configure Auth0:** Update callback URLs to production domain

### Build Configuration
- **next.config.mjs:** Server-side rendering enabled for Auth0
- **netlify.toml:** Netlify-specific configuration with security headers
- **Output:** Next.js build (not static export due to Auth0 API routes)

## Content Management

### Adding Products
1. Navigate to `/admin` after deployment
2. Login with Netlify Identity
3. Click "Products" → "New Product"
4. Fill required fields: ID, Name, Slug, Price, Images, Category
5. Save and publish - changes auto-deploy via Netlify

### Product Schema
- **Required:** ID, Name, Slug, Price, Category, Images
- **Optional:** SKU, Materials, Sizes, Tags, Stock status
- **Categories:** rings, earrings, pendants, bracelets-bangles
- **Supported formats:** Markdown content with frontmatter

### Collections Management
Edit `src/data/site.json` or use CMS "Site Settings" to manage product collections.

## Development Workflow

### Feature Development
1. Create feature branch from `main`
2. Run `npm run type-check` before committing
3. Test locally with `npm run dev`
4. Deploy preview via Netlify branch deploy
5. Merge to `main` for production deployment

### Authentication Testing
- Use Auth0 test tenant for development
- Test protected routes: `/profile`, `/checkout`
- Verify user context in components with `useUser()` hook

### Payment Testing
- Set `NEXT_PUBLIC_PAYHERE_SANDBOX=true`
- Use PayHere test cards for checkout flow
- Monitor webhook endpoints in development

## Troubleshooting

### Common Issues

**Node.js Path Issues (macOS)**
```bash
# Add Node.js 18 to PATH
echo 'export PATH="/usr/local/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Auth0 Callback Errors**
- Verify callback URLs in Auth0 dashboard match your domain
- Check AUTH0_BASE_URL matches your current environment
- Ensure AUTH0_SECRET is exactly 32 bytes

**CMS Access Issues**
- Verify Netlify Identity is enabled
- Check Git Gateway configuration in Netlify
- Confirm user has admin access in Netlify Identity

**Build Failures**
- Run `npm run type-check` to identify TypeScript errors
- Check Next.js compatibility with new dependencies
- Verify all environment variables are set in Netlify

**Cart/State Issues**
- Clear localStorage: `localStorage.removeItem('ar-alphaya-cart')`
- Check Zustand store hydration in browser dev tools
- Verify cart persistence across authentication states

### Performance Considerations
- Images automatically optimized via Next.js Image component
- Static generation enabled for product pages
- CDN delivery via Netlify for global performance
- Multi-currency conversion cached for better UX

## Key Features Reference

### Shopping Cart
- Persistent across sessions via localStorage
- Size selection support
- Quantity management
- Product recommendations based on cart contents
- Works with/without authentication

### User Authentication
- Auth0 Universal Login
- Protected routes with automatic redirect
- User profile management
- Pre-filled checkout forms for authenticated users

### Multi-Currency Support
- 9 international currencies supported
- Live exchange rate conversion
- Default: Sri Lankan Rupees (LKR)
- Currency preference stored per user/session

### Review System
- 5-star rating system
- Verified purchase indicators
- Review helpfulness voting
- Review summary statistics

### Size Guide
- Professional jewelry sizing guide
- International size conversions (US, UK, EU)
- Ring and bracelet measurement instructions
- Modal interface with visual guides

### Newsletter System
- Advanced subscription preferences
- Email validation and management
- Subscription status tracking

## Documentation Links

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Auth0 Next.js Quickstart](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Decap CMS Documentation](https://decapcms.org/docs)
- [PayHere Integration Guide](https://www.payhere.lk/downloads/manual/payhere_gateway_manual_v2.pdf)
- [Netlify Deployment Guide](https://docs.netlify.com/get-started/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Project Status

**Current Version:** Production Ready with Auth0  
**Last Updated:** September 4, 2025  
**Development Status:** ✅ Complete with full authentication  
**Live Site:** https://aralphaya.netlify.app

### Recent Completed Features
- ✅ Complete Auth0 authentication integration
- ✅ Protected user profiles and checkout pages  
- ✅ Advanced shopping cart with recommendations
- ✅ Multi-currency support system
- ✅ Professional review and rating system
- ✅ Newsletter subscription system
- ✅ Comprehensive size guide modal
- ✅ PayHere payment gateway integration
- ✅ Professional black/white design theme

### Pending Enhancements
- [ ] Advanced search functionality
- [ ] Product filtering (price, material, category)
- [ ] Wishlist functionality
- [ ] User order history and tracking
- [ ] Back-in-stock notifications
- [ ] Comprehensive test suite

## Support

For development support:
- **Email:** info@aralphayajewellery.com
- **Repository Issues:** Create GitHub issue for bugs/features
- **Documentation:** Refer to linked documentation above

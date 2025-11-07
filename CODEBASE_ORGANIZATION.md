# Codebase Organization

This document describes the organization structure of the codebase.

## 📁 Directory Structure

```
ar-alphaya-jewellery/
├── database/              # Database schemas (SQL files)
├── docs/                  # Project documentation
├── e2e/                   # End-to-end tests
├── public/                # Static assets
├── scripts/               # Utility scripts
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── middleware.ts    # Next.js middleware
│   └── types/           # TypeScript type definitions
└── [config files]       # Configuration files
```

## 🗂️ Organization Details

### `/database/`
All Supabase SQL schema files:
- Setup scripts
- Commerce schemas
- Forms schemas
- Security fixes

### `/docs/`
All project documentation:
- Migration guides
- Setup instructions
- Troubleshooting guides
- Development notes

### `/src/app/`
Next.js App Router structure:
- **`/api/`** - API routes
- **`/auth/`** - Authentication pages
- **`/products/`** - Product pages
- **`/collections/`** - Collection pages
- Other page routes

### `/src/components/`
Organized by feature:
- **`/cart/`** - Shopping cart components
- **`/home/`** - Homepage components
- **`/layout/`** - Layout components (header, footer)
- **`/marketing/`** - Marketing components (newsletter, etc.)
- **`/product/`** - Product-related components
- **`/search/`** - Search components
- **`/ui/`** - Reusable UI components

### `/src/lib/`
Utility libraries:
- **`/email/`** - Email templates and sender
- **`/store/`** - Zustand stores (cart, wishlist, comparison)

## 🧹 Cleaned Up

### Removed Files
- ✅ `src/hooks/useAuth0Session.ts` - Deprecated (migrated to NextAuth)
- ✅ `src/hooks/useAuthSession.ts` - Unused
- ✅ `src/components/layout/NetlifyIdentityLoader.tsx` - No longer needed
- ✅ `netlify.toml` - Migrated to Vercel

### Moved Files
- ✅ `FeaturedProducts.tsx` → `src/components/home/FeaturedProducts.tsx`
- ✅ All `.md` files → `docs/` (except `README.md`)
- ✅ All `.sql` files → `database/`

### Cleaned References
- ✅ Removed Auth0 preconnect from `layout.tsx`
- ✅ Updated imports for moved components

## 📝 Notes

- **Auth0**: All Auth0 code has been removed or replaced with NextAuth
- **Netlify**: Netlify-specific files removed (migrated to Vercel)
- **Documentation**: All docs are now in `/docs/` folder
- **Database**: All SQL schemas are in `/database/` folder

## 🔄 Future Organization

Consider organizing:
- Example/test routes (`/api/auth/debug`, `/sentry-example-page`) into a `/dev/` or `/examples/` folder
- Or remove them if not needed in production


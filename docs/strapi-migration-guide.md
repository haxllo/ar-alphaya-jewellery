# Decap CMS to Strapi Migration Guide

This guide provides step-by-step instructions to migrate AR Alphaya Jewellery from Decap CMS to Strapi CMS.

## Overview

**Migration Components:**
- ✅ **Strapi CMS** - Deployed to Strapi Cloud (official hosting)
- ✅ **Data Migration Script** - Automated transfer of products and settings  
- ✅ **Next.js Integration** - Updated API client and image handling
- ✅ **Production Deployment** - Strapi Cloud hosting with managed PostgreSQL

## Quick Start (3 minutes)

### 1. Deploy Strapi to Strapi Cloud

**Use the automated script:**
```bash
cd /path/to/ar-alphaya-strapi
./deploy.sh
```

**Or manually:**
1. **Go to Strapi Cloud**: Visit [cloud.strapi.io](https://cloud.strapi.io)
2. **Connect GitHub**: Authorize Strapi Cloud access
3. **Create Project**: Select `ar-alphaya-strapi` repository
4. **Choose Region**: Select closest to your users
5. **Select Plan**: Free tier is perfect to start
6. **Deploy**: Takes 2-3 minutes

### 2. Setup Strapi Admin

1. **Visit Admin Panel**: `https://your-project-name.strapiapp.com/admin`
2. **Create First Admin User**: Fill out the registration form
3. **Create API Token**:
   - Settings → API Tokens → Create new token
   - Name: "Migration Token", Type: "Full access"  
   - Copy the token (you'll need it for migration)

### 3. Configure API Permissions

1. **Set Public Permissions**:
   - Settings → Users & Permissions → Roles → Public
   - Enable for `product`: `find`, `findOne`
   - Enable for `site-setting`: `find`
   - Save

### 4. Run Data Migration

```bash
# In your ar-alphaya-jewellery directory
export STRAPI_URL=https://your-project-name.strapiapp.com
export STRAPI_TOKEN=your-api-token-from-step-2

# Test migration (dry run)
npx ts-node scripts/migrate-decap-to-strapi.ts --dry-run

# Run actual migration  
npx ts-node scripts/migrate-decap-to-strapi.ts
```

### 5. Update Next.js Environment

Add to your `.env.local`:
```
NEXT_PUBLIC_STRAPI_URL=https://your-project-name.strapiapp.com
```

**Done!** Your CMS is now live and ready to use.

---

## Detailed Migration Steps

### Architecture Changes

**Before (Decap CMS):**
```
GitHub Repository → Netlify CMS → Static Files → Next.js
```

**After (Strapi CMS):**  
```
Railway PostgreSQL ← Strapi API → Next.js App
```

### Content Type Mapping

| Decap CMS | Strapi | Changes |
|-----------|--------|---------|
| `products/*.md` | Collection: `product` | Frontmatter → JSON fields |
| `site.json` | Single Type: `site-setting` | Direct JSON mapping |
| `/public/images/` | Media Library | Uploaded to Strapi |

### API Changes

**Decap CMS (File-based):**
```javascript
// Old way
import products from '@/data/products'
const product = products.find(p => p.slug === slug)
```

**Strapi CMS (API-based):**
```javascript  
// New way
import { getProductBySlug } from '@/lib/strapi'
const product = await getProductBySlug(slug)
```

### Field Mapping

| Field | Decap Type | Strapi Type | Notes |
|-------|------------|-------------|--------|
| `id` | string | `productId` (string) | Renamed for clarity |
| `slug` | string | UID (auto-generated) | Based on name |
| `images` | image list | Media (multiple) | Uploaded to media library |
| `sizes` | object list | Component (repeatable) | `shared.size` |
| `gemstones` | object list | Component (repeatable) | `shared.gemstone` |
| `body` | markdown | Rich Text | Better editor |
| `materials` | string list | JSON | Flexible array |
| `tags` | string list | JSON | Flexible array |

## Migration Script Features

**Location**: `scripts/migrate-decap-to-strapi.ts`

**Features:**
- ✅ **Batch Processing** - Processes files in configurable batches
- ✅ **Image Upload** - Automatically uploads all product images  
- ✅ **Dry Run Mode** - Test without making changes (`--dry-run`)
- ✅ **Error Handling** - Continues on individual failures
- ✅ **Progress Tracking** - Shows detailed progress and timing
- ✅ **Duplicate Prevention** - Checks existing products by slug

**Usage:**
```bash
# Basic migration
npx ts-node scripts/migrate-decap-to-strapi.ts

# Test mode (no changes made)
npx ts-node scripts/migrate-decap-to-strapi.ts --dry-run

# Custom batch size  
npx ts-node scripts/migrate-decap-to-strapi.ts --batch-size=10
```

## API Examples

### REST API

**Get all products:**
```bash
curl "https://your-strapi-url/api/products?populate=images,sizes,gemstones"
```

**Get product by slug:**
```bash
curl "https://your-strapi-url/api/products?filters[slug][\$eq]=diamond-ring&populate=*"
```

**Get site settings:**
```bash  
curl "https://your-strapi-url/api/site-setting?populate=collections"
```

### GraphQL

**Query products:**
```graphql
query GetProducts {
  products(pagination: { limit: 10 }, sort: "createdAt:desc") {
    data {
      id
      attributes {
        name
        slug
        price
        currency
        images {
          data {
            attributes {
              url
              alternativeText
            }
          }
        }
        category
        inStock
        featured
      }
    }
  }
}
```

**Query site settings:**
```graphql
query GetSiteSettings {
  siteSetting {
    data {
      attributes {
        title
        description
        email
        phone
        whatsapp
        address
        instagram
        collections {
          name
          handle
          description
        }
      }
    }
  }
}
```

## Next.js Integration

### New Strapi Client

**File**: `src/lib/strapi.ts`

**Key Functions:**
```typescript
// Get all products with filtering
const products = await getProducts({ 
  category: 'rings',
  featured: true,
  limit: 10 
});

// Get single product
const product = await getProductBySlug('diamond-ring');

// Get site settings
const settings = await getSiteSettings();

// Transform for legacy code compatibility
const legacyProduct = transformProductForLegacyCode(product);
```

### Image Handling

**Before (Static):**
```jsx
<Image src="/images/products/ring.jpg" alt="Ring" />
```

**After (Strapi):**
```jsx  
import { getOptimizedImageUrl } from '@/lib/strapi'

<Image 
  src={getOptimizedImageUrl(product.images[0], 'medium')} 
  alt={product.name}
/>
```

### Server Components

```typescript
// app/products/page.tsx
import { getProducts } from '@/lib/strapi'

export default async function ProductsPage() {
  const products = await getProducts({ featured: true })
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

## Environment Variables

### Development (`.env.local`)
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your-local-api-token
```

### Production (Netlify/Vercel)
```bash
NEXT_PUBLIC_STRAPI_URL=https://your-strapi.up.railway.app  
STRAPI_TOKEN=your-production-api-token
```

### Railway (Strapi Production)
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=16-byte-hex
ADMIN_JWT_SECRET=32-byte-hex  
JWT_SECRET=32-byte-hex
```

## Testing & Verification

### 1. API Testing
```bash
# Test connection
curl https://your-strapi-url/api/products?pagination[limit]=1

# Test with populated fields  
curl "https://your-strapi-url/api/products?populate=images&pagination[limit]=1"
```

### 2. GraphQL Testing
Visit: `https://your-strapi-url/graphql`

### 3. Admin Panel Testing
1. Visit: `https://your-strapi-url/admin`
2. Login with admin credentials
3. Check: Products, Site Settings, Media Library

### 4. Next.js Integration Testing
```bash
# Update environment
echo "NEXT_PUBLIC_STRAPI_URL=https://your-strapi-url" >> .env.local

# Test locally  
npm run dev

# Check pages load correctly
open http://localhost:3000/products
```

## Rollback Strategy

If you need to revert to Decap CMS:

### 1. Immediate Rollback
```bash
# Remove Strapi client  
git checkout main src/lib/strapi.ts

# Restore original data fetching
git checkout main src/lib/products.ts

# Remove Strapi env vars
unset NEXT_PUBLIC_STRAPI_URL
```

### 2. Database Backup
```bash
# Export Strapi data (backup)
pg_dump $DATABASE_URL > strapi-backup.sql

# Keep for future reference or re-migration
```

## Troubleshooting

### Common Issues

**Migration fails with 401 error:**
- Check `STRAPI_TOKEN` is correct
- Verify API token has full access permissions

**Images not uploading:**
- Check file permissions in source directory
- Verify Strapi has write access to uploads folder
- Confirm image files exist at specified paths

**GraphQL not available:**
- Ensure GraphQL plugin is installed and enabled
- Check `config/plugins.js` has GraphQL configuration

**Build fails on Railway:**
- Verify all environment variables are set
- Check `DATABASE_URL` format is correct
- Ensure PostgreSQL service is running

**API returns empty data:**
- Check API permissions in Strapi admin
- Enable `find` and `findOne` for Public role
- Verify content is published (not draft)

### Performance Optimization

**Caching:**
- Strapi responses are cached for 5 minutes
- Use `cache()` wrapper for server components
- Configure CDN for media files

**Database:**
- Enable connection pooling  
- Monitor query performance in Railway
- Consider read replicas for high traffic

### Security

**API Tokens:**
- Use environment-specific tokens
- Rotate tokens regularly  
- Limit token scope to required operations

**Database:**
- Use SSL connections in production
- Regular backups via Railway
- Monitor access logs

## Support

**Documentation:**
- Strapi docs: [docs.strapi.io](https://docs.strapi.io)
- Railway docs: [docs.railway.app](https://docs.railway.app)
- Migration script: `scripts/migrate-decap-to-strapi.ts`

**Monitoring:**
- Railway dashboard for deployment status
- Strapi admin for content management
- Next.js build logs for integration issues

---

## Summary

✅ **Content Models**: Products and site settings recreated in Strapi  
✅ **Data Migration**: Automated script transfers all content and images  
✅ **API Integration**: Next.js updated to consume Strapi REST/GraphQL APIs  
✅ **Production Deployment**: Railway hosting with PostgreSQL  
✅ **Admin Interface**: Strapi admin panel for content management  

The migration provides a more powerful, scalable CMS while maintaining all existing functionality.

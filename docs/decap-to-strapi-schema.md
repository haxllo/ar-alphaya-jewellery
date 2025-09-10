# Decap CMS to Strapi Migration Schema

## Products Collection Type

| Field | Type | Required | Description | Strapi Equivalent |
|-------|------|----------|-------------|------------------|
| `id` | string | ✓ | Unique identifier | Text (unique) |
| `slug` | string | ✓ | URL-friendly name | UID (based on name) |
| `name` | string | ✓ | Product name | Text |
| `price` | number (int) | ✓ | Price in LKR | Decimal |
| `currency` | string | ✓ | Currency code (default: LKR) | Enumeration |
| `images` | list (image) | ✓ | 1-5 product images | Media (multiple) |
| `category` | select | ✓ | Product category | Enumeration |
| `sku` | string | ✗ | Stock keeping unit | Text |
| `materials` | list (string) | ✗ | Materials used | JSON / Component |
| `weight` | number (float) | ✗ | Weight in grams | Decimal |
| `dimensions` | string | ✗ | Physical dimensions | Text |
| `sizes` | list (object) | ✗ | Available sizes with label/value | Component (repeatable) |
| `gemstones` | list (object) | ✗ | Gemstone options (custom field) | Component (repeatable) |
| `inStock` | boolean | ✓ | Stock status | Boolean |
| `featured` | boolean | ✓ | Featured product flag | Boolean |
| `tags` | list (string) | ✗ | Product tags | Relation (many-to-many) |
| `body` | markdown | ✓ | Product description | Rich Text |
| `createdAt` | datetime | ✓ | Creation timestamp | DateTime |
| `updatedAt` | datetime | ✓ | Last update timestamp | DateTime |

### Category Options
- rings
- earrings  
- pendants
- bracelets-bangles

### Custom Components Needed

**Size Component:**
- `label` (string)
- `value` (string)

**Gemstone Component:**
- `name` (string)
- `value` (string)  
- `priceAdjustment` (decimal)
- `description` (text)
- `available` (boolean)

## Site Settings Single Type

| Field | Type | Required | Description | Strapi Equivalent |
|-------|------|----------|-------------|------------------|
| `title` | string | ✓ | Site title | Text |
| `description` | text | ✓ | Site description | Text |
| `email` | string | ✓ | Contact email | Email |
| `phone` | string | ✓ | Phone number | Text |
| `whatsapp` | string | ✓ | WhatsApp number | Text |
| `address` | text | ✓ | Physical address | Text |
| `instagram` | string | ✓ | Instagram URL | Text |
| `collections` | list (object) | ✓ | Product collections | Component (repeatable) |

**Collection Component:**
- `name` (string)
- `handle` (string)
- `description` (text)

## File Structure to Migrate

**Products:** `src/data/products/*.md` (3 files)
**Settings:** `src/data/site.json` (1 file)  
**Images:** `public/images/products/*` (referenced in markdown files)

## API Endpoints (Strapi)

**REST API:**
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product  
- `GET /api/site-setting` - Get site settings
- `POST /api/upload` - Upload media files

**GraphQL:**
```graphql
query Products {
  products {
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
            }
          }
        }
        category
        inStock
        featured
        body
      }
    }
  }
}

query SiteSettings {
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
      }
    }
  }
}
```

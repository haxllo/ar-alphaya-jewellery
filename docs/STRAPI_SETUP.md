# Strapi Setup Guide for AR Alphaya Jewellery

This guide walks through setting up your Strapi CMS content types and importing existing data.

## Overview

Your Strapi instance is hosted at: **https://strong-spirit-974e7b05ad.strapiapp.com**

You need to create two content types:
1. **Product** (Collection Type)
2. **Site Setting** (Single Type)

## Step 1: Access Strapi Admin

1. Go to https://strong-spirit-974e7b05ad.strapiapp.com/admin
2. Log in with your admin credentials

## Step 2: Create Product Content Type

1. Go to **Content-Type Builder** in the sidebar
2. Click **"Create new collection type"**
3. Enter display name: **Product**
4. API ID (UID): `product` (should auto-generate)
5. Click **Continue**

### Product Fields Configuration

Add the following fields to your Product content type:

#### Basic Information
- **productId**
  - Type: Text
  - Name: productId
  - Required: Yes
  - Unique: Yes

- **name**
  - Type: Text
  - Name: name
  - Required: Yes

- **slug**
  - Type: UID
  - Name: slug
  - Attached field: name
  - Required: Yes

#### Pricing
- **price**
  - Type: Integer
  - Name: price
  - Required: Yes

- **currency**
  - Type: Text
  - Name: currency
  - Default value: "LKR"

#### Media
- **images**
  - Type: Media
  - Name: images
  - Multiple files: Yes
  - Allowed types: Images only

#### Categorization
- **category**
  - Type: Enumeration
  - Name: category
  - Values: 
    - `rings`
    - `earrings`
    - `pendants`
    - `bracelets-bangles`
  - Required: Yes

#### Product Details
- **sku**
  - Type: Text
  - Name: sku
  - Required: No

- **materials**
  - Type: JSON
  - Name: materials

- **weight**
  - Type: Decimal (number)
  - Name: weight

- **dimensions**
  - Type: Text
  - Name: dimensions

#### Variants & Options
- **sizes**
  - Type: JSON
  - Name: sizes

- **gemstones**
  - Type: JSON
  - Name: gemstones

#### Status
- **inStock**
  - Type: Boolean
  - Name: inStock
  - Default value: true

- **featured**
  - Type: Boolean
  - Name: featured
  - Default value: false

#### Content
- **tags**
  - Type: JSON
  - Name: tags

- **body**
  - Type: Rich Text
  - Name: body

#### Metadata
- **originalCreatedAt**
  - Type: DateTime
  - Name: originalCreatedAt

- **originalUpdatedAt**
  - Type: DateTime
  - Name: originalUpdatedAt

6. Click **Save** to create the content type

## Step 3: Create Site Setting Content Type

1. In **Content-Type Builder**, click **"Create new single type"**
2. Enter display name: **Site Setting**
3. API ID (UID): `site-setting` (should auto-generate)
4. Click **Continue**

### Site Setting Fields Configuration

Add the following fields:

- **title**
  - Type: Text
  - Name: title
  - Required: Yes

- **description**
  - Type: Text
  - Name: description

- **email**
  - Type: Email
  - Name: email

- **phone**
  - Type: Text
  - Name: phone

- **whatsapp**
  - Type: Text
  - Name: whatsapp

- **address**
  - Type: Text
  - Name: address

- **instagram**
  - Type: Text
  - Name: instagram

- **collections**
  - Type: JSON
  - Name: collections

5. Click **Save** to create the content type

## Step 4: Configure API Permissions

1. Go to **Settings** → **Roles** → **Public**
2. For both **Product** and **Site-setting**, enable:
   - `find` (for listing/reading)
   - `findOne` (for single item reading)

3. Go to **Settings** → **Roles** → **Authenticated** (if you have authenticated users)
4. Enable the same permissions

## Step 5: Import Existing Data

Now you can import your existing product data using the seeding script:

```bash
# From your project root
npm run strapi:seed
```

This script will:
- Read your existing markdown files from `src/data/products/`
- Read your site configuration from `src/data/site.json`
- Create entries in your Strapi CMS

## Step 6: Verify the Setup

1. In Strapi admin, go to **Content Manager**
2. You should see:
   - **Products** (collection) with your imported products
   - **Site Setting** (single type) with your site information

3. Test the API endpoints:
   ```bash
   curl "https://strong-spirit-974e7b05ad.strapiapp.com/api/products?populate=*"
   curl "https://strong-spirit-974e7b05ad.strapiapp.com/api/site-setting?populate=*"
   ```

## Step 7: Publish Content (Optional)

If your content is in draft state:
1. Go to **Content Manager** → **Products**
2. For each product, click **Edit** → **Publish**
3. Do the same for **Site Setting**

## Troubleshooting

### Import Script Errors
- **403 Forbidden**: Check your API token permissions
- **404 Not Found**: Ensure content types are created with exact API IDs
- **422 Validation Error**: Check required fields and data types

### API Token Issues
Your API token is configured in `.env.local`. If you need to regenerate:
1. Go to **Settings** → **API Tokens**
2. Create a new token with **Custom** permissions
3. Grant `create`, `update`, `find`, and `findOne` for both content types
4. Update your `.env.local` file

### Content Type Mismatches
If the API structure doesn't match the expected format:
1. Check field names match exactly (case-sensitive)
2. Verify JSON fields are properly structured
3. Ensure enumeration values are correct

## Next Steps

Once setup is complete:
1. Your Next.js app will automatically start using Strapi data
2. You can manage products through the Strapi admin interface
3. Add new products, update existing ones, and manage site settings
4. Changes will be reflected immediately on your website

## Media Files

For images, you'll need to:
1. Upload images to Strapi's media library
2. Update the `images` field in each product to reference the uploaded media
3. The current placeholder images will be replaced with actual product photos

The Strapi integration will automatically handle image optimization and delivery.

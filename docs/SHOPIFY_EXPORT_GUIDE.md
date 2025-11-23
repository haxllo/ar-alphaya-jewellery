# Shopify Export Guide

This guide explains how to export your products from AR Alphaya Jewellery to Shopify using the CSV export feature.

## How to Export Products

### From Admin Dashboard

You have two options for exporting products:

#### Option 1: Export All Products

1. **Go to Admin Products Page**
   - Navigate to: `/admin/products`
   - You'll see all your products listed

2. **Click "Export All" Button**
   - Located in the top right, next to "Help Guide" and "Add Product"
   - The button will show "Exporting..." while processing
   - Button is disabled if there are no products

3. **Download Starts Automatically**
   - File name: `shopify-products-YYYY-MM-DD.csv`
   - Saved to your Downloads folder
   - Ready to import into Shopify

#### Option 2: Export Selected Products

1. **Select Products**
   - Check the boxes next to products you want to export
   - Or use "Select All" checkbox in the table header
   - Selected count shows at the top

2. **Click "Export" Button**
   - Located in the bulk actions toolbar (appears when items are selected)
   - Next to "Publish", "Draft", and "Delete" buttons
   - Shows "Exporting..." while processing

3. **Download Starts Automatically**
   - Only selected products are exported
   - Selection is cleared after successful export
   - File name: `shopify-products-YYYY-MM-DD.csv`

## What Gets Exported

The CSV file includes:
- ✅ All product information (name, description, price)
- ✅ Product images (all images included)
- ✅ Product variants (sizes and gemstones)
- ✅ SKU, category, tags, materials
- ✅ Stock status, weight, dimensions
- ✅ SEO information (title, description)
- ✅ Proper Shopify formatting

### CSV Format Compliance
- **UTF-8 Encoding**: File includes UTF-8 BOM for Excel compatibility
- **Shopify Standard**: Follows official Shopify CSV format exactly
- **Product Category**: Uses Shopify's standard taxonomy for jewelry
- **Status Format**: Exports as "active" or "draft" (Shopify standard)

### Price Conversion
- Your prices are stored in cents (e.g., 7489900 = Rs. 74,899)
- Export automatically converts to Shopify format (74899.00)

### Product Variants
If your product has sizes or gemstones:
- Each combination creates a separate variant row
- Gemstone price adjustments are automatically calculated
- Variant SKUs are auto-generated: `{SKU}-{SIZE}-{GEMSTONE}`

### Images
- All product images are included
- First image is set as main product image
- Additional images added as separate rows
- Images remain on your Uploadcare CDN

## How to Import to Shopify

### Step 1: Create Shopify Account
1. Go to [shopify.com](https://www.shopify.com)
2. Sign up for free trial ($1/month for 3 months)
3. Complete basic store setup

### Step 2: Import CSV
1. In Shopify Admin, go to **Products**
2. Click **Import** button (top right)
3. Select **"Upload a Shopify-formatted CSV file"**
4. Click **"Add file"** and select your exported CSV
5. Click **"Upload and continue"**

### Step 3: Review Import
1. Shopify will show a preview
2. Check for any errors or warnings
3. Review product mapping
4. Click **"Import products"**

### Step 4: Verify Products
1. Check your products list
2. Verify images loaded correctly
3. Check variants are correct
4. Test checkout with a product

## Using Shopify Buy Button

Once products are imported to Shopify:

### Step 1: Enable Buy Button Channel
1. In Shopify Admin, go to **Sales channels**
2. Click **"+"** button
3. Select **"Buy Button"**
4. Click **"Add channel"**

### Step 2: Create Buy Button
1. Go to **Sales channels** → **Buy Button**
2. Click **"Create Buy Button"**
3. Select product or collection
4. Customize appearance
5. Copy the generated code

### Step 3: Add to Your Website
See `SHOPIFY_BUY_BUTTON_INTEGRATION.md` for integration instructions.

## Important Notes

### Product Status
- **Published products** → Export as "active" (visible in Shopify)
- **Draft products** → Export as "draft" (hidden in Shopify)

### Categories
Your categories are mapped to Shopify:
- **Product category**: "Apparel & Accessories > Jewelry" (for Google Shopping)
- **Type**: Your original category (Rings, Earrings, etc.)

### Inventory
- Products "in stock" → 100 units in Shopify
- Products "out of stock" → 0 units in Shopify
- You can adjust quantities after import

### Vendor
- All products are tagged as: "AR Alphaya Jewellery"

## Troubleshooting

### Export Button Disabled
- **No products**: Add products first
- **Still loading**: Wait for products to load

### Export Failed
- Check your internet connection
- Refresh the page and try again
- Check browser console for errors

### Import Errors in Shopify
- **Missing images**: Images might take time to load from URLs
- **Variant errors**: Check that size/gemstone options are valid
- **Price format**: Should be decimal (e.g., 74899.00)

### Images Not Showing
- Uploadcare URLs should work directly
- If issues, consider downloading images and re-uploading to Shopify

## Next Steps After Export

1. **Import to Shopify** (see above)
2. **Set up payment gateway** in Shopify
   - Shopify Payments (if available in Sri Lanka)
   - Or add PayPal, Stripe, etc.
3. **Configure shipping** rates and zones
4. **Set up taxes** for Sri Lanka
5. **Add Buy Button** to your existing website
6. **Test checkout** flow thoroughly

## Alternative: Direct API Integration

For more control, consider using Shopify's Storefront API:
- Fetch products via GraphQL
- Build custom cart in your Next.js app
- Redirect to Shopify checkout
- See Shopify documentation for details

## Support

If you need help:
1. Check Shopify's import documentation
2. Contact Shopify support for import issues
3. For export issues, check the API logs at `/api/admin/products/export`

---

**Last Updated**: 2024
**Related Docs**: 
- `SHOPIFY_BUY_BUTTON_INTEGRATION.md` (for embedding Buy Button)
- `PAYMENT_GATEWAY_OPTIONS.md` (for payment alternatives)

# AR Alphaya Jewellery - Admin Portal Guide

**Last Updated:** January 13, 2025  
**For:** AR Alphaya Jewellery Team  
**Version:** 1.0

---

## 📋 Table of Contents

1. [Accessing the Admin Portal](#accessing-the-admin-portal)
2. [Admin Credentials](#admin-credentials)
3. [Dashboard Overview](#dashboard-overview)
4. [Managing Products](#managing-products)
5. [Product Operations](#product-operations)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Support](#support)

---

## 🔐 Accessing the Admin Portal

### Step 1: Navigate to Admin URL

**Production URL:** `https://aralphayajewellery.com/admin`  
**Local Development:** `http://localhost:3000/admin`

### Step 2: Sign In

1. Click the **"Sign In"** button in the top right corner of the website
2. You'll be redirected to the authentication page
3. Enter your admin credentials (see below)
4. Click **"Sign in with Email"**

### Step 3: Access Admin Panel

- Once signed in, navigate to `/admin` or click your profile icon → **Admin Panel**
- You'll see the product management dashboard

---

## 🔑 Admin Credentials

### Production Credentials

**Email:** `aralphayajewellery@gmail.com`  
**Password:** `admin@123`

> ⚠️ **Security Notes:**
> - Change the default password immediately after first login
> - Never share credentials via email or unsecured channels
> - Use a strong password with at least 12 characters
> - Consider using a password manager (LastPass, 1Password, etc.)


### Setting Up Admin Access (ignore if admin)

If you need to add a new admin user:

1. **Create User Account:**
   - Go to your Supabase dashboard: https://supabase.com/dashboard
   - Navigate to **Authentication** → **Users**
   - Click **"Add User"**
   - Enter email address and generate password
   - Copy the user's UUID

2. **Grant Admin Access:**
   - Go to **SQL Editor** in Supabase
   - Run this query (replace with actual email):
   ```sql
   INSERT INTO public.admin_users (user_id) 
   VALUES ((SELECT id FROM auth.users WHERE email = 'admin@example.com'));
   ```

3. **Verify Access:**
   - Sign in with the new credentials
   - Navigate to `/admin` to confirm access

---

## 📊 Dashboard Overview

### Main Admin Sections

1. **Product Management** (`/admin/products`)
   - View all products
   - Add new products
   - Edit existing products
   - Bulk operations

2. **Product Statistics**
   - Total products
   - Published vs Draft
   - Featured products
   - Out of stock items

### Navigation

- **Dashboard Icon:** Returns to product list
- **Add Product:** Create new jewelry pieces
- **Search:** Find products by name or description
- **Filters:** Filter by status, collection, or stock

---

## 🛍️ Managing Products

### Product Overview Page

When you access `/admin/products`, you'll see:

- **Statistics Bar:** Quick stats about your inventory
- **Product Grid:** Visual cards showing each product
- **Action Buttons:** Edit, View, Delete options
- **Bulk Selection:** Select multiple products for batch operations

### Product Information Displayed

Each product card shows:
- **Product Image:** Primary photo
- **Product Name:** Title of the jewelry piece
- **Status Badge:** Published or Draft
- **Stock Status:** In Stock or Out of Stock
- **Price:** Current selling price
- **Featured Flag:** ⭐ indicates featured items
- **Collections:** Which collection(s) the product belongs to

---

## ➕ Adding a New Product

### Step-by-Step Process

1. **Click "Add Product"** button (top right)

2. **Fill in Product Details:**

   **Basic Information:**
   - **Name:** Product title (e.g., "Sapphire & Gold Ring")
   - **Description:** Full description (supports markdown)
   - **Short Description:** Brief summary for listings
   - **Price:** Base price in LKR (e.g., 25000)

   **Product Status:**
   - **Status:** Choose "published" to make live, "draft" to hide
   - **Featured:** Toggle to feature on homepage
   - **In Stock:** Toggle availability

   **Categorization:**
   - **Collection:** Select one or more collections
     - Rings
     - Necklaces
     - Earrings
     - Bracelets
     - Pendants
     - Brooches
   - **Gemstone Types:** Select gemstones used
   - **Metal Types:** Select metal(s) used

   **Specifications:**
   - **SKU:** Unique product code (optional)
   - **Weight:** Weight in grams
   - **Dimensions:** Length, Width, Height
   - **Size Options:** Available sizes (if applicable)

   **Images:**
   - **Primary Image:** Main product photo
   - **Additional Images:** Multiple angles, detail shots
   - Recommended: 1200x1200px, white background
   - Format: JPG or PNG

3. **Save Product:**
   - Click **"Create Product"** to publish immediately
   - Or **"Save as Draft"** to review later

---

## ✏️ Editing an Existing Product

### Quick Edit

1. Find the product in the grid view
2. Click the **Edit** icon (pencil) on the product card
3. Modify any fields
4. Click **"Update Product"** to save changes

### Bulk Status Changes

1. Select multiple products using checkboxes
2. Click **"Bulk Actions"** dropdown
3. Choose:
   - **Publish Selected:** Make multiple products live
   - **Unpublish Selected:** Hide multiple products
   - **Delete Selected:** Remove multiple products (⚠️ permanent)

---

## 🎯 Product Operations

### Publishing a Product

**To Make a Product Live:**
1. Edit the product
2. Set Status to **"published"**
3. Ensure "In Stock" is toggled ON
4. Click **"Update Product"**

**Product will appear:**
- On collection pages
- In search results
- On homepage (if featured)

### Featuring a Product

**To Feature on Homepage:**
1. Edit the product
2. Toggle **"Featured"** ON
3. Click **"Update Product"**

**Featured products appear:**
- Homepage "Featured Collection" section
- Top of collection pages
- Recommendations

### Managing Stock

**To Mark Out of Stock:**
1. Edit the product
2. Toggle **"In Stock"** OFF
3. Click **"Update Product"**

**Effects:**
- Product still visible but shows "Out of Stock"
- "Add to Cart" button disabled
- "Notify When Available" option appears

### Deleting a Product

⚠️ **Warning:** Deletion is permanent!

**To Delete:**
1. Click delete icon (trash) on product card
2. Confirm deletion in popup
3. Product removed from database

**Recommendation:** Instead of deleting, use "draft" status to hide products.

---

## 📸 Image Management

### Image Requirements

**Optimal Specifications:**
- **Resolution:** 1200x1200px minimum
- **Format:** JPG (for photos), PNG (for graphics)
- **File Size:** Under 2MB per image
- **Background:** White or transparent preferred
- **Aspect Ratio:** Square (1:1) for consistency

### Uploading Images

1. **During Product Creation/Edit:**
   - Click **"Upload Images"** area
   - Select files from computer
   - Images upload automatically

2. **Image Order:**
   - First image = Primary (shows in listings)
   - Drag to reorder
   - Delete unwanted images with X button

3. **Image Storage:**
   - Images stored on Uploadcare CDN
   - Automatically optimized for web
   - Secure and backed up

---

## 💰 Pricing Guidelines

### Setting Prices

- **Base Price:** Enter in Sri Lankan Rupees (LKR)
- **Format:** Whole numbers only (e.g., 25000, not 25,000)
- **Multi-Currency:** Automatic conversion for international customers

### Price Considerations

- Include cost of materials, labor, and markup
- Consider market rates for similar pieces
- Account for gemstone rarity and quality
- Factor in custom design complexity

---

## 🏷️ Collections & Categories

### Available Collections

1. **Rings**
   - Engagement rings
   - Fashion rings
   - Wedding bands

2. **Necklaces**
   - Pendants
   - Chains
   - Statement pieces

3. **Earrings**
   - Studs
   - Drops
   - Hoops

4. **Bracelets**
   - Bangles
   - Chain bracelets
   - Cuffs

5. **Pendants**
   - Gemstone pendants
   - Custom designs

6. **Brooches**
   - Traditional
   - Contemporary

### Assigning Collections

- Products can belong to multiple collections
- Select all relevant collections during creation/edit
- Helps customers find products through category browsing

---

## 🔍 Search & Filters

### Using Search

1. **Search Bar:** Located at top of product list
2. **Search By:**
   - Product name
   - Description keywords
   - SKU
3. **Real-time:** Results update as you type

### Applying Filters

**Filter Options:**
- **Status:** Published, Draft, All
- **Stock:** In Stock, Out of Stock, All
- **Collections:** Filter by specific collection
- **Featured:** Show only featured items

**To Filter:**
1. Click **"Filters"** button
2. Select criteria
3. Click **"Apply"**
4. Clear with **"Reset"** button

---

## 📊 Understanding Statistics

### Dashboard Stats

**Total Products:** All products in system

**Published:** Live products visible to customers

**Draft:** Hidden products being prepared

**Featured:** Products showcased on homepage

**Out of Stock:** Unavailable items

### Using Stats for Decisions

- **Low Published Count:** Time to add more products
- **High Draft Count:** Review and publish pending items
- **Many Out of Stock:** Update inventory or restock
- **Few Featured:** Select more star products

---

## ✅ Best Practices

### Product Creation

1. **Complete All Fields:** Don't leave blanks
2. **Quality Images:** Use high-resolution, well-lit photos
3. **Detailed Descriptions:** Include gemstones, metals, dimensions
4. **Accurate Pricing:** Double-check calculations
5. **Proper Categorization:** Select all relevant collections
6. **SEO-Friendly Titles:** Use descriptive, searchable names

### Regular Maintenance

**Daily:**
- Check for new orders
- Update stock status

**Weekly:**
- Review and publish drafts
- Update featured products
- Add new inventory

**Monthly:**
- Audit all product info
- Update prices if needed
- Remove discontinued items
- Check image quality

### Photography Tips

1. **Lighting:** Use natural light or softbox
2. **Background:** Plain white or neutral
3. **Multiple Angles:** Show front, side, top views
4. **Details:** Capture gemstone close-ups
5. **Consistency:** Use same setup for all products
6. **Context:** Show scale with hand/finger (for rings)

### Writing Descriptions

**Include:**
- Gemstone type and origin (e.g., "Sri Lankan blue sapphire")
- Metal type and purity (e.g., "22K gold")
- Dimensions and weight
- Special features (e.g., "handcrafted", "custom design")
- Care instructions
- Ethical sourcing details

**Example Good Description:**
```
Handcrafted sapphire ring featuring a stunning 2-carat oval-cut
Sri Lankan blue sapphire set in 22K recycled gold. The elegant
design showcases the deep blue hue of the ethically sourced 
gemstone, accented by delicate gold filigree work. 

Specifications:
- Sapphire: 2ct, oval cut, Sri Lankan origin
- Metal: 22K gold, 5.2g
- Ring size: Adjustable (size 6-8)
- Dimensions: 12mm x 10mm stone

Each piece is unique and made to order. Lead time: 4-6 weeks.
```

---

## 🐛 Troubleshooting

### Common Issues

**Problem:** Can't access admin panel  
**Solution:**
- Verify you're signed in with admin account
- Check email is added to admin_users table in Supabase
- Clear browser cache and try again

**Problem:** Images not uploading  
**Solution:**
- Check file size (must be under 5MB)
- Verify format (JPG or PNG only)
- Try a different browser
- Check internet connection

**Problem:** Products not appearing on site  
**Solution:**
- Verify status is "published"
- Check "In Stock" is toggled ON
- Confirm product has images
- Wait 1-2 minutes for cache to clear

**Problem:** Can't delete product  
**Solution:**
- Check if product has active orders
- Try refreshing the page
- Contact developer if issue persists

**Problem:** Lost unsaved changes  
**Solution:**
- Always click "Save" or "Update" before navigating away
- Browser may warn you about unsaved changes
- Consider drafting descriptions in a separate document first

---

## 🆘 Getting Help


### Resources

- **Admin Portal:** https://aralphayajewellery.com/admin
- **Supabase Dashboard:** https://supabase.com/dashboard
- **This Guide:** Keep bookmarked for reference

---

## 🔐 Security Reminders

### Protecting Your Admin Access

1. ✅ **Use strong passwords** (12+ characters, mixed case, numbers, symbols)
2. ✅ **Never share credentials** via email or messaging apps
3. ✅ **Log out when finished** especially on shared computers
4. ✅ **Keep credentials secure** use password manager
5. ✅ **Change password regularly** every 90 days recommended
6. ✅ **Report suspicious activity** immediately

### Data Safety

- All product data is automatically backed up
- Images stored securely on CDN
- Regular database backups maintained
- Can restore deleted products within 30 days (contact developer)

---

## 📝 Quick Reference

### Product Status Flow

```
Draft → Review → Published → Live on Site
         ↓
    Out of Stock → Back in Stock
         ↓
    Unpublished → Archive
```

### Essential Keyboard Shortcuts

- **Ctrl/Cmd + S:** Save changes (when editing)
- **Ctrl/Cmd + F:** Search products
- **Esc:** Close modals/dialogs

### Important URLs

- **Admin Portal:** `/admin`
- **Product Management:** `/admin/products`
- **Add New Product:** `/admin/products/new`
- **View Live Site:** `/`


---

**Document Version:** 1.0  
**Last Updated:** January 13, 2025  
**Next Review:** As needed

---

*This guide is maintained by the development team. For updates or corrections, please contact the developer.*

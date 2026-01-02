# AR Alphaya Jewellery - Admin Portal Guide

This guide covers how to manage your jewelry store using the **Payload CMS** admin panel.

---

## 🔐 Accessing the Admin Portal

### URL
- **Production:** `https://aralphayajewellery.com/admin`
- **Local:** `http://localhost:3000/admin`

### Sign In
Use your administrator email and password to log in. If you've forgotten your password, please contact the system administrator.

---

## 🛍️ Managing Products

The **Products** collection is where you manage all the jewelry items displayed on your website.

### Viewing Products
Click on **Products** in the left sidebar to see a list of all items. You can use the search bar and filters to find specific products.

### Adding a New Product
1. Click **Create New** in the Products list view.
2. Fill in the required fields:
   - **Name:** The title of the jewelry piece.
   - **Slug:** Auto-generated URL-friendly name.
   - **Price:** Current price in LKR.
   - **Images:** Select or upload images from the Media library.
   - **Description:** A detailed description of the item.
3. Click **Save** or **Publish** to make the product live.

### Product Fields Explained
- **Status:** Set to `Published` to show on the site, or `Draft` to hide.
- **Featured:** Toggle this on to show the product on the homepage.
- **In Stock:** Indicates if the item can be purchased.
- **Category:** Choose from Rings, Necklaces, Earrings, etc.
- **Materials:** List the metals used (e.g., 22K Gold, Sterling Silver).

---

## 📸 Media & Images

All images are managed through the **Media** collection and delivered via **Uploadcare CDN** for maximum performance and persistent cloud storage.

### Image Requirements
- **Format:** JPG, PNG, or WebP.
- **Ratio:** Square (1:1) is recommended for product thumbnails.
- **Size:** Keep files under 2MB for faster uploads.

### How to Upload
1. When editing a product, click the **Images** field.
2. You can upload files directly to Payload. 
3. **Note on Uploadcare:** The system is configured to use Uploadcare for serving images. When you upload an image, ensure you provide the alternative text (alt) for SEO.

### Legacy Uploadcare URLs
If you have existing Uploadcare URLs (e.g., `https://ucarecdn.com/...`), you can continue to use them. The system automatically optimizes these URLs for the best customer experience.

---

## 👤 User Management

Manage administrative users in the **Users** collection.

- **Creating Admins:** Only existing administrators can create new users.
- **Roles:** Ensure new users are granted the appropriate permissions to manage products.

---

## ✅ Best Practices

1. **High Quality Images:** Use professional photography with clean backgrounds (white/neutral).
2. **Clear Descriptions:** Include gemstone details, metal purity, and sizing information.
3. **Draft Mode:** Use "Draft" status while you are still editing a product to avoid showing incomplete listings to customers.
4. **Regular Updates:** Keep your "Featured" items and stock levels updated weekly.

---

## 🆘 Troubleshooting

**Images not appearing?**
Ensure the images have finished uploading and that you have saved the product after adding them.

**Product not on the website?**
Check that the status is set to `Published` and `In Stock` is enabled.

**Can't log in?**
Verify your internet connection and ensure you are using the correct administrator email.
# CMS Deployment Guide: Setting up Product Management

This guide walks through deploying the AR Alphaya Jewellery website with a fully functional CMS for product management.

## 🎯 Overview

Your client will be able to:
- ✅ Add new jewelry products through a web interface
- ✅ Edit existing product details, prices, and images
- ✅ Remove or mark products as out of stock
- ✅ Manage product categories and collections
- ✅ Upload and manage product images
- ✅ Track inventory and featured products

## 📋 Prerequisites

Before starting deployment:
- [ ] GitHub repository is ready and up-to-date
- [ ] All CMS configuration files are in place
- [ ] Netlify account is created
- [ ] Domain name is ready (optional, Netlify provides free subdomains)

## 🚀 Step-by-Step Deployment

### Step 1: Deploy to Netlify

1. **Connect Repository to Netlify:**
   - Go to [Netlify](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose GitHub and authorize Netlify
   - Select `ar-alphaya-jewellery` repository

2. **Configure Build Settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   Node version: 18
   ```

3. **Deploy the Site:**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Note your site URL (e.g., `https://amazing-site-name.netlify.app`)

### Step 2: Enable Netlify Identity (CMS Access)

1. **Enable Identity:**
   - In Netlify dashboard, go to Site Settings → Identity
   - Click "Enable Identity"

2. **Configure Registration:**
   - Set to "Invite only" (recommended for security)
   - Under "External providers," you can enable Google/GitHub login if desired

3. **Configure Git Gateway:**
   - Go to Settings → Identity → Services
   - Click "Enable Git Gateway"
   - This allows the CMS to commit changes to your repository

### Step 3: Set Up Environment Variables

1. **In Netlify Dashboard:**
   - Go to Site Settings → Environment Variables
   - Add the following variables:

   ```bash
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
   NEXT_PUBLIC_SITE_NAME=AR Alphaya Jewellery

   # Auth0 (if using authentication)
   AUTH0_SECRET=your-32-byte-secret-key
   AUTH0_BASE_URL=https://your-site-name.netlify.app
   AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
   AUTH0_CLIENT_ID=your-auth0-client-id
   AUTH0_CLIENT_SECRET=your-auth0-client-secret

   # PayHere (if using payments)
   NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your-merchant-id
   PAYHERE_MERCHANT_SECRET=your-merchant-secret
   NEXT_PUBLIC_PAYHERE_SANDBOX=false
   ```

### Step 4: Invite CMS Users

1. **Invite Your Client:**
   - In Netlify dashboard: Identity → Invite users
   - Enter your client's email address
   - They'll receive an invitation email
   - They set their password and gain CMS access

2. **Test CMS Access:**
   - Go to `https://your-site.netlify.app/admin`
   - Sign in with the invited user credentials
   - Verify you can see the Products and Site Settings sections

### Step 5: Configure Custom Domain (Optional)

1. **Add Custom Domain:**
   - In Netlify: Site Settings → Domain management
   - Click "Add custom domain"
   - Enter your domain name

2. **Configure DNS:**
   - Update your domain's DNS settings as instructed by Netlify
   - SSL certificate will be automatically provided

3. **Update Environment Variables:**
   - Change `NEXT_PUBLIC_SITE_URL` to your custom domain
   - Update any Auth0 callback URLs to use the custom domain

## 🧪 Testing the CMS

### Test Product Management

1. **Access CMS:**
   - Go to `https://your-site.netlify.app/admin`
   - Sign in with your credentials

2. **Create a Test Product:**
   - Click "Products" → "New Product"
   - Fill in all required fields:
     - Product ID: `TEST-CMS-001`
     - Name: `Test CMS Product`
     - Slug: `test-cms-product`
     - Price: `50000`
     - Category: `rings`
     - Upload a test image
     - Mark as "In Stock"

3. **Verify on Website:**
   - Visit your live site
   - Check that the product appears in the rings collection
   - Verify product page loads correctly
   - Confirm image displays properly

4. **Edit the Product:**
   - Go back to CMS
   - Edit the test product
   - Change the price or description
   - Publish changes
   - Verify changes appear on the website

5. **Delete Test Product:**
   - Delete the test product from CMS
   - Confirm it's removed from the website

## 📊 CMS Features Enabled

### For Your Client:
- **Product Management**: Add, edit, delete products
- **Image Upload**: Direct image uploads to the site
- **Inventory Tracking**: Mark items as in/out of stock
- **Featured Products**: Control homepage product displays
- **Collections**: Manage product categories
- **Rich Text Editing**: Format product descriptions

### Technical Features:
- **Git-based**: All changes are version controlled
- **Real-time**: Changes appear immediately on the website
- **Mobile-friendly**: CMS works on tablets and phones
- **Role-based**: Control who can access the CMS
- **Backup**: All data is stored in your Git repository

## 🔧 Maintenance and Updates

### Regular Tasks:
- **Monitor CMS usage** for any issues
- **Update dependencies** monthly
- **Backup repository** regularly (GitHub handles this automatically)
- **Monitor site performance** with Netlify analytics

### Client Support:
- **Provide CMS training** using the CLIENT_CMS_GUIDE.md
- **Set up communication channel** for questions
- **Schedule periodic check-ins** to ensure smooth operation

## 🚨 Troubleshooting

### Common Issues:

**CMS won't load:**
- Check Netlify Identity is enabled
- Verify Git Gateway is configured
- Ensure user has been invited and confirmed

**Images won't upload:**
- Check file size limits (10MB default)
- Verify uploads folder exists
- Check browser console for errors

**Changes don't appear:**
- Wait 2-3 minutes for build to complete
- Check Netlify deploy logs
- Clear browser cache

**Build failures:**
- Check environment variables are set
- Review build logs in Netlify
- Ensure all dependencies are in package.json

## 📞 Post-Deployment Checklist

- [ ] Site deploys successfully
- [ ] CMS is accessible at `/admin`
- [ ] Client can log into CMS
- [ ] Test product creation/editing works
- [ ] Images upload successfully
- [ ] Changes appear on live site
- [ ] All environment variables are configured
- [ ] Custom domain is working (if applicable)
- [ ] SSL certificate is active
- [ ] Client has received CMS training materials

## 📈 Success Metrics

After deployment, your client should be able to:
- Add a new product in under 5 minutes
- Upload and manage product images easily
- Update pricing and inventory status instantly
- Access the CMS from any device with internet
- See changes on the website immediately

---

**Next Steps:**
1. Provide client with login credentials
2. Schedule training session
3. Share CLIENT_CMS_GUIDE.md
4. Set up ongoing support arrangement

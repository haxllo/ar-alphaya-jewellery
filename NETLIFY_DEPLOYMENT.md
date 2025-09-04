# 🚀 Netlify Deployment Guide
## AR Alphaya Jewellery Website

This guide will help you deploy your AR Alphaya Jewellery website to Netlify with all the necessary configurations.

---

## 📋 Pre-Deployment Checklist

### ✅ **Repository Requirements**
- [x] GitHub repository: https://github.com/haxllo/ar-alphaya-jewellery
- [x] Latest code pushed to `main` branch
- [x] All build configurations in place
- [x] Environment variables documented

### ✅ **Build Configuration**
- [x] `netlify.toml` configured for static export
- [x] `next.config.mjs` set to output: 'export'
- [x] Build command: `npm run build`
- [x] Publish directory: `out`

---

## 🌐 **Step 1: Create Netlify Site**

### Option A: Deploy from GitHub (Recommended)
1. **Login to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with your GitHub account

2. **Import from Git**
   - Click "New site from Git"
   - Choose "GitHub" as your Git provider
   - Select your repository: `ar-alphaya-jewellery`
   - Choose the `main` branch

3. **Configure Build Settings**
   ```
   Base directory: (leave blank)
   Build command: npm run build
   Publish directory: out
   ```

### Option B: Manual Drag & Drop
1. Build locally: `npm run build`
2. Drag the `out` folder to Netlify deploy area

---

## ⚙️ **Step 2: Environment Variables**

In your Netlify dashboard, go to **Site settings → Environment variables** and add:

### **Required Variables:**
```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
NEXT_PUBLIC_SITE_NAME=AR Alphaya Jewellery
```

### **Optional but Recommended:**
```bash
# PayHere Payment Gateway
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_merchant_secret
NEXT_PUBLIC_PAYHERE_SANDBOX=true

# Analytics (if needed)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Email Service (for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

---

## 🔐 **Step 3: Enable Netlify Identity**

### **For CMS Admin Access:**
1. **Enable Identity**
   - Go to **Site settings → Identity**
   - Click "Enable Identity"

2. **Configure Registration**
   - Set registration to "Invite only" (recommended)
   - Enable "Git Gateway"

3. **Invite Yourself**
   - Go to **Identity → Invite users**
   - Add your email address
   - Check your email and accept the invitation

### **Configure Git Gateway:**
1. In **Site settings → Identity → Services**
2. Click "Enable Git Gateway"
3. This allows CMS to commit changes to your repository

---

## 📊 **Step 4: Custom Domain (Optional)**

### **Add Custom Domain:**
1. **Purchase Domain** (if you don't have one)
   - Recommended: Namecheap, GoDaddy, or Google Domains

2. **In Netlify Dashboard:**
   - Go to **Site settings → Domain management**
   - Click "Add custom domain"
   - Enter your domain: `aralphayajewellery.com`

3. **Configure DNS:**
   - Add these DNS records at your domain provider:
   ```
   Type: A Record
   Name: @ (or blank)
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   ```

4. **Enable HTTPS:**
   - Netlify will automatically provision SSL certificate
   - This may take a few minutes to activate

---

## 🛠️ **Step 5: Build Settings Verification**

### **Ensure These Settings in Netlify:**
```
Build command: npm run build
Publish directory: out
Node version: 18 (automatically detected)
```

### **Build Environment Variables:**
```bash
NODE_VERSION=18
NPM_FLAGS=--prefix=/opt/buildhome/repo
```

---

## 📝 **Step 6: Deploy Hooks (Optional)**

### **For Automated CMS Updates:**
1. **Create Deploy Hook**
   - Go to **Site settings → Build & deploy**
   - Scroll to "Build hooks"
   - Create hook named "CMS Content Update"

2. **Use in CMS** (if using external CMS)
   - Add webhook URL to your CMS settings
   - Triggers rebuild when content changes

---

## 🧪 **Step 7: Test Your Deployment**

### **Verify These Features Work:**
- ✅ **Homepage loads** with brand logo and styling
- ✅ **Navigation works** - all collection pages load
- ✅ **Product pages** display correctly
- ✅ **Shopping cart** functions properly
- ✅ **Cart persistence** works across page refreshes
- ✅ **Responsive design** on mobile devices
- ✅ **CMS admin** accessible at `/admin`
- ✅ **Contact forms** (if configured)

### **Test URLs:**
```
Homepage: https://your-site.netlify.app/
Collections: https://your-site.netlify.app/collections/rings/
Products: https://your-site.netlify.app/products/sample-blue-sapphire-ring/
Cart: https://your-site.netlify.app/cart/
CMS Admin: https://your-site.netlify.app/admin
```

---

## 🚨 **Troubleshooting**

### **Common Issues & Solutions:**

#### **Build Fails:**
```bash
# Check build logs for:
Error: Command failed with exit code 1

# Solutions:
1. Verify all dependencies in package.json
2. Check for TypeScript errors
3. Ensure all imports are correctly typed
4. Run `npm run build` locally first
```

#### **404 Errors on Routes:**
```bash
# Solution: Already configured in netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### **CMS Admin Not Loading:**
```bash
# Check:
1. Netlify Identity is enabled
2. Git Gateway is configured
3. admin/config.yml exists
4. User is invited and confirmed
```

#### **Images Not Loading:**
```bash
# Solution: Already configured in next.config.mjs
images: {
  unoptimized: true
}
```

---

## 📈 **Step 8: Performance Optimization**

### **Enable These Netlify Features:**
1. **Asset Optimization**
   - Go to **Site settings → Build & deploy**
   - Enable "Bundle CSS", "Minify CSS", "Minify JS"

2. **Form Handling**
   - Go to **Site settings → Forms**
   - Enable form detection for contact forms

3. **Analytics** (optional)
   - Enable Netlify Analytics for visitor insights

---

## 🔒 **Security Best Practices**

### **Already Configured:**
- ✅ Security headers in `netlify.toml`
- ✅ Content Security Policy
- ✅ XSS Protection
- ✅ HTTPS enforcement

### **Additional Recommendations:**
- Use environment variables for sensitive data
- Enable branch deploy previews for testing
- Set up monitoring and alerts

---

## 📞 **Support Resources**

- **Netlify Documentation:** https://docs.netlify.com/
- **Next.js Static Export:** https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
- **Netlify CMS Guide:** https://www.netlifycms.org/docs/
- **PayHere Integration:** https://www.payhere.lk/docs/

---

## 🎉 **Post-Deployment Checklist**

After successful deployment:

- [ ] **Test all functionality** on the live site
- [ ] **Add custom domain** (if applicable)
- [ ] **Set up Google Analytics** (if needed)
- [ ] **Configure PayHere** with production credentials
- [ ] **Test CMS admin** functionality
- [ ] **Invite team members** to Netlify Identity
- [ ] **Set up contact form** notifications
- [ ] **Enable Netlify Analytics**
- [ ] **Create backup/monitoring** alerts

---

## 🚀 **Go Live!**

Once everything is configured and tested:

1. **Update DNS** to point to your custom domain
2. **Share your website**: `https://aralphayajewellery.com`
3. **Monitor performance** with Netlify Analytics
4. **Update business listings** with new website URL

**Congratulations! Your AR Alphaya Jewellery website is now live! 🎊**

---

*Last updated: September 4, 2025*
*Next.js Version: 14.2.5*
*Node Version: 18+*

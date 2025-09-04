# Deployment Guide

This guide will help you deploy AR Alphaya Jewellery to Netlify with all necessary configurations.

## Prerequisites

1. GitHub account with the project repository
2. Netlify account
3. PayHere merchant account (for payment processing)
4. Domain name (optional, Netlify provides free subdomains)

## Step 1: Netlify Deployment

### Automatic Deployment

1. **Connect Repository to Netlify:**
   - Go to [Netlify](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose GitHub and authorize Netlify
   - Select your `ar-alphaya-jewellery` repository

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `18` (set in Environment variables)

3. **Deploy Site:**
   - Click "Deploy site"
   - Netlify will automatically deploy on every push to main branch

### Manual Configuration

If you need to configure manually:

```bash
# Clone your repository
git clone https://github.com/yourusername/ar-alphaya-jewellery.git
cd ar-alphaya-jewellery

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to Netlify
netlify deploy --prod --dir=out
```

## Step 2: Environment Variables

In your Netlify dashboard, go to Site Settings → Environment Variables and add:

### Required Variables

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
NEXT_PUBLIC_SITE_NAME=AR Alphaya Jewellery

# Auth0 Authentication (REQUIRED)
AUTH0_SECRET="your-generated-secret-key"
AUTH0_BASE_URL="https://your-site-name.netlify.app"
AUTH0_ISSUER_BASE_URL="https://your-tenant.auth0.com"
AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_CLIENT_SECRET="your-auth0-client-secret"
AUTH0_SCOPE="openid profile email"
AUTH0_LOGIN_RETURN_TO="/profile"
AUTH0_LOGOUT_RETURN_TO="/"
```

### PayHere Configuration

```
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_merchant_secret
NEXT_PUBLIC_PAYHERE_SANDBOX=true  # Set to false for production
```

### Optional Variables

```
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=123456789

# Email service (for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## Step 3: Enable Netlify Identity

1. **Enable Identity:**
   - Go to Site Settings → Identity
   - Click "Enable Identity"

2. **Configure Registration:**
   - Set registration to "Invite only" or "Open" as needed
   - Configure external providers if desired (Google, GitHub, etc.)

3. **Add Identity Widget:**
   - The site already includes Netlify Identity widget
   - Test login at `/admin` after deployment

## Step 4: Configure Auth0

1. **Create Auth0 Account:**
   - Sign up at [Auth0](https://auth0.com/)
   - Create a new application (Single Page Application)
   - Note your Domain, Client ID, and Client Secret

2. **Configure Auth0 Application:**
   - **Allowed Callback URLs**: `http://localhost:3001/api/auth/callback,https://your-site-name.netlify.app/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3001,https://your-site-name.netlify.app`
   - **Allowed Web Origins**: `http://localhost:3001,https://your-site-name.netlify.app`

3. **Generate Secret Key:**
   ```bash
   openssl rand -hex 32
   ```

4. **Add Auth0 Environment Variables:**
   - Add all Auth0 variables to Netlify environment variables
   - Ensure URLs match your deployment domain

## Step 5: Configure PayHere

1. **Get PayHere Credentials:**
   - Sign up at [PayHere](https://www.payhere.lk/)
   - Get your Merchant ID and Merchant Secret
   - Test in sandbox mode first

2. **Update Environment Variables:**
   - Add your PayHere credentials to Netlify environment variables
   - Set `NEXT_PUBLIC_PAYHERE_SANDBOX=false` for production

3. **Test Payment Flow:**
   - Add items to cart
   - Go to checkout
   - Test payment with PayHere test cards

## Step 5: Configure Domain (Optional)

1. **Custom Domain:**
   - Go to Site Settings → Domain management
   - Add your custom domain
   - Configure DNS settings as instructed

2. **SSL Certificate:**
   - Netlify automatically provides SSL certificates
   - Your site will be available at `https://yourdomain.com`

## Step 6: Content Management Setup

1. **Access CMS:**
   - Go to `https://your-site-name.netlify.app/admin`
   - Login with Netlify Identity

2. **Add Products:**
   - Click "Products" in the CMS
   - Add new products with images and details
   - Save and publish

3. **Upload Images:**
   - Use the CMS media library
   - Images are automatically optimized

## Step 7: Testing

### Pre-deployment Checklist

```bash
# Run tests locally
npm run type-check
npm run lint
npm run build
```

### Post-deployment Testing

1. **Navigation:**
   - ✅ Test all menu links
   - ✅ Test mobile menu
   - ✅ Test footer links

2. **Product Functionality:**
   - ✅ Browse collections
   - ✅ View product details
   - ✅ Add products to cart
   - ✅ Size selection works

3. **Cart & Checkout:**
   - ✅ Cart persists across pages
   - ✅ Quantity updates work
   - ✅ Checkout form validation
   - ✅ Payment integration

4. **CMS:**
   - ✅ Login to admin panel
   - ✅ Add/edit products
   - ✅ Image uploads work

5. **Responsive Design:**
   - ✅ Mobile layout
   - ✅ Tablet layout
   - ✅ Desktop layout

## Troubleshooting

### Build Errors

- Check Netlify build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Payment Issues

- Check PayHere sandbox vs production settings
- Verify merchant credentials
- Check browser console for errors

### CMS Issues

- Ensure Netlify Identity is enabled
- Check that Git Gateway is configured
- Verify CMS config file is correct

### Performance

- Images should be optimized automatically
- Use Netlify's CDN for fast loading
- Monitor with Lighthouse or similar tools

## Security

- Environment variables are encrypted by Netlify
- PayHere handles sensitive payment data
- SSL is automatically provided
- CSP headers are configured in `netlify.toml`

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Push updates
git add .
git commit -m "Update dependencies"
git push
```

### Backup

- Code is backed up in GitHub
- Product data is in your repository
- Images are stored in Netlify's CDN
- Consider regular exports of CMS data

## Support

If you encounter issues:

1. Check Netlify documentation
2. Review PayHere integration docs
3. Check GitHub issues for this project
4. Contact support teams for respective services

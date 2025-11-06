# Netlify Environment Variables Guide

This guide lists all environment variables needed for production deployment on Netlify.

## Required Environment Variables

### Authentication (NextAuth + Supabase)

```bash
# NextAuth Configuration
AUTH_SECRET=<generate-using-openssl-rand-base64-32>
AUTH_URL=https://your-site.netlify.app
NEXTAUTH_URL=https://your-site.netlify.app

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

**Important Notes:**
- `AUTH_SECRET`: Generate using:
  - **Node.js**: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
  - **Windows PowerShell**: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))`
  - **Online**: Use a secure random string generator (32+ characters)
- `AUTH_URL` and `NEXTAUTH_URL`: Should match your production domain
- `SUPABASE_SERVICE_ROLE_KEY`: Keep this **SECRET** - never expose to client
- `NEXT_PUBLIC_*`: These are exposed to the browser, safe for client-side use

### Payment Gateway (PayHere)

```bash
# PayHere Merchant Configuration
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=<your-merchant-id>
PAYHERE_MERCHANT_SECRET=<your-merchant-secret>
NEXT_PUBLIC_PAYHERE_SANDBOX=false  # Set to 'true' for testing
```

**Important Notes:**
- `PAYHERE_MERCHANT_SECRET`: Keep this **SECRET** - never expose to client
- Set `NEXT_PUBLIC_PAYHERE_SANDBOX=false` for production
- Use `true` only for testing/development

### Site Configuration

```bash
# Site URLs
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
NEXT_PUBLIC_SITE_NAME=AR Alphaya Jewellery
```

### Email Configuration (Optional - for abandoned carts)

```bash
# Email Service (if using SendGrid, Resend, etc.)
EMAIL_FROM=noreply@your-site.com
EMAIL_SERVICE_API_KEY=<your-email-service-key>
ENABLE_ABANDONED_CART=true  # Set to 'false' to disable
```

### Sentry (Error Tracking - Optional)

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
SENTRY_AUTH_TOKEN=<your-sentry-auth-token>
SENTRY_ORG=<your-sentry-org>
SENTRY_PROJECT=<your-sentry-project>
```

### CMS Configuration (Decap CMS / Netlify CMS)

```bash
# Netlify CMS / Decap CMS
GIT_GATEWAY_ENABLED=true
GITHUB_TOKEN=<your-github-token>  # For Git Gateway
ADMIN_USER=<admin-username>
ADMIN_PASS=<admin-password>
```

### Other Configuration

```bash
# App Base URL (if different from site URL)
APP_BASE_URL=https://your-site.netlify.app

# Auth0 (if still using - can be removed after migration)
# AUTH0_BASE_URL=<deprecated>
# AUTH0_CLIENT_ID=<deprecated>
# AUTH0_CLIENT_SECRET=<deprecated>
# AUTH0_ISSUER_BASE_URL=<deprecated>
# AUTH0_SCOPE=<deprecated>
# AUTH0_COOKIE_SAME_SITE=<deprecated>
# AUTH0_COOKIE_SECURE=<deprecated>
```

## Environment Variables by Scope

### Build-time Variables (Available during build)

All variables are available during build, but only `NEXT_PUBLIC_*` are exposed to the browser.

### Runtime Variables (Server-side only)

These are **never** exposed to the client:
- `AUTH_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYHERE_MERCHANT_SECRET`
- `EMAIL_SERVICE_API_KEY`
- `GITHUB_TOKEN`
- `SENTRY_AUTH_TOKEN`
- `ADMIN_PASS`

### Client-side Variables (Exposed to browser)

These are safe to expose:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_PAYHERE_MERCHANT_ID`
- `NEXT_PUBLIC_PAYHERE_SANDBOX`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_ENABLE_ABANDONED_CART`

## Setting Variables in Netlify

### Method 1: Netlify Dashboard (Recommended)

1. Go to your site in Netlify Dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Enter the variable name and value
5. Select scope:
   - **All scopes**: Available everywhere
   - **Builds only**: Only during build
   - **Functions only**: Only in serverless functions
   - **Runtime only**: Only at runtime

### Method 2: Netlify CLI

```bash
# Set a variable
netlify env:set AUTH_SECRET "your-secret-value"

# Set for specific context
netlify env:set AUTH_SECRET "your-secret-value" --context production

# List all variables
netlify env:list

# Get a variable value
netlify env:get AUTH_SECRET
```

### Method 3: netlify.toml (Not Recommended for Secrets)

You can add non-sensitive variables in `netlify.toml`:

```toml
[build.environment]
  NEXT_PUBLIC_SITE_NAME = "AR Alphaya Jewellery"
  NEXT_PUBLIC_PAYHERE_SANDBOX = "false"
```

**Warning:** Never commit secrets to `netlify.toml` or version control!

## Production Checklist

### Before Deploying

- [ ] Generate `AUTH_SECRET` using Node.js or PowerShell (see guide above)
- [ ] Set `NEXT_PUBLIC_PAYHERE_SANDBOX=false` for production
- [ ] Update all URLs to production domain
- [ ] Verify Supabase project is in production mode
- [ ] Test PayHere with production credentials
- [ ] Set up email service (if using abandoned carts)
- [ ] Configure Sentry (if using error tracking)
- [ ] Remove or disable Auth0 variables (if migrated)

### Security Checklist

- [ ] All secrets are marked as **sensitive** in Netlify
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is never exposed to client
- [ ] `PAYHERE_MERCHANT_SECRET` is never exposed to client
- [ ] `AUTH_SECRET` is unique and secure
- [ ] No secrets in `netlify.toml` or version control
- [ ] Environment variables are scoped correctly

### Testing Checklist

- [ ] Authentication works (sign in/sign up)
- [ ] Cart syncs to Supabase
- [ ] Orders are created correctly
- [ ] PayHere payment flow works
- [ ] PayHere webhook updates order status
- [ ] Orders page displays correctly
- [ ] Abandoned cart tracking works (if enabled)
- [ ] Email notifications work (if configured)

## Troubleshooting

### Build Fails

**Error: Missing environment variable**
- Check that all required variables are set in Netlify
- Verify variable names match exactly (case-sensitive)
- Check variable scope (some may need to be available during build)

**Error: Invalid AUTH_SECRET**
- Generate a new secret using:
  - Node.js: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
  - PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))`
- Ensure it's at least 32 characters
- No special characters that need escaping

### Runtime Errors

**Error: Supabase connection failed**
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check Supabase project is active
- Verify RLS policies allow service role access

**Error: NextAuth configuration error**
- Verify `AUTH_SECRET` is set
- Check `AUTH_URL` and `NEXTAUTH_URL` match your domain
- Ensure URLs use `https://` in production

**Error: PayHere payment failed**
- Verify merchant ID and secret are correct
- Check `NEXT_PUBLIC_PAYHERE_SANDBOX` is set correctly
- Verify webhook URL is accessible: `https://your-site.netlify.app/api/checkout/payhere/notify`

## Quick Reference: Minimum Required Variables

For a basic production deployment, you need at minimum:

```bash
AUTH_SECRET=<32-char-secret>
AUTH_URL=https://your-site.netlify.app
NEXTAUTH_URL=https://your-site.netlify.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=<merchant-id>
PAYHERE_MERCHANT_SECRET=<merchant-secret>
NEXT_PUBLIC_PAYHERE_SANDBOX=false
```

## Migration from Auth0

If you've migrated from Auth0, you can **remove** these variables:

```bash
# Remove these (no longer needed)
AUTH0_BASE_URL
AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET
AUTH0_ISSUER_BASE_URL
AUTH0_SCOPE
AUTH0_COOKIE_SAME_SITE
AUTH0_COOKIE_SECURE
```

## Additional Resources

- [Netlify Environment Variables Docs](https://docs.netlify.com/environment-variables/overview/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)


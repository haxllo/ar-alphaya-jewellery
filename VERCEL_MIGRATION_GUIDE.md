# Vercel Migration Guide

This guide covers migrating from Netlify to Vercel and updating forms to use Supabase.

## ✅ Migration Status

### Completed
- ✅ Contact forms migrated to Supabase
- ✅ Newsletter subscriptions migrated to Supabase
- ✅ Product waitlist migrated to Supabase
- ✅ Removed Netlify Identity Loader (not needed on Vercel)
- ✅ Updated all API routes to use Supabase

### What Changed

1. **Contact Forms** (`/api/contact`)
   - Now saves to `contact_submissions` table in Supabase
   - Sends notification emails via Resend (if configured)
   - Tracks IP address and user agent

2. **Newsletter** (`/api/newsletter`)
   - New API route created
   - Saves to `newsletter_subscriptions` table
   - Supports preferences and source tracking
   - Handles reactivation of unsubscribed users

3. **Waitlist** (`/api/waitlist`)
   - Saves to `product_waitlist` table
   - Prevents duplicate entries
   - Tracks notification status

## 📋 Setup Steps

### 1. Run Supabase Schema

Execute the SQL schema in your Supabase dashboard:

```bash
# Run this file in Supabase SQL Editor:
SUPABASE_FORMS_SCHEMA.sql
```

This creates:
- `contact_submissions` table
- `newsletter_subscriptions` table
- `product_waitlist` table
- RLS policies
- Helper functions

### 2. Update Environment Variables

#### Vercel Environment Variables

Set these in your Vercel project settings:

```env
# Supabase (already configured)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@aralphayajewellery.com

# Site URLs (update for Vercel)
AUTH_URL=https://your-site.vercel.app
NEXTAUTH_URL=https://your-site.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
```

### 3. Remove Netlify-Specific Code

The following have been removed/updated:
- ✅ `NetlifyIdentityLoader` component removed from layout
- ✅ Netlify Forms dependencies removed
- ✅ Newsletter localStorage code replaced with Supabase

### 4. Update DNS (if using custom domain)

If you're using a custom domain with Vercel:

1. **Remove Netlify DNS records** (if any)
2. **Add domain in Vercel**:
   - Go to Project Settings → Domains
   - Add your domain
   - Follow Vercel's DNS instructions

3. **Update Resend DNS** (if using Resend):
   - Since you're no longer on Netlify, you'll need to add Resend DNS records to your domain registrar (Namecheap) or wherever your DNS is managed
   - See `NETLIFY_DNS_RESEND_SETUP.md` for reference (but add records where your DNS is managed)

## 🔍 Testing

### Test Contact Form

1. Go to `/contact`
2. Fill out and submit the form
3. Check Supabase `contact_submissions` table
4. Verify email notification (if Resend is configured)

### Test Newsletter

1. Use newsletter signup component
2. Check Supabase `newsletter_subscriptions` table
3. Try subscribing with same email (should show "already subscribed")
4. Test unsubscribe functionality

### Test Waitlist

1. Go to a product page
2. Click "Notify me when back in stock"
3. Check Supabase `product_waitlist` table
4. Try adding same product/email again (should prevent duplicate)

## 📊 Database Queries

### View Contact Submissions

```sql
SELECT * FROM contact_submissions 
ORDER BY created_at DESC 
LIMIT 10;
```

### View Newsletter Subscriptions

```sql
SELECT * FROM newsletter_subscriptions 
WHERE is_active = true 
ORDER BY subscribed_at DESC;
```

### View Waitlist

```sql
SELECT * FROM product_waitlist 
WHERE is_notified = false 
ORDER BY created_at DESC;
```

## 🚀 Vercel Deployment

### Initial Deployment

1. **Connect Repository**:
   - Go to Vercel Dashboard
   - Import your GitHub/GitLab repository

2. **Configure Build**:
   - Framework Preset: Next.js
   - Build Command: `npm run build` (or `next build`)
   - Output Directory: `.next`

3. **Set Environment Variables**:
   - Add all required env vars (see above)
   - Mark sensitive ones as "Encrypted"

4. **Deploy**:
   - Vercel will auto-deploy on push to main branch

### Post-Deployment

1. **Verify Forms**:
   - Test contact form submission
   - Test newsletter signup
   - Check Supabase for data

2. **Monitor Logs**:
   - Check Vercel logs for any errors
   - Monitor Supabase logs for database issues

## 🔄 Differences: Netlify vs Vercel

| Feature | Netlify | Vercel |
|---------|---------|--------|
| Forms | Built-in Forms | Supabase (custom) |
| Identity | Netlify Identity | NextAuth + Supabase |
| Functions | Netlify Functions | Next.js API Routes |
| DNS | Netlify DNS | Vercel DNS or external |
| Environment Variables | Netlify Dashboard | Vercel Dashboard |

## ⚠️ Important Notes

1. **Netlify Forms**: All form data is now in Supabase, not Netlify
2. **Netlify Identity**: Removed - using NextAuth + Supabase Auth
3. **DNS**: If using custom domain, update DNS records in Vercel
4. **Email**: Resend configuration should work the same on Vercel
5. **Admin Access**: Admin area may need different authentication (currently uses Basic Auth in middleware)

## 🐛 Troubleshooting

### Forms not saving

- Check Supabase RLS policies
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Vercel logs for errors

### Newsletter not working

- Verify API route is accessible: `/api/newsletter`
- Check browser console for errors
- Verify Supabase connection

### Waitlist not working

- Check product ID format
- Verify email validation
- Check Supabase `product_waitlist` table

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Resend Documentation](https://resend.com/docs)


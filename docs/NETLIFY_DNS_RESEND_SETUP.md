# Adding Resend DNS Records in Netlify

Since you're using Netlify's nameservers for `aralphayajewellery.com`, you need to add Resend's DNS records in Netlify, not Namecheap.

## Quick Steps

### 1. Access Netlify DNS Settings

1. Log in to [Netlify](https://app.netlify.com)
2. Select your site
3. Go to **Domain settings** (left sidebar)
4. Click on **"DNS"** tab
5. You should see existing DNS records

### 2. Add Resend DNS Records

After adding your domain to Resend, you'll get DNS records to add. Add them in Netlify:

#### SPF Record (TXT)

1. Click **"Add DNS record"**
2. **Type**: `TXT`
3. **Name**: `@` (or `aralphayajewellery.com`)
4. **Value**: `v=spf1 include:resend.com ~all`
5. Click **"Save"**

#### DKIM Records (CNAME)

For each DKIM record Resend provides (usually 2-3):

1. Click **"Add DNS record"**
2. **Type**: `CNAME`
3. **Name**: Enter exactly what Resend shows (e.g., `resend._domainkey`)
4. **Value**: Enter exactly what Resend shows (e.g., `resend._domainkey.resend.com`)
5. Click **"Save"**
6. Repeat for all DKIM records

#### DMARC Record (TXT - Optional)

1. Click **"Add DNS record"**
2. **Type**: `TXT`
3. **Name**: `_dmarc`
4. **Value**: `v=DMARC1; p=none; rua=mailto:dmarc@aralphayajewellery.com`
5. Click **"Save"**

### 3. Verify Records

1. Wait 5-10 minutes for DNS propagation
2. Check records are live: [MXToolbox TXT Lookup](https://mxtoolbox.com/TXTLookup.aspx)
3. Go to Resend dashboard → Domains
4. Click **"Verify"** on your domain
5. Status should change to **"Verified"** ✅

### 4. Set Environment Variables

Once verified, add to Netlify environment variables:

```bash
RESEND_API_KEY=re_your-api-key
EMAIL_FROM=AR Alphaya Jewellery <noreply@aralphayajewellery.com>
ENABLE_ABANDONED_CART=true
NEXT_PUBLIC_ENABLE_ABANDONED_CART=true
```

## Visual Guide: Finding DNS in Netlify

1. **Netlify Dashboard** → Your Site
2. **Domain settings** (left sidebar)
3. **DNS** tab
4. You'll see existing records (A, CNAME, etc.)
5. Click **"Add DNS record"** button
6. Fill in the form and save

## Important Notes

- **Don't remove existing DNS records** - Only add the new Resend records
- **Keep Netlify's nameservers** in Namecheap - Don't change them
- **DNS propagation** takes 5-30 minutes usually
- **Verify in Resend** after adding all records

## Troubleshooting

**Can't find DNS settings?**
- Make sure your domain is added to Netlify first
- Go to Domain settings → DNS tab

**Records not verifying?**
- Double-check values match exactly what Resend provided
- Wait longer for DNS propagation (up to 24 hours)
- Use [DNS Checker](https://dnschecker.org) to verify records are live globally

**Domain not added to Netlify?**
- Go to Domain settings → Add custom domain
- Enter `aralphayajewellery.com`
- Follow Netlify's verification steps


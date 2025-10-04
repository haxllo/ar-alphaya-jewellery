# Auth0 Configuration Guide

## Issue: 400 Bad Request on Callback

The 400 Bad Request error during the Auth0 callback is likely due to **missing callback URL configuration** in your Auth0 dashboard.

## Required Auth0 Dashboard Configuration

### 1. Login to Auth0 Dashboard
Go to: https://manage.auth0.com/

### 2. Navigate to Your Application
- Go to **Applications** → **Applications**
- Select your application: **DY77lMMbN32Y7RVvwAyFuZ3i4WaOW7CD**

### 3. Configure Callback URLs

In the **Application Settings**, find the **Allowed Callback URLs** field and add:

```
https://aralphaya.netlify.app/api/auth/callback
```

**Important:** Make sure there are NO trailing slashes!

### 4. Configure Logout URLs

In the **Allowed Logout URLs** field, add:

```
https://aralphaya.netlify.app
```

### 5. Configure Web Origins

In the **Allowed Web Origins** field, add:

```
https://aralphaya.netlify.app
```

### 6. Configure Origins (CORS)

In the **Allowed Origins (CORS)** field, add:

```
https://aralphaya.netlify.app
```

### 7. Application Type

Ensure your application type is set to:
- **Application Type:** Regular Web Application

### 8. Token Settings (Advanced)

Scroll down to **Advanced Settings** → **OAuth**:
- **JsonWebToken Signature Algorithm:** RS256
- **OIDC Conformant:** Enabled

## Environment Variables

Verify these environment variables in your Netlify deployment:

```env
AUTH0_SECRET="your-secret"
AUTH0_BASE_URL="https://aralphaya.netlify.app"
AUTH0_ISSUER_BASE_URL="https://dev-ipb2uf88kk01eg4g.us.auth0.com"
AUTH0_CLIENT_ID="DY77lMMbN32Y7RVvwAyFuZ3i4WaOW7CD"
AUTH0_CLIENT_SECRET="your-client-secret"
AUTH0_SCOPE="openid profile email"
```

**Critical:** 
- `AUTH0_BASE_URL` must match EXACTLY what you configure in Auth0
- No trailing slashes
- Must use HTTPS in production

## Testing After Configuration

1. Save all changes in Auth0 dashboard
2. Redeploy your Netlify application (to ensure environment variables are loaded)
3. Try logging in again
4. Check Netlify Function Logs for detailed error messages:
   - Go to Netlify Dashboard → Functions → Edge Functions
   - Look for logs from `/api/auth/callback`

## Troubleshooting

### Still Getting 400 Error?

1. **Check Netlify Environment Variables:**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Verify `AUTH0_BASE_URL` is exactly: `https://aralphaya.netlify.app`

2. **Check Auth0 Application URLs:**
   - All URLs should be HTTPS
   - No trailing slashes
   - Exact match with your `AUTH0_BASE_URL`

3. **View Logs:**
   ```bash
   # Check Netlify function logs
   netlify functions:log
   ```

4. **Test Auth0 Connection:**
   Visit: `https://aralphaya.netlify.app/api/auth/debug`
   This will show your Auth0 configuration (without secrets)

### Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| 400 Bad Request | Callback URL not configured | Add callback URL to Auth0 dashboard |
| redirect_uri mismatch | URL mismatch between code and Auth0 | Ensure exact match (no trailing slash) |
| Invalid state | CSRF check failed | Clear cookies and try again |
| access_denied | User cancelled login | User action, not an error |

## Next Steps

After configuring Auth0:

1. ✅ Add callback URL to Auth0 dashboard
2. ✅ Save changes
3. ✅ Verify environment variables in Netlify
4. ✅ Redeploy if needed
5. ✅ Test login flow
6. ✅ Check Netlify logs if issues persist

## Support

If you continue to experience issues:
- Check Netlify Function logs
- Check Auth0 logs (Monitor → Logs in Auth0 dashboard)
- Verify all URLs match exactly
- Ensure HTTPS is used everywhere

# Troubleshooting 400 Bad Request Error

## Current Issue
Getting 400 Bad Request when Auth0 redirects back to callback URL.

## Root Cause
This is almost always due to **configuration mismatch** between:
1. What's configured in Auth0 dashboard
2. What's deployed in Netlify environment variables

## Fix Steps (Do in Order)

### Step 1: Check Your Current Configuration

After deploying, visit this URL:
```
https://aralphaya.netlify.app/api/auth/debug
```

This will show you:
- ✅ Which environment variables are set
- 🔗 The exact URLs being used
- ⚠️ Any configuration issues detected
- 📋 Instructions for Auth0 setup

**Copy the `callback` URL from the debug output** - you'll need it for Step 3.

---

### Step 2: Verify Netlify Environment Variables

1. Go to Netlify Dashboard: https://app.netlify.com/
2. Select your site: **aralphaya**
3. Go to **Site Settings** → **Environment Variables**
4. Verify these variables are set:

```env
AUTH0_SECRET=d05054841c51d72ed7da85c2b886d91565c506818d6f767fb5a3369034857a2e
AUTH0_BASE_URL=https://aralphaya.netlify.app
AUTH0_ISSUER_BASE_URL=https://dev-ipb2uf88kk01eg4g.us.auth0.com
AUTH0_CLIENT_ID=DY77lMMbN32Y7RVvwAyFuZ3i4WaOW7CD
AUTH0_CLIENT_SECRET=mCXtmR-YcggpLlqONbA4sBDG-OZsrY0fdYxHpKtqMkJpz1K8OJk0-E2c6xIXW8jN
AUTH0_SCOPE=openid profile email
```

**CRITICAL CHECKS:**
- ❌ NO trailing slashes on URLs
- ✅ Use `https://` (not `http://`)
- ✅ `AUTH0_BASE_URL` must be EXACTLY `https://aralphaya.netlify.app`

**If you make changes:** Click **Save** and then **Redeploy** your site.

---

### Step 3: Configure Auth0 Dashboard

1. **Login to Auth0:** https://manage.auth0.com/
2. **Navigate to:** Applications → Applications
3. **Select your application** (Client ID: `DY77lMMbN32Y7RVvwAyFuZ3i4WaOW7CD`)
4. **Scroll to Application URIs section**

#### Add These URLs:

**Allowed Callback URLs:**
```
https://aralphaya.netlify.app/api/auth/callback
```

**Allowed Logout URLs:**
```
https://aralphaya.netlify.app
```

**Allowed Web Origins:**
```
https://aralphaya.netlify.app
```

**Allowed Origins (CORS):**
```
https://aralphaya.netlify.app
```

**IMPORTANT:**
- Copy the URLs exactly as shown
- NO trailing slashes
- ONE URL per line (if there are multiple)
- URLs must match EXACTLY with `AUTH0_BASE_URL`

5. **Click "Save Changes"** at the bottom

---

### Step 4: Verify Application Settings

While in the Auth0 application settings, verify:

#### Application Type
- Must be: **Regular Web Application**

#### Advanced Settings → OAuth
Go to **Advanced Settings** → **OAuth** tab:
- **JsonWebToken Signature Algorithm:** `RS256`
- **OIDC Conformant:** Should be **enabled**

Click **Save Changes** if you made any modifications.

---

### Step 5: Test Login

1. **Clear your browser cookies** for `aralphaya.netlify.app`
   - Chrome: DevTools → Application → Cookies → Delete
   - Firefox: DevTools → Storage → Cookies → Delete

2. **Visit:** https://aralphaya.netlify.app

3. **Click the login/sign in button**

4. **Complete Auth0 login**

**Expected:** You should be redirected back to the homepage, logged in.

---

## Still Not Working?

### Check Netlify Function Logs

1. Go to Netlify Dashboard
2. Click on **Functions** (or **Edge Functions**)
3. Look for logs from `/api/auth/callback`
4. You should see detailed logs like:
   ```
   [Auth Callback] Received callback request
   [Auth Callback] Code: present
   [Auth Callback] Exchanging code for tokens...
   [Auth Callback] Token response status: 200
   ```

### Check Auth0 Logs

1. Go to Auth0 Dashboard: https://manage.auth0.com/
2. Click **Monitoring** → **Logs** (in sidebar)
3. Look for recent failed login attempts
4. Click on the failed event to see details
5. Look for error messages like:
   - `Callback URL mismatch`
   - `redirect_uri mismatch`
   - `Invalid client_secret`

### Common Error Messages

| Error in Auth0 Logs | Solution |
|---------------------|----------|
| "Callback URL mismatch" | Callback URL in Auth0 doesn't match the one being used |
| "redirect_uri mismatch" | `AUTH0_BASE_URL` in Netlify doesn't match Auth0 config |
| "Invalid client_secret" | `AUTH0_CLIENT_SECRET` in Netlify is wrong |
| "Client is not authorized" | Application type might be wrong (should be Regular Web App) |

---

## Quick Checklist

Before testing, confirm:

- [ ] Visited `/api/auth/debug` and saw configuration
- [ ] All Netlify environment variables are set correctly
- [ ] No trailing slashes in any URLs
- [ ] All URLs use `https://` (not `http://`)
- [ ] `AUTH0_BASE_URL` in Netlify EXACTLY matches Auth0 dashboard
- [ ] Callback URL added to Auth0 dashboard: `https://aralphaya.netlify.app/api/auth/callback`
- [ ] Logout URL added to Auth0 dashboard
- [ ] Application type is "Regular Web Application"
- [ ] Saved changes in Auth0 dashboard
- [ ] Cleared browser cookies before testing
- [ ] Redeployed Netlify site after env variable changes

---

## Need More Help?

1. **Share the output from:** `https://aralphaya.netlify.app/api/auth/debug`
2. **Check Netlify Function Logs** and share any error messages
3. **Check Auth0 Logs** (Monitoring → Logs) for detailed error info

The debug endpoint will tell us exactly what's configured and what's wrong!

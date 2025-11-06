# Supabase + NextAuth Migration Guide

This guide documents the migration from Auth0 to Supabase + NextAuth with email/password authentication.

## ✅ Completed Steps

1. **Dependencies Installed**
   - `next-auth@beta` - NextAuth v5 (Auth.js)
   - `@auth/supabase-adapter` - Supabase adapter for NextAuth
   - `@supabase/supabase-js` - Supabase client library

2. **Core Files Created**
   - `src/lib/supabase.ts` - Supabase client utilities
   - `src/app/api/auth/[...nextauth]/route.ts` - NextAuth route handler
   - `src/lib/auth.ts` - Server-side auth helpers
   - `src/app/auth/signin/page.tsx` - Sign in page
   - `src/app/auth/signup/page.tsx` - Sign up page
   - `src/app/auth/forgot-password/page.tsx` - Password reset request
   - `src/app/auth/reset-password/page.tsx` - Password reset form
   - `src/app/auth/callback/route.ts` - OAuth callback handler
   - `src/app/auth/signout/page.tsx` - Sign out page
   - `src/app/auth/error/page.tsx` - Error page

3. **Updated Components**
   - `src/app/providers.tsx` - Now uses NextAuth SessionProvider
   - `src/hooks/useAuth.ts` - Uses NextAuth useSession
   - `src/components/layout/header.tsx` - Uses signIn/signOut from next-auth/react
   - `src/app/profile/page.tsx` - Uses NextAuth session
   - `src/app/checkout/page.tsx` - Uses NextAuth session
   - `src/middleware.ts` - Removed Auth0 cookie checks

## 📋 Next Steps (Required)

### 1. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note your project URL and keys:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key (found in Settings > API)
   - Service Role Key (found in Settings > API - keep this secret!)

### 2. Create Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- NextAuth required tables
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  "emailVerified" timestamp with time zone,
  image text
);

create table if not exists accounts (
  id bigserial primary key,
  "userId" uuid references users(id) on delete cascade,
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  unique (provider, "providerAccountId")
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  "sessionToken" text unique not null,
  "userId" uuid references users(id) on delete cascade,
  expires timestamp with time zone not null
);

create table if not exists "verificationTokens" (
  identifier text not null,
  token text not null,
  expires timestamp with time zone not null,
  primary key (identifier, token)
);

-- Optional: Enable email authentication in Supabase Dashboard
-- Go to Authentication > Providers > Email and enable it
```

### 3. Configure Environment Variables

Add to `.env.local`:

```bash
# NextAuth
AUTH_SECRET=your-random-32-byte-secret-here
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Public Supabase (for client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Generate AUTH_SECRET:**
```
AUTH_SECRET=xPqXgSQgaEtymqXKeR96mVmxhu4PggIvoq7HuqWDxVw=
```


# On Windows (PowerShell), use:
[Convert]::ToBase64String((New-Object Byte[] 32 | ForEach-Object {Get-Random -Maximum 256}))
```

### 4. Configure Supabase Email Settings

1. In Supabase Dashboard, go to **Authentication > URL Configuration**
2. Set **Site URL** to your production URL (e.g., `https://aralphaya.netlify.app`)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://aralphaya.netlify.app/auth/callback` (for production)
4. Go to **Authentication > Email Templates** and customize if needed
5. Ensure **Email** provider is enabled in **Authentication > Providers**

### 5. Test Locally

1. Start dev server: `npm run dev`
2. Visit `http://localhost:3000/auth/signup`
3. Create an account
4. Check your email for verification (if enabled)
5. Sign in at `http://localhost:3000/auth/signin`
6. Test protected routes (`/profile`, `/checkout`)

### 6. Clean Up Auth0 Code (After Testing)

Once everything works, remove:

- `src/app/api/auth/[auth0]/route.ts`
- `src/app/auth/profile/route.ts` (if exists)
- `@auth0/nextjs-auth0` from `package.json` (run `npm uninstall @auth0/nextjs-auth0`)
- Any Auth0-related environment variables

### 7. Deploy to Production

1. Set environment variables in Netlify (or your hosting platform):
   - `AUTH_SECRET`
   - `AUTH_URL=https://aralphaya.netlify.app`
   - `NEXTAUTH_URL=https://aralphaya.netlify.app`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Update Supabase redirect URLs to include production URL
3. Deploy and test

## 🔒 Security Notes

- **Never commit** `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` in client code
- The service role key should only be used server-side
- Use the anon key for client-side Supabase operations
- Ensure `AUTH_SECRET` is a strong random string

## 📝 Features

- ✅ Email/password authentication
- ✅ User registration
- ✅ Password reset flow
- ✅ Email verification (via Supabase)
- ✅ Protected routes
- ✅ Session management
- ✅ Sign out functionality

## 🚀 Future Enhancements

- Add Google OAuth (optional)
- Add social login providers
- Implement email verification flow
- Add user profile management
- Migrate carts/orders to Supabase database

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase + NextAuth Guide](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)


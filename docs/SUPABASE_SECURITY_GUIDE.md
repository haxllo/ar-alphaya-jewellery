# Supabase Security Fixes Guide

This guide addresses the security errors and warnings from Supabase's database linter.

## Issues Found

### Errors (Must Fix)
1. **RLS Disabled on NextAuth Tables**: `users`, `accounts`, `sessions`, `verificationTokens`
2. These tables are public but don't have Row Level Security enabled

### Warnings (Should Fix)
1. **Function Search Path**: `update_updated_at_column` and `get_or_create_cart` functions
2. **Leaked Password Protection**: Disabled in Auth settings

## Quick Fix

Run the SQL script to fix all issues:

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**

2. **Run the Security Fixes Script**
   - Copy and paste the contents of `SUPABASE_SECURITY_FIXES.sql`
   - Click **Run** or press `Ctrl+Enter`
   - Wait for execution to complete

3. **Verify Fixes**
   - The script includes verification queries at the end
   - Check that RLS is enabled on all tables
   - Verify function search_path is set

## What the Fix Does

### 1. Enables RLS on NextAuth Tables

Even though we use the service role key for server-side operations, enabling RLS provides:
- **Defense in depth**: Extra security layer
- **Compliance**: Meets Supabase security requirements
- **Future-proofing**: If you ever expose these tables to client-side code

**Policies Created:**
- Service role can access all data (for server-side operations)
- Users can only view their own data (for client-side access if needed)

### 2. Fixes Function Search Path

Sets `search_path = public` on functions to prevent:
- **SQL injection**: Prevents search path manipulation attacks
- **Security vulnerabilities**: Ensures functions use expected schemas

### 3. Auth Password Protection

This needs to be enabled in the Supabase dashboard (see below).

## Manual Steps

### Enable Leaked Password Protection

1. **Go to Supabase Dashboard**
   - Navigate to your project

2. **Open Authentication Settings**
   - Go to **Authentication** → **Settings**
   - Or: **Settings** → **Auth**

3. **Enable Password Protection**
   - Find **"Password Security"** section
   - Enable **"Leaked Password Protection"**
   - This checks passwords against HaveIBeenPwned.org database
   - Click **Save**

## After Running Fixes

### Verify RLS is Enabled

Run this query in SQL Editor:

```sql
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'accounts', 'sessions', 'verificationTokens')
ORDER BY tablename;
```

All should show `rls_enabled = true`.

### Verify Functions

Run this query:

```sql
SELECT 
  proname as function_name,
  prosecdef as security_definer
FROM pg_proc 
WHERE proname IN ('update_updated_at_column', 'get_or_create_cart')
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
```

Both should show `security_definer = true`.

### Check Linter Again

1. Go to **Database** → **Linter** in Supabase dashboard
2. Run the linter again
3. Errors should be resolved
4. Warnings about functions should be gone
5. Only the Auth password protection warning should remain (fix manually)

## Important Notes

### Service Role Key

- We're using `SUPABASE_SERVICE_ROLE_KEY` for server-side operations
- Service role bypasses RLS, so your API routes will continue to work
- RLS policies allow service role access, so no breaking changes

### Client-Side Access

- If you ever need client-side access to these tables:
  - Users will only see their own data (enforced by RLS policies)
  - Service role operations are unaffected

### Performance

- RLS has minimal performance impact
- Policies are optimized for service role access
- User policies only apply if client-side access is used

## Troubleshooting

### Error: "permission denied"

- Make sure you're running the script as a superuser or with service role
- Check that you have permissions to alter tables and create policies

### RLS Still Shows Disabled

- Refresh the Supabase dashboard
- Run the verification query to double-check
- Some UI updates may take a moment

### Functions Not Working

- The script recreates functions and triggers
- If you have custom modifications, you may need to reapply them
- Check trigger definitions are correct

## Security Best Practices

After applying these fixes:

1. ✅ RLS enabled on all public tables
2. ✅ Functions have secure search_path
3. ✅ Service role access properly configured
4. ✅ User access restricted to own data
5. ⚠️ Enable leaked password protection manually

## Additional Resources

- [Supabase RLS Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Function Security](https://supabase.com/docs/guides/database/postgres/functions)
- [Auth Password Security](https://supabase.com/docs/guides/auth/password-security)


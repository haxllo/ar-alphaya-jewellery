# NextAuth Configuration Error - Troubleshooting Guide

## Error: "There is a problem with the server configuration"

This error typically occurs when NextAuth's SupabaseAdapter cannot access the database tables.

## Quick Diagnostic Steps

### 1. Check Database Tables Exist

Visit: `http://localhost:3000/api/auth/check-db`

This will show you:
- Which tables exist
- Which tables are accessible
- Any connection errors

### 2. Verify SQL Schema Was Run

Go to your Supabase Dashboard → SQL Editor and run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'sessions', 'accounts', 'verificationTokens');
```

**Expected Result**: Should return 4 rows (one for each table)

### 3. Run the Complete Schema

If tables are missing, run the SQL in `SUPABASE_SETUP.sql` file in your Supabase SQL Editor.

### 4. Check Environment Variables

Visit: `http://localhost:3000/api/auth/debug`

Verify all environment variables are set:
- ✅ SUPABASE_URL
- ✅ SUPABASE_SERVICE_ROLE_KEY  
- ✅ AUTH_SECRET
- ✅ AUTH_URL

### 5. Check Server Logs

When you try to sign in, check your terminal/console for:
- "SupabaseAdapter initialized successfully"
- "Authorized user: ..."
- "signIn callback - user: ..."
- Any error messages

## Common Issues & Solutions

### Issue 1: Tables Don't Exist
**Solution**: Run `SUPABASE_SETUP.sql` in Supabase SQL Editor

### Issue 2: Service Role Key Doesn't Have Access
**Solution**: 
- Verify you're using the **Service Role Key** (not anon key)
- Service role key bypasses RLS, so it should work
- Check key in Supabase Dashboard → Settings → API

### Issue 3: Table Schema Mismatch
**Solution**: 
- Drop existing tables and recreate using `SUPABASE_SETUP.sql`
- Ensure column names match exactly (case-sensitive)

### Issue 4: RLS Policies Blocking Access
**Solution**: 
- Service role key should bypass RLS
- If issues persist, temporarily disable RLS:
  ```sql
  ALTER TABLE users DISABLE ROW LEVEL SECURITY;
  ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
  ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "verificationTokens" DISABLE ROW LEVEL SECURITY;
  ```

## Testing After Fix

1. Restart dev server
2. Visit `/api/auth/csrf` - should return JSON
3. Visit `/api/auth/session` - should return JSON
4. Try signing in at `/auth/signin`

## Still Having Issues?

Check your terminal for the actual error message. The console logs will show:
- Where the adapter is failing
- What database operation is failing
- The exact error message

Share the error message from your terminal and we can debug further.


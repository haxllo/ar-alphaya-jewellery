# Database Schemas

This folder contains all Supabase database schema files.

## 📁 Files

### Core Setup
- **SUPABASE_SETUP.sql** - Core NextAuth tables setup
- **SUPABASE_SETUP_SIMPLE.sql** - Simplified setup (RLS disabled)

### Commerce
- **SUPABASE_COMMERCE_SCHEMA.sql** - Carts, orders, and abandoned carts tables

### Forms & Subscriptions
- **SUPABASE_FORMS_SCHEMA.sql** - Contact forms, newsletter, and waitlist tables

### Security
- **SUPABASE_SECURITY_FIXES.sql** - RLS policies and security fixes

## 🚀 Usage

1. Run schemas in order:
   - First: `SUPABASE_SETUP.sql` or `SUPABASE_SETUP_SIMPLE.sql`
   - Then: `SUPABASE_COMMERCE_SCHEMA.sql`
   - Then: `SUPABASE_FORMS_SCHEMA.sql`
   - Finally: `SUPABASE_SECURITY_FIXES.sql`

2. Execute in Supabase SQL Editor:
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste the SQL content
   - Run the query

## 📚 Documentation

See `../docs/` folder for detailed guides on:
- Setting up Supabase
- Security configuration
- Migration guides


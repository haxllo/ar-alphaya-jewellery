# Admin Roles Extension Guide

This document explains how to extend the current admin system to support multiple roles and granular permissions.

## Current Implementation

**Simple Admin System:**
- Binary check: User is either an admin or not
- All admins have full access to everything
- Single `admin_users` table with `is_active` flag

## Extension Plan: Role-Based Access Control (RBAC)

### Phase 1: Add Roles Table

**1. Create Roles Table**

```sql
-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default roles
INSERT INTO public.roles (name, description) VALUES
  ('super_admin', 'Full system access - can manage everything including other admins'),
  ('admin', 'Can manage products, orders, and content'),
  ('editor', 'Can create and edit products but not delete'),
  ('viewer', 'Read-only access to admin panel'),
  ('moderator', 'Can manage customer reviews and comments');

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view roles
CREATE POLICY "Authenticated users can view roles"
  ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);
```

**2. Update Admin Users Table**

```sql
-- Add role_id to admin_users
ALTER TABLE public.admin_users 
ADD COLUMN role_id UUID REFERENCES public.roles(id);

-- Set default role for existing admins
UPDATE public.admin_users 
SET role_id = (SELECT id FROM public.roles WHERE name = 'super_admin');

-- Make role_id required
ALTER TABLE public.admin_users 
ALTER COLUMN role_id SET NOT NULL;

-- Add index
CREATE INDEX idx_admin_users_role_id ON public.admin_users(role_id);
```

### Phase 2: Add Permissions System

**1. Create Permissions Table**

```sql
-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  resource VARCHAR(50) NOT NULL, -- e.g., 'products', 'orders', 'users'
  action VARCHAR(50) NOT NULL,   -- e.g., 'create', 'read', 'update', 'delete'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert permissions
INSERT INTO public.permissions (name, description, resource, action) VALUES
  -- Product permissions
  ('products.create', 'Create new products', 'products', 'create'),
  ('products.read', 'View products', 'products', 'read'),
  ('products.update', 'Edit existing products', 'products', 'update'),
  ('products.delete', 'Delete products', 'products', 'delete'),
  ('products.publish', 'Publish/unpublish products', 'products', 'publish'),
  
  -- Order permissions
  ('orders.read', 'View orders', 'orders', 'read'),
  ('orders.update', 'Update order status', 'orders', 'update'),
  ('orders.refund', 'Process refunds', 'orders', 'refund'),
  
  -- User management permissions
  ('users.read', 'View users', 'users', 'read'),
  ('users.update', 'Edit user details', 'users', 'update'),
  ('users.delete', 'Delete users', 'users', 'delete'),
  
  -- Admin management permissions
  ('admins.create', 'Add new admins', 'admins', 'create'),
  ('admins.read', 'View admins', 'admins', 'read'),
  ('admins.update', 'Edit admin roles', 'admins', 'update'),
  ('admins.delete', 'Remove admin access', 'admins', 'delete'),
  
  -- Content permissions
  ('content.create', 'Create content', 'content', 'create'),
  ('content.read', 'View content', 'content', 'read'),
  ('content.update', 'Edit content', 'content', 'update'),
  ('content.delete', 'Delete content', 'content', 'delete'),
  
  -- Settings permissions
  ('settings.read', 'View settings', 'settings', 'read'),
  ('settings.update', 'Modify settings', 'settings', 'update'),
  
  -- Analytics permissions
  ('analytics.read', 'View analytics and reports', 'analytics', 'read');

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view permissions"
  ON public.permissions
  FOR SELECT
  TO authenticated
  USING (true);
```

**2. Create Role-Permission Junction Table**

```sql
-- Link roles to permissions
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(role_id, permission_id)
);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view role permissions"
  ON public.role_permissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Add indexes
CREATE INDEX idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON public.role_permissions(permission_id);
```

**3. Assign Permissions to Roles**

```sql
-- Super Admin: All permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE name = 'super_admin'),
  id
FROM public.permissions;

-- Admin: Most permissions except admin management
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE name = 'admin'),
  id
FROM public.permissions
WHERE name NOT LIKE 'admins.%' OR name = 'admins.read';

-- Editor: Product CRUD (except delete) and content management
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE name = 'editor'),
  id
FROM public.permissions
WHERE name IN (
  'products.create', 'products.read', 'products.update',
  'content.create', 'content.read', 'content.update',
  'orders.read', 'analytics.read'
);

-- Viewer: Read-only access
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE name = 'viewer'),
  id
FROM public.permissions
WHERE action = 'read';

-- Moderator: Content management and user reviews
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE name = 'moderator'),
  id
FROM public.permissions
WHERE name IN (
  'content.read', 'content.update', 'content.delete',
  'users.read', 'products.read', 'analytics.read'
);
```

### Phase 3: Update Helper Functions

**1. Enhanced Admin Check Function**

```sql
-- Get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS VARCHAR AS $$
  SELECT r.name
  FROM public.admin_users au
  JOIN public.roles r ON au.role_id = r.id
  WHERE au.user_id = get_user_role.user_id
  AND au.is_active = true;
$$ LANGUAGE sql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
```

**2. Permission Check Function**

```sql
-- Check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(
  user_id UUID,
  permission_name VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users au
    JOIN public.role_permissions rp ON au.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE au.user_id = has_permission.user_id
    AND au.is_active = true
    AND p.name = has_permission.permission_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.has_permission(UUID, VARCHAR) TO authenticated;
```

**3. Get User Permissions Function**

```sql
-- Get all permissions for a user
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id UUID)
RETURNS TABLE (
  permission_name VARCHAR,
  resource VARCHAR,
  action VARCHAR,
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.name,
    p.resource,
    p.action,
    p.description
  FROM public.admin_users au
  JOIN public.role_permissions rp ON au.role_id = rp.role_id
  JOIN public.permissions p ON rp.permission_id = p.id
  WHERE au.user_id = get_user_permissions.user_id
  AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_user_permissions(UUID) TO authenticated;
```

### Phase 4: Update Application Code

**1. Create Permission Hook**

Create `/src/hooks/usePermission.ts`:

```typescript
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase-browser'

export function usePermission(permission: string) {
  const [hasPermission, setHasPermission] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    async function checkPermission() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setHasPermission(false)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .rpc('has_permission', {
          user_id: session.user.id,
          permission_name: permission
        })

      if (!error && data) {
        setHasPermission(data)
      }
      
      setLoading(false)
    }

    checkPermission()
  }, [permission, supabase])

  return { hasPermission, loading }
}

// Get all user permissions
export function useUserPermissions() {
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    async function fetchPermissions() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setPermissions([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .rpc('get_user_permissions', { user_id: session.user.id })

      if (!error && data) {
        setPermissions(data.map((p: any) => p.permission_name))
      }
      
      setLoading(false)
    }

    fetchPermissions()
  }, [supabase])

  return { permissions, loading }
}

// Get user role
export function useUserRole() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    async function fetchRole() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setRole(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .rpc('get_user_role', { user_id: session.user.id })

      if (!error && data) {
        setRole(data)
      }
      
      setLoading(false)
    }

    fetchRole()
  }, [supabase])

  return { role, loading }
}
```

**2. Create Permission Guard Component**

Create `/src/components/PermissionGuard.tsx`:

```typescript
'use client'

import { usePermission } from '@/hooks/usePermission'
import { ReactNode } from 'react'

interface PermissionGuardProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ 
  permission, 
  children, 
  fallback = null 
}: PermissionGuardProps) {
  const { hasPermission, loading } = usePermission(permission)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Usage example:
// <PermissionGuard permission="products.delete">
//   <button onClick={handleDelete}>Delete Product</button>
// </PermissionGuard>
```

**3. Update Admin Layout**

Update `/src/app/admin/layout.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  // Check if user is admin (any role)
  const supabase = createServerClient()
  const { data: isAdmin } = await supabase
    .rpc('is_admin', { user_id: session.user.id })
    .single()

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="mb-2 text-xl font-bold text-red-900">Access Denied</h1>
          <p className="text-red-700">You don't have admin privileges.</p>
          <a 
            href="/" 
            className="mt-4 inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Go to Home
          </a>
        </div>
      </div>
    )
  }

  // Get user's role and permissions for the session
  const { data: role } = await supabase
    .rpc('get_user_role', { user_id: session.user.id })
    .single()

  const { data: permissions } = await supabase
    .rpc('get_user_permissions', { user_id: session.user.id })

  return (
    <>
      {/* Pass role and permissions to children via context if needed */}
      {children}
    </>
  )
}
```

**4. Server-Side Permission Check**

Create `/src/lib/permissions.ts`:

```typescript
import { createServerClient } from '@/lib/supabase'

export async function checkPermission(
  userId: string, 
  permission: string
): Promise<boolean> {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .rpc('has_permission', {
      user_id: userId,
      permission_name: permission
    })

  if (error || !data) {
    return false
  }

  return data
}

export async function requirePermission(
  userId: string,
  permission: string
): Promise<void> {
  const hasPermission = await checkPermission(userId, permission)
  
  if (!hasPermission) {
    throw new Error(`Permission denied: ${permission}`)
  }
}

// Usage in API routes:
// import { requirePermission } from '@/lib/permissions'
// await requirePermission(session.user.id, 'products.delete')
```

### Phase 5: UI Components for Role Management

**1. Admin User Management Page**

Create `/src/app/admin/users/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase-browser'
import { PermissionGuard } from '@/components/PermissionGuard'

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const supabase = createBrowserClient()

  useEffect(() => {
    async function fetchData() {
      // Fetch all admin users with their roles
      const { data: adminData } = await supabase
        .from('admin_users')
        .select(`
          id,
          is_active,
          created_at,
          user:auth.users(email),
          role:roles(name, description)
        `)

      setAdmins(adminData || [])

      // Fetch available roles
      const { data: rolesData } = await supabase
        .from('roles')
        .select('*')

      setRoles(rolesData || [])
    }

    fetchData()
  }, [supabase])

  async function updateUserRole(adminId: string, newRoleId: string) {
    await supabase
      .from('admin_users')
      .update({ role_id: newRoleId })
      .eq('id', adminId)
    
    // Refresh list
    window.location.reload()
  }

  return (
    <PermissionGuard 
      permission="admins.read"
      fallback={<div>Access Denied</div>}
    >
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Users</h1>
        
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b">
                <td className="p-2">{admin.user?.email}</td>
                <td className="p-2">{admin.role?.name}</td>
                <td className="p-2">
                  {admin.is_active ? 'Active' : 'Inactive'}
                </td>
                <td className="p-2">
                  <PermissionGuard permission="admins.update">
                    <select
                      onChange={(e) => updateUserRole(admin.id, e.target.value)}
                      value={admin.role_id}
                      className="border rounded px-2 py-1"
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </PermissionGuard>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PermissionGuard>
  )
}
```

## Summary of Benefits

### Current System
✅ Simple admin check
✅ Easy to implement
❌ No granular control
❌ All admins have same access

### Extended System
✅ Multiple role types
✅ Granular permissions per resource
✅ Easy to add new permissions
✅ Flexible role assignment
✅ Audit trail ready
✅ Scalable for team growth

## Migration Path

1. **Phase 1**: Add roles table (1-2 hours)
2. **Phase 2**: Add permissions system (2-3 hours)
3. **Phase 3**: Update functions (1 hour)
4. **Phase 4**: Update application code (3-4 hours)
5. **Phase 5**: Build UI for management (4-6 hours)

**Total Estimated Time**: 11-16 hours

## Future Enhancements

- **Audit Logging**: Track who changed what and when
- **Time-based Permissions**: Temporary admin access
- **IP Restrictions**: Limit admin access to specific IPs
- **2FA for Admins**: Two-factor authentication requirement
- **Permission Groups**: Combine multiple permissions into groups
- **Custom Permissions**: Allow creating permissions via UI
- **Role Hierarchy**: Parent-child role relationships

## Testing Checklist

- [ ] Create users with different roles
- [ ] Test each permission individually
- [ ] Verify RLS policies work correctly
- [ ] Test permission checks in UI components
- [ ] Test API route permission guards
- [ ] Test role updates and permission changes
- [ ] Verify inactive users cannot access admin
- [ ] Test with multiple browser sessions

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-08  
**Author**: Factory Droid  
**Status**: Ready for Implementation

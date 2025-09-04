# Auth0 Authentication Setup Guide

This guide explains how the Auth0 authentication is configured and integrated into the AR Alphaya Jewellery website.

## 🔐 **Auth0 Configuration**

### **Application Settings in Auth0 Dashboard:**

- **Application Type**: Regular Web Applications
- **Tenant Domain**: `dev-ipb2uf88kk01eg4g.us.auth0.com`
- **Client ID**: `DY77lMMbN32Y7RVvwAyFuZ3i4WaOW7CD`
- **Client Secret**: `mCXtmR-YcggpLlqONbA4sBDG-OZsrY0fdYxHpKtqMkJpz1K8OJk0-E2c6xIXW8jN`

### **Required URLs in Auth0 Dashboard:**

#### **Development (localhost:3001):**
- **Allowed Callback URLs**: `http://localhost:3001/api/auth/callback`
- **Allowed Logout URLs**: `http://localhost:3001`
- **Allowed Web Origins (CORS)**: `http://localhost:3001`

#### **Production (your domain):**
- **Allowed Callback URLs**: `https://your-domain.com/api/auth/callback`
- **Allowed Logout URLs**: `https://your-domain.com`
- **Allowed Web Origins (CORS)**: `https://your-domain.com`

## 🛠 **Environment Variables**

The following environment variables are configured in `.env.local`:

```env
# Auth0 Authentication Configuration
AUTH0_SECRET="9034255b07a69015a8a872c9e20821bd6d23bc45a36d96233ec76c4376a3eaed"
AUTH0_BASE_URL="http://localhost:3001"
AUTH0_ISSUER_BASE_URL="https://dev-ipb2uf88kk01eg4g.us.auth0.com"
AUTH0_CLIENT_ID="DY77lMMbN32Y7RVvwAyFuZ3i4WaOW7CD"
AUTH0_CLIENT_SECRET="mCXtmR-YcggpLlqONbA4sBDG-OZsrY0fdYxHpKtqMkJpz1K8OJk0-E2c6xIXW8jN"
```

## 🚀 **Implementation Details**

### **1. Authentication API Routes**
- **Route**: `/api/auth/[auth0]/route.ts`
- **Handles**: login, logout, callback, profile endpoints
- **Usage**: Automatically manages Auth0 authentication flow

### **2. Protected Pages**
- **Profile Page**: `/profile` - requires authentication
- **Checkout Page**: `/checkout` - requires authentication
- **User Dashboard**: Shows user info, orders, wishlist

### **3. Header Authentication**
- **Signed In**: Shows user avatar, name, dropdown menu
- **Signed Out**: Shows "Sign In" button
- **Mobile Menu**: Includes authentication state

### **4. User Context**
- **Provider**: `UserProvider` wraps the entire app
- **Hook**: `useUser()` provides authentication state
- **Data**: Access to user profile, email, picture, etc.

## 🎯 **Features Implemented**

### **Authentication Flow:**
- ✅ Sign in with Auth0 Universal Login
- ✅ Sign out with proper session cleanup
- ✅ Automatic redirects after login/logout
- ✅ Protected routes with authentication required

### **User Experience:**
- ✅ User profile page with complete information
- ✅ Pre-filled checkout forms with user data
- ✅ Persistent authentication across sessions
- ✅ Loading states and error handling

### **Visual Integration:**
- ✅ User avatar in header navigation
- ✅ Dropdown menu with profile links
- ✅ Mobile-friendly authentication UI
- ✅ Consistent styling with website theme

## 🔧 **Development Setup**

1. **Install Dependencies:**
   ```bash
   npm install @auth0/nextjs-auth0@^3.5.0
   ```

2. **Environment Variables:**
   - Copy `.env.template` to `.env.local`
   - Update Auth0 credentials
   - Set correct base URL for your environment

3. **Development Server:**
   ```bash
   npm run dev
   ```
   - Server runs on `http://localhost:3001`
   - Auth0 redirects configured for port 3001

4. **Build Test:**
   ```bash
   npm run build
   ```
   - Ensures all Auth0 integrations compile correctly

## 🌐 **Production Deployment**

### **Environment Variables for Production:**
```env
AUTH0_SECRET="your-production-secret-32-bytes"
AUTH0_BASE_URL="https://your-domain.com"
AUTH0_ISSUER_BASE_URL="https://dev-ipb2uf88kk01eg4g.us.auth0.com"
AUTH0_CLIENT_ID="DY77lMMbN32Y7RVvwAyFuZ3i4WaOW7CD"
AUTH0_CLIENT_SECRET="mCXtmR-YcggpLlqONbA4sBDG-OZsrY0fdYxHpKtqMkJpz1K8OJk0-E2c6xIXW8jN"
```

### **Auth0 Dashboard Updates:**
- Update all callback URLs to production domain
- Update logout URLs to production domain
- Update CORS origins to production domain

### **Next.js Configuration:**
- For static export: Remove API routes or use serverless functions
- For server deployment: Keep current configuration

## 🛡 **Security Features**

- **Secure Session Management**: Auth0 handles all session security
- **CSRF Protection**: Built-in protection against cross-site attacks
- **Encrypted Cookies**: Session data encrypted with AUTH0_SECRET
- **Secure Redirects**: Only allows configured redirect URLs
- **Token Refresh**: Automatic token refresh handling

## 📱 **User Experience**

### **Sign In Process:**
1. User clicks "Sign In" button
2. Redirected to Auth0 Universal Login
3. After successful login, redirected to profile page
4. User sees their information in header

### **Protected Routes:**
1. User tries to access protected page (checkout, profile)
2. If not authenticated, redirected to login
3. After login, redirected back to intended page
4. Full access to authenticated features

### **Sign Out Process:**
1. User clicks "Sign Out" from dropdown
2. Session cleared and redirected to homepage
3. User sees signed-out state immediately

## 🔄 **Integration Points**

- **Cart**: Works with or without authentication
- **Wishlist**: Persists across authentication states
- **Checkout**: Pre-fills with user information
- **Orders**: Will show user's order history (when implemented)
- **Profile**: Complete user account management

This integration provides a seamless, secure authentication experience while maintaining the website's design and user experience standards.

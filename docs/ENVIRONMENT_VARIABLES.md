# AR Alphaya Jewellery - Environment Variables

This document lists the environment variables required to run the AR Alphaya Jewellery platform in different environments.

## 🔐 Core Configuration

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URI` | PostgreSQL connection string (for Payload CMS). | `postgres://user:pass@host:5432/db` |
| `PAYLOAD_SECRET` | A random string used to secure Payload's sessions. | `your-long-random-secret` |
| `AUTH_SECRET` | Secret used by NextAuth for session encryption. | `your-nextauth-secret` |
| `NEXT_PUBLIC_SERVER_URL` | The base URL of your application. | `http://localhost:3000` or `https://aralphaya.com` |

## 📦 Database & CMS (Supabase)

While moving to Payload CMS, some features still rely on Supabase.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Your Supabase project URL. | `https://xyz.supabase.co` |
| `SUPABASE_ANON_KEY` | Public anonymous key for Supabase. | `your-anon-key` |
| `SUPABASE_SERVICE_ROLE_KEY` | Private service role key (server-side only). | `your-service-role-key` |

## 📸 Image Management (Uploadcare)

The project uses Uploadcare for image hosting and delivery.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY` | Public key for the Uploadcare widget. | `5eb856a1c841f37fa95c` |
| `UPLOADCARE_SECRET_KEY` | Secret key for Uploadcare API (server-side). | `your-secret-key` |

## 💳 Payments (PayPal)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal REST API Client ID. | `your-client-id` |
| `PAYPAL_CLIENT_SECRET` | PayPal REST API Client Secret. | `your-client-secret` |
| `NEXT_PUBLIC_PAYPAL_SANDBOX` | Set to `false` for production. | `true` |
| `PAYPAL_WEBHOOK_ID` | For verifying PayPal webhook signatures. | `your-webhook-id` |

## 📧 Email (Resend)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `RESEND_API_KEY` | API key from Resend.com. | `re_123...` |
| `EMAIL_FROM` | The "from" address for automated emails. | `noreply@aralphaya.com` |

## 🛠️ Error Tracking (Sentry)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry project DSN. | `https://...` |
| `SENTRY_AUTH_TOKEN` | Auth token for uploading sourcemaps. | `your-auth-token` |
| `SENTRY_ORG` | Sentry organization slug. | `ar-alphaya` |
| `SENTRY_PROJECT` | Sentry project slug. | `jewellery-web` |

---

## 📝 Setup Instructions

1. **Local Development:**
   - Copy `.env.example` to `.env.local`.
   - Fill in the values for local development.
   - For `DATABASE_URI`, you can use a local PostgreSQL instance or a Supabase connection string.

2. **Production (Vercel):**
   - Add these variables in the **Project Settings > Environment Variables** section of the Vercel dashboard.
   - Ensure `NEXT_PUBLIC_SERVER_URL` matches your production domain.
   - Ensure `NEXT_PUBLIC_PAYPAL_SANDBOX` is set to `false`.

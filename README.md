# AR Alphaya Jewellery

A modern, high-end jewelry e-commerce platform built with Next.js, TypeScript, and Tailwind CSS. The platform features a powerful administrative interface powered by Payload CMS, allowing for seamless product and content management.

## 📚 Documentation

### For Administrators
- **[Admin Portal Guide](docs/ADMIN_PORTAL_GUIDE.md)** - Complete guide for managing products and media using Payload CMS.
- **[Quick Start Card](docs/ADMIN_QUICK_START.md)** - Quick reference for daily management tasks.

### For Developers
- **[Environment Variables](docs/ENVIRONMENT_VARIABLES.md)** - Required keys for Payload, Supabase, PayPal, etc.
- **[Database Schema](database/README.md)** - Structure of the PostgreSQL database.
- **[Payload CMS Migration](docs/PAYLOAD_MIGRATION_ANALYSIS.md)** - Details on the architecture move to Payload.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15/16 with App Router, TypeScript, Tailwind CSS.
- **Payload CMS**: Integrated headless CMS for managing products, users, and media.
- **Authentication**: Secure authentication via NextAuth.js.
- **Shopping Cart**: Advanced cart functionality with persistent state and size selection.
- **Image Hosting**: Cloud-powered image delivery via Uploadcare CDN.
- **Multi-Currency**: Support for international currencies with live conversion.
- **Responsive Design**: Mobile-first design optimized for a premium experience.
- **SEO Optimized**: Complete SEO with dynamic meta tags and structured data.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Customer-facing website routes
│   │   ├── collections/   # Product listing pages
│   │   ├── products/      # Individual product detail pages
│   │   ├── cart/         # Shopping cart
│   │   └── checkout/     # Checkout flow
│   ├── (payload)/         # Payload CMS admin and API routes
│   └── api/               # Shared backend API routes
├── collections/           # Payload CMS Collection definitions
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (Radix UI)
│   ├── layout/           # Structural components (Header, Footer)
│   ├── product/          # Product-related UI
│   ├── cart/             # Cart-related UI
│   └── admin/            # Admin-specific components
├── lib/                  # Utilities, hooks, and services
│   ├── cms.ts            # Data fetching logic
│   ├── paypal.ts         # PayPal integration
│   └── store/            # Zustand state management
├── types/                # TypeScript definitions
└── public/               # Static assets and media
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm (preferred) or yarn
- A PostgreSQL database (e.g., Supabase or local)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ar-alphaya-jewellery
```

2. Install dependencies:
```bash
npm install
```

3. Configure Environment:
Copy `.env.example` to `.env.local` and fill in the required values (see `docs/ENVIRONMENT_VARIABLES.md`).

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) for the website or [/admin](http://localhost:3000/admin) for the CMS.

## 🚀 Deployment

The project is optimized for deployment on **Vercel**.

1. Connect your repository to Vercel.
2. Set the build command: `npm run build`.
3. Configure all environment variables in the Vercel dashboard.
4. Ensure your PostgreSQL database is accessible from the production environment.

## 📋 Project Status

**Current Version:** 2.0 (Payload CMS Integrated)  
**Development Status:** ✅ Active  
**Live Site:** [aralphayajewellery.com](https://aralphayajewellery.com)

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email info@aralphayajewellery.com or create an issue in this repository.
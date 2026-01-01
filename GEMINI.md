# AR Alphaya Jewellery Project

## Project Overview

**AR Alphaya Jewellery** is a modern, full-featured e-commerce platform built for selling high-end jewelry. It leverages a headless architecture where content (products) is managed via Supabase, while the frontend provides a premium user experience with Next.js.

### Core Technology Stack

-   **Frontend Framework:** Next.js 16 (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS (Custom "Black & White" professional theme)
-   **Authentication:** Auth0 (via `next-auth`)
-   **Database & CMS:** Supabase (PostgreSQL) - Used as a Headless CMS for product management.
    -   *Note: A migration to Payload CMS is currently under consideration. See `docs/PAYLOAD_MIGRATION_ANALYSIS.md`.*
-   **State Management:** Zustand
-   **Image Hosting:** Uploadcare
-   **Testing:** Playwright (E2E)
-   **Payments:** PayPal (Live), Payzy (Implementation pending)
-   **Email:** Resend

## Building and Running

### Prerequisites

-   **Node.js:** v18.x or higher
-   **Package Manager:** npm (preferred) or yarn

### Environment Setup

1.  Copy `.env.example` to `.env.local` (if available, otherwise refer to `docs/NETLIFY_ENV_VARIABLES.md` or existing `.env` files).
2.  Configure Auth0, Supabase, and other service credentials.

### Key Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server at `http://localhost:3000`. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server (requires build). |
| `npm run lint` | Runs ESLint to check for code quality issues. |
| `npm run type-check` | Runs the TypeScript compiler (`tsc`) to check for type errors. |
| `npm run test:e2e` | Runs end-to-end tests using Playwright. |
| `npm run validate:products` | Runs a script to validate product data integrity. |

## Development Conventions

### Project Structure

The project follows the standard Next.js App Router structure within the `src/` directory:

-   **`src/app/`**: Application routes and pages.
    -   `admin/`: **Custom Admin Portal** (`/admin`). Currently manages products directly in Supabase.
    -   `api/`: Backend API routes (Auth0, payment webhooks, etc.).
    -   `products/`: Product listing and detail pages.
    -   `cart/`, `checkout/`: Shopping cart and checkout flow.
-   **`src/components/`**: Reusable React components.
    -   `ui/`: Base UI components (buttons, inputs, etc.).
    -   `layout/`: Header, Footer, and other structural elements.
    -   `admin/`: Components specific to the admin dashboard.
-   **`src/lib/`**: Utility functions, hooks, and service integrations.
    -   `cms.ts`: **Core Data Layer**. Currently fetches product data from Supabase tables.
    -   `paypal.ts`: PayPal payment integration logic.
-   **`database/`**: SQL scripts for database setup, migrations, and schema definitions.
-   **`docs/`**: Comprehensive project documentation.

### Coding Style & Standards

-   **TypeScript:** Strict type checking is enabled. All new code should be fully typed.
-   **Styling:** Use Tailwind CSS utility classes. Custom colors and fonts are defined in `tailwind.config.ts`.
-   **Components:** Functional components with hooks. Prefer composition over inheritance.
-   **State:** Global state is managed with Zustand (e.g., Cart store). Local state uses React `useState`/`useReducer`.

### Content Management (CMS)

-   **Current System:** Custom-built Admin Portal (`/admin`) + Supabase Database.
-   **Future Roadmap:** Potential migration to Payload CMS for better admin experience.
-   **Data:** Products are stored in the `products` table in Supabase.
-   **Images:** Uploaded to Uploadcare; URLs stored in Supabase.
-   **Access:** Protected by Auth0. Admin users must be defined in the `admin_users` table in Supabase.

### Testing

-   **E2E Testing:** Playwright is used for end-to-end testing.
    -   Tests are located in `e2e/`.
    -   Config is in `playwright.config.ts`.
    -   Run tests before major commits or PRs.

## Key Documentation

Refer to the `docs/` directory for detailed guides.

-   **`docs/README.md`**: Index of all project documentation.
-   **`docs/PAYLOAD_MIGRATION_ANALYSIS.md`**: Investigation into migrating to Payload CMS.
-   **`docs/ADMIN_PORTAL_GUIDE.md`**: Guide for the current Supabase-backed admin portal.

import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Ensure Sentry is initialized as early as possible in the runtime
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    debug: false,
  });
}



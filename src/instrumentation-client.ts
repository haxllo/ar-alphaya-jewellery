// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://34c4e852bbbb0f411b426d9aefb068e4@o4510036570996736.ingest.us.sentry.io/4510036582006784",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Add error handling for network issues (CORS, blocked requests, etc.)
  beforeSend(event, hint) {
    // Silently ignore network errors that are common with ad blockers
    if (hint.originalException) {
      const error = hint.originalException;
      if (error instanceof TypeError) {
        const message = error.message || '';
        if (message.includes('NetworkError') ||
            message.includes('Failed to fetch') ||
            message.includes('Network request failed') ||
            message.includes('CORS request did not succeed') ||
            message.includes('Load failed')) {
          return null; // Don't send to Sentry
        }
      }
    }
    return event;
  },
  
  // Ignore common network/CORS errors
  ignoreErrors: [
    'NetworkError',
    'Failed to fetch',
    'Network request failed',
    'CORS request did not succeed',
    'Load failed',
    'NetworkError when attempting to fetch resource',
  ],
  
  // Filter out CORS-related events
  beforeBreadcrumb(breadcrumb) {
    // Don't log CORS errors as breadcrumbs
    if (breadcrumb.category === 'xhr' || breadcrumb.category === 'fetch') {
      if (breadcrumb.data && breadcrumb.data.status_code === 0) {
        return null; // Filter out failed CORS requests
      }
    }
    return breadcrumb;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
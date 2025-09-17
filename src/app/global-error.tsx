"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div>
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-6">
              Our team has been notified. You can try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded bg-black text-white"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}



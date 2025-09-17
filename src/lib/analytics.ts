// Lightweight analytics event dispatcher
export function trackEvent(event: string, payload?: Record<string, any>) {
  try {
    // Push to dataLayer if present
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      // @ts-ignore
      window.dataLayer.push({ event, ...payload })
    }
    // Also emit a custom event for any listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('analytics', { detail: { event, payload } }))
    }
  } catch {}
}



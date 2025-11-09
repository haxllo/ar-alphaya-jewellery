'use client'

import { useEffect } from 'react'
import { analytics } from '@/lib/analytics'

export function useAnalytics() {
  useEffect(() => {
    analytics.init()
  }, [])

  return analytics
}

// Product view tracking hook
export function useProductView(product: any) {
  useEffect(() => {
    if (product) {
      analytics.viewItem(product)
    }
  }, [product])
}

// Page view tracking hook
export function usePageView(pageName: string, pageData?: any) {
  useEffect(() => {
    analytics.track({
      event: 'page_view',
      page_name: pageName,
      ...pageData
    })
  }, [pageName, pageData])
}

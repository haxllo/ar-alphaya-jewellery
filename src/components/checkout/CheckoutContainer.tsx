'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CheckoutContainerProps {
  children: ReactNode
  className?: string
}

export default function CheckoutContainer({
  children,
  className,
}: CheckoutContainerProps) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>
      {children}
    </div>
  )
}

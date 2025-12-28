/**
 * PayPal Event Logger
 * Centralized logging for PayPal operations
 */

type LogLevel = 'info' | 'warn' | 'error'

interface PayPalLogData {
  event: string
  level?: LogLevel
  orderId?: string
  amount?: string
  error?: any
  metadata?: Record<string, any>
}

export function logPayPalEvent(data: PayPalLogData) {
  const { event, level = 'info', orderId, amount, error, metadata } = data
  
  const logData = {
    timestamp: new Date().toISOString(),
    service: 'PayPal',
    event,
    orderId,
    amount,
    error: error ? {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    } : undefined,
    ...metadata
  }

  // Console logging
  const logMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
  logMethod(`[PayPal] ${event}:`, logData)

  // Send to monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with your monitoring service (Sentry, DataDog, etc.)
    // Example for Sentry:
    // if (level === 'error' && error) {
    //   Sentry.captureException(error, { 
    //     tags: { service: 'PayPal', event },
    //     extra: logData 
    //   })
    // } else {
    //   Sentry.captureMessage(`PayPal: ${event}`, { 
    //     level: level === 'warn' ? 'warning' : 'info',
    //     extra: logData 
    //   })
    // }
  }
}

import { Resend } from 'resend'
import { renderAbandonedCartEmail } from './abandonedCartTemplate'

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions) {
  const resend = getResend()
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, email not sent')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    // Get from email from environment variable or use default
    const fromEmail = options.from || process.env.EMAIL_FROM || 'AR Alphaya Jewellery <noreply@aralphayajewellery.com>'
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: [options.to],
      subject: options.subject,
      html: options.html,
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: String(error) }
  }
}

export async function sendAbandonedCartEmail(
  email: string,
  items: Array<{ name: string; price: string; quantity: number; image?: string }>
) {
  const siteName = 'AR Alphaya Jewellery'
  const checkoutUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout`
  
  const html = renderAbandonedCartEmail({
    siteName,
    checkoutUrl,
    items,
  })

  return sendEmail({
    to: email,
    subject: `Complete your ${siteName} purchase`,
    html,
  })
}

export interface OrderConfirmationEmailData {
  orderId: string
  customerEmail: string
  customerName: string
  orderDate: string
  items: Array<{
    name: string
    price: number
    quantity: number
    size?: string
    gemstone?: string
    image?: string
  }>
  subtotal: number
  shipping: number
  total: number
  paymentId?: string
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationEmailData) {
  const { renderOrderConfirmationEmail } = await import('./orderConfirmationTemplate')
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
    }).format(price)
  }
  
  const html = renderOrderConfirmationEmail({
    orderNumber: data.orderId,
    customerName: data.customerName,
    orderDate: data.orderDate,
    items: data.items.map(item => ({
      name: item.name,
      price: formatPrice(item.price * item.quantity),
      quantity: item.quantity,
      size: item.size,
      gemstone: item.gemstone,
      image: item.image,
    })),
    subtotal: formatPrice(data.subtotal),
    shipping: formatPrice(data.shipping),
    total: formatPrice(data.total),
    paymentMethod: data.paymentId ? `PayHere (${data.paymentId})` : 'PayHere',
    trackingUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account/orders`,
    supportEmail: process.env.EMAIL_FROM || 'info@aralphayajewellery.com',
  })

  return sendEmail({
    to: data.customerEmail,
    subject: `Order Confirmation #${data.orderId} - AR Alphaya Jewellery`,
    html,
  })
}

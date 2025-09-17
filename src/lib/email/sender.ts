import { Resend } from 'resend'
import { renderAbandonedCartEmail } from './abandonedCartTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, email not sent')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const result = await resend.emails.send({
      from: options.from || 'AR Alphaya Jewellery <noreply@alphayajewellery.com>',
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

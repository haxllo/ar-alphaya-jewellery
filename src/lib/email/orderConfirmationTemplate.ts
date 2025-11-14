// Order Confirmation Email Template

interface OrderItem {
  name: string
  price: string
  quantity: number
  size?: string
  gemstone?: string
  image?: string
}

interface OrderConfirmationData {
  orderNumber: string
  customerName: string
  orderDate: string
  items: OrderItem[]
  subtotal: string
  shipping: string
  total: string
  paymentMethod: string
  trackingUrl: string
  supportEmail: string
}

export function renderOrderConfirmationEmail(data: OrderConfirmationData): string {
  const {
    orderNumber,
    customerName,
    orderDate,
    items,
    subtotal,
    shipping,
    total,
    paymentMethod,
    trackingUrl,
    supportEmail,
  } = data

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${
            item.image
              ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />`
              : ''
          }
          <div>
            <strong>${item.name}</strong><br/>
            ${item.size ? `<small style="color: #6b7280;">Size: ${item.size}</small><br/>` : ''}
            ${item.gemstone ? `<small style="color: #6b7280;">${item.gemstone}</small><br/>` : ''}
            <small style="color: #6b7280;">Qty: ${item.quantity}</small>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; white-space: nowrap;">
        <strong>${item.price}</strong>
      </td>
    </tr>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #121212; color: #ffffff; padding: 32px 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">AR Alphaya Jewellery</h1>
      <p style="margin: 8px 0 0 0; color: #d1d5db;">Bespoke Sri Lankan Jewellery</p>
    </div>

    <!-- Success Message -->
    <div style="padding: 32px 24px; text-align: center; background-color: #f0fdf4; border-bottom: 2px solid #10b981;">
      <div style="display: inline-block; width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; margin-bottom: 16px;">
        <span style="color: white; font-size: 36px; line-height: 60px;">✓</span>
      </div>
      <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #065f46;">Order Confirmed!</h2>
      <p style="margin: 0; color: #047857;">Thank you for your purchase, ${customerName}</p>
    </div>

    <!-- Order Details -->
    <div style="padding: 32px 24px;">
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Order Number:</td>
            <td style="padding: 4px 0; text-align: right;"><strong>${orderNumber}</strong></td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Order Date:</td>
            <td style="padding: 4px 0; text-align: right;">${orderDate}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Payment Method:</td>
            <td style="padding: 4px 0; text-align: right;">${paymentMethod}</td>
          </tr>
        </table>
      </div>

      <!-- Order Items -->
      <h3 style="margin: 0 0 16px 0; font-size: 18px;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        ${itemsHtml}
      </table>

      <!-- Order Summary -->
      <div style="margin-top: 24px; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Subtotal:</td>
            <td style="padding: 4px 0; text-align: right;">${subtotal}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Shipping:</td>
            <td style="padding: 4px 0; text-align: right;">${shipping}</td>
          </tr>
          <tr style="border-top: 2px solid #e5e7eb;">
            <td style="padding: 8px 0 0 0; font-size: 18px;"><strong>Total:</strong></td>
            <td style="padding: 8px 0 0 0; text-align: right; font-size: 18px;"><strong>${total}</strong></td>
          </tr>
        </table>
      </div>

      <!-- Next Steps -->
      <div style="margin-top: 32px; padding: 16px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e40af;">What's Next?</h3>
        <ul style="margin: 0; padding-left: 20px; color: #1e3a8a;">
          <li style="margin-bottom: 8px;">We'll prepare your items for shipping</li>
          <li style="margin-bottom: 8px;">You'll receive tracking information within 2-3 business days</li>
          <li>Your order will be delivered within 5-7 business days</li>
        </ul>
      </div>

      <!-- CTA Button -->
      <div style="margin-top: 32px; text-align: center;">
        <a href="${trackingUrl}" style="display: inline-block; background-color: #121212; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Track Your Order
        </a>
      </div>

      <!-- Support -->
      <div style="margin-top: 32px; text-align: center; color: #6b7280; font-size: 14px;">
        <p>Need help? Contact us at <a href="mailto:${supportEmail}" style="color: #2563eb;">${supportEmail}</a></p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} AR Alphaya Jewellery. All rights reserved.</p>
      <p style="margin: 0;">Bespoke Sri Lankan Jewellery</p>
    </div>
  </div>
</body>
</html>
  `
}

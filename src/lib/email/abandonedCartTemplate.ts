export function renderAbandonedCartEmail(opts: {
  siteName: string
  checkoutUrl: string
  items: Array<{ name: string; price: string; quantity: number; image?: string }>
}) {
  const { siteName, checkoutUrl, items } = opts
  const rows = items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 0;vertical-align:top;">
          ${it.image ? `<img src="${it.image}" alt="${it.name}" width="64" height="64" style="border-radius:6px;object-fit:cover;"/>` : ''}
        </td>
        <td style="padding:8px 0;vertical-align:top;">
          <div style="font-weight:600;color:#0f172a">${it.name}</div>
          <div style="color:#334155;font-size:13px">Qty: ${it.quantity} • ${it.price}</div>
        </td>
      </tr>`
    )
    .join('')

  return `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Complete your purchase</title>
  </head>
  <body style="margin:0;padding:0;background:#f8fafc">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:24px">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;padding:24px">
            <tr><td>
              <h1 style="margin:0 0 8px 0;color:#0f172a;font-size:22px;font-family:Inter,Arial,sans-serif">You left something behind</h1>
              <p style="margin:0 0 16px 0;color:#334155;font-size:14px;font-family:Inter,Arial,sans-serif">Your ${siteName} cart is waiting. Complete your order while items are still in stock.</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rows}
              </table>

              <div style="text-align:center;margin-top:20px">
                <a href="${checkoutUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">Return to checkout</a>
              </div>

              <p style="margin:16px 0 0 0;color:#64748b;font-size:12px">If you already completed your purchase, you can safely ignore this message.</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`
}



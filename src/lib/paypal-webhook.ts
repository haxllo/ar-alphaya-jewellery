/**
 * PayPal Webhook Signature Verification
 * 
 * Verifies webhook events are genuinely from PayPal
 * https://developer.paypal.com/api/rest/webhooks/
 */

import crypto from 'crypto';

const { PAYPAL_WEBHOOK_ID, NEXT_PUBLIC_PAYPAL_SANDBOX } = process.env;

/**
 * Verify PayPal Webhook Signature
 * 
 * @param webhookEvent - The webhook event body as string
 * @param headers - Request headers containing signature info
 * @returns boolean indicating if signature is valid
 */
export async function verifyPayPalWebhook(
  webhookEvent: string,
  headers: Headers
): Promise<boolean> {
  try {
    // Extract required headers
    const transmissionId = headers.get('paypal-transmission-id');
    const transmissionTime = headers.get('paypal-transmission-time');
    const transmissionSig = headers.get('paypal-transmission-sig');
    const certUrl = headers.get('paypal-cert-url');
    const authAlgo = headers.get('paypal-auth-algo');

    if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
      console.error('[PayPal Webhook] Missing required headers');
      return false;
    }

    if (!PAYPAL_WEBHOOK_ID) {
      console.error('[PayPal Webhook] PAYPAL_WEBHOOK_ID not configured');
      return false;
    }

    // Verify cert URL is from PayPal
    const validCertDomain = NEXT_PUBLIC_PAYPAL_SANDBOX === 'true'
      ? 'api-m.sandbox.paypal.com'
      : 'api-m.paypal.com';
    
    if (!certUrl.includes(validCertDomain)) {
      console.error('[PayPal Webhook] Invalid cert URL domain');
      return false;
    }

    // Construct the expected signature string
    const expectedSig = `${transmissionId}|${transmissionTime}|${PAYPAL_WEBHOOK_ID}|${crc32(webhookEvent)}`;

    // Fetch PayPal's public certificate
    const certResponse = await fetch(certUrl);
    if (!certResponse.ok) {
      console.error('[PayPal Webhook] Failed to fetch certificate');
      return false;
    }
    
    const certificate = await certResponse.text();

    // Verify the signature
    const verifier = crypto.createVerify('SHA256');
    verifier.update(expectedSig);
    const isValid = verifier.verify(certificate, transmissionSig, 'base64');

    return isValid;
  } catch (error) {
    console.error('[PayPal Webhook] Verification error:', error);
    return false;
  }
}

/**
 * Calculate CRC32 checksum
 */
function crc32(str: string): number {
  const table: number[] = [];
  let crc = 0 ^ -1;

  // Generate CRC32 table
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }

  // Calculate CRC32
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xff];
  }

  return (crc ^ -1) >>> 0;
}

/**
 * Parse PayPal Webhook Event Type
 */
export type PayPalWebhookEventType =
  | 'PAYMENT.CAPTURE.COMPLETED'
  | 'PAYMENT.CAPTURE.DENIED'
  | 'PAYMENT.CAPTURE.PENDING'
  | 'PAYMENT.CAPTURE.REFUNDED'
  | 'PAYMENT.CAPTURE.REVERSED'
  | 'CHECKOUT.ORDER.APPROVED'
  | 'CHECKOUT.ORDER.COMPLETED'
  | string;

export interface PayPalWebhookEvent {
  id: string;
  event_type: PayPalWebhookEventType;
  resource_type: string;
  summary: string;
  resource: any;
  create_time: string;
}

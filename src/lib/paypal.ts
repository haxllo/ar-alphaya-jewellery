import crypto from 'crypto';

const { 
  PAYPAL_CLIENT_ID, 
  PAYPAL_CLIENT_SECRET, 
  NEXT_PUBLIC_PAYPAL_SANDBOX,
  NEXT_PUBLIC_APP_URL 
} = process.env;

const base = NEXT_PUBLIC_PAYPAL_SANDBOX === 'true' 
  ? "https://api-m.sandbox.paypal.com" 
  : "https://api-m.paypal.com";

export async function generatePayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("MISSING_PAYPAL_CREDENTIALS");
  }
  
  const auth = Buffer.from(
    PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
  ).toString("base64");
  
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  
  const data = await response.json();
  return data.access_token;
}

export async function createPayPalOrder(amount: string, orderNumber: string) {
  const accessToken = await generatePayPalAccessToken();
  const url = `${base}/v2/checkout/orders`;
  
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: orderNumber,
        amount: {
          currency_code: "USD", // PayPal doesn't support LKR. Need to convert.
          value: amount,
        },
      },
    ],
    application_context: {
       brand_name: "AR ALPHAYA",
       shipping_preference: "NO_SHIPPING",
       user_action: "PAY_NOW",
       return_url: `${NEXT_PUBLIC_APP_URL}/checkout/success`,
       cancel_url: `${NEXT_PUBLIC_APP_URL}/checkout`
    }
  };
  
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  
  const data = await response.json();
  return data;
}

export async function capturePayPalOrder(orderID: string) {
  const accessToken = await generatePayPalAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  const data = await response.json();
  return data;
}

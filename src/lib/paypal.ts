import crypto from 'crypto';
import { logPayPalEvent } from './paypal-logger';

const { 
  PAYPAL_CLIENT_ID, 
  PAYPAL_CLIENT_SECRET, 
  NEXT_PUBLIC_PAYPAL_SANDBOX,
  NEXT_PUBLIC_APP_URL 
} = process.env;

const base = NEXT_PUBLIC_PAYPAL_SANDBOX === 'true' 
  ? "https://api-m.sandbox.paypal.com" 
  : "https://api-m.paypal.com";

/**
 * PayPal Error Class
 */
class PayPalError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PayPalError';
  }
}

/**
 * Generate PayPal Access Token
 */
export async function generatePayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    logPayPalEvent({ 
      event: 'AccessToken.Failed', 
      level: 'error',
      error: new Error('Missing PayPal credentials') 
    });
    throw new PayPalError("Missing PayPal credentials", "MISSING_CREDENTIALS");
  }
  
  try {
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logPayPalEvent({ 
        event: 'AccessToken.Failed', 
        level: 'error',
        error: new Error(error.error_description || 'Token generation failed'),
        metadata: { statusCode: response.status }
      });
      throw new PayPalError(
        "Failed to generate access token",
        "AUTHENTICATION_FAILED",
        error
      );
    }
    
    const data = await response.json();
    logPayPalEvent({ event: 'AccessToken.Success', level: 'info' });
    return data.access_token;
  } catch (error) {
    if (error instanceof PayPalError) throw error;
    
    logPayPalEvent({ 
      event: 'AccessToken.Error', 
      level: 'error',
      error 
    });
    throw new PayPalError(
      "Network error during token generation",
      "NETWORK_ERROR",
      error
    );
  }
}

/**
 * Create PayPal Order with idempotency protection
 */
export async function createPayPalOrder(amount: string, orderNumber: string) {
  const idempotencyKey = crypto.randomUUID();
  
  logPayPalEvent({ 
    event: 'Order.Create.Start',
    orderId: orderNumber,
    amount,
    metadata: { idempotencyKey }
  });
  
  try {
    const accessToken = await generatePayPalAccessToken();
    const url = `${base}/v2/checkout/orders`;
    
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderNumber,
          custom_id: orderNumber, // For easier tracking in PayPal dashboard
          description: `Order ${orderNumber} - AR ALPHAYA Jewellery`,
          amount: {
            currency_code: "USD", // PayPal doesn't support LKR. Already converted.
            value: amount,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: amount
              }
            }
          },
        },
      ],
      application_context: {
        brand_name: "AR ALPHAYA",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: `${NEXT_PUBLIC_APP_URL}/checkout/success?order=${orderNumber}`,
        cancel_url: `${NEXT_PUBLIC_APP_URL}/checkout?cancelled=true&order=${orderNumber}`
      }
    };
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Request-Id": idempotencyKey, // Prevent duplicate charges
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      
      logPayPalEvent({ 
        event: 'Order.Create.Failed',
        level: 'error',
        orderId: orderNumber,
        amount,
        error: new Error(error.message || 'Order creation failed'),
        metadata: { 
          statusCode: response.status, 
          errorName: error.name,
          errorDetails: error.details 
        }
      });
      
      // Handle specific error cases
      if (error.name === 'INVALID_REQUEST') {
        throw new PayPalError('Invalid order data', 'INVALID_REQUEST', error);
      }
      if (error.name === 'AUTHORIZATION_ERROR') {
        throw new PayPalError('PayPal authentication failed', 'AUTHORIZATION_ERROR', error);
      }
      
      throw new PayPalError(
        error.message || 'Failed to create PayPal order',
        error.name || 'ORDER_CREATION_FAILED',
        error
      );
    }
    
    const data = await response.json();
    
    logPayPalEvent({ 
      event: 'Order.Create.Success',
      orderId: orderNumber,
      amount,
      metadata: { paypalOrderId: data.id }
    });
    
    return data;
  } catch (error) {
    if (error instanceof PayPalError) throw error;
    
    logPayPalEvent({ 
      event: 'Order.Create.Error',
      level: 'error',
      orderId: orderNumber,
      amount,
      error
    });
    
    throw new PayPalError(
      'Network error during order creation',
      'NETWORK_ERROR',
      error
    );
  }
}

/**
 * Get PayPal Order Details
 */
export async function getPayPalOrderDetails(orderID: string) {
  logPayPalEvent({ 
    event: 'Order.GetDetails.Start',
    metadata: { paypalOrderId: orderID }
  });
  
  try {
    const accessToken = await generatePayPalAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      
      logPayPalEvent({ 
        event: 'Order.GetDetails.Failed',
        level: 'error',
        error: new Error(error.message || 'Failed to get order details'),
        metadata: { 
          paypalOrderId: orderID,
          statusCode: response.status 
        }
      });
      
      throw new PayPalError(
        error.message || 'Failed to get order details',
        error.name || 'ORDER_DETAILS_FAILED',
        error
      );
    }
    
    const data = await response.json();
    
    logPayPalEvent({ 
      event: 'Order.GetDetails.Success',
      metadata: { 
        paypalOrderId: orderID,
        status: data.status,
        referenceId: data.purchase_units?.[0]?.reference_id
      }
    });
    
    return data;
  } catch (error) {
    if (error instanceof PayPalError) throw error;
    
    logPayPalEvent({ 
      event: 'Order.GetDetails.Error',
      level: 'error',
      error,
      metadata: { paypalOrderId: orderID }
    });
    
    throw new PayPalError(
      'Network error fetching order details',
      'NETWORK_ERROR',
      error
    );
  }
}

/**
 * Capture PayPal Order Payment
 */
export async function capturePayPalOrder(orderID: string) {
  logPayPalEvent({ 
    event: 'Order.Capture.Start',
    metadata: { paypalOrderId: orderID }
  });
  
  try {
    const accessToken = await generatePayPalAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      
      logPayPalEvent({ 
        event: 'Order.Capture.Failed',
        level: 'error',
        error: new Error(error.message || 'Failed to capture order'),
        metadata: { 
          paypalOrderId: orderID,
          statusCode: response.status,
          errorName: error.name
        }
      });
      
      // Handle specific error cases
      if (error.name === 'UNPROCESSABLE_ENTITY') {
        throw new PayPalError('Order cannot be captured', 'UNPROCESSABLE_ENTITY', error);
      }
      
      throw new PayPalError(
        error.message || 'Failed to capture PayPal order',
        error.name || 'CAPTURE_FAILED',
        error
      );
    }
    
    const data = await response.json();
    
    logPayPalEvent({ 
      event: 'Order.Capture.Success',
      metadata: { 
        paypalOrderId: orderID,
        captureId: data.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        status: data.status
      }
    });
    
    return data;
  } catch (error) {
    if (error instanceof PayPalError) throw error;
    
    logPayPalEvent({ 
      event: 'Order.Capture.Error',
      level: 'error',
      error,
      metadata: { paypalOrderId: orderID }
    });
    
    throw new PayPalError(
      'Network error during order capture',
      'NETWORK_ERROR',
      error
    );
  }
}

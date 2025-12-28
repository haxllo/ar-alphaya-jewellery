import braintree from 'braintree'

const environment = process.env.NEXT_PUBLIC_BRAINTREE_ENVIRONMENT === 'production'
  ? braintree.Environment.Production
  : braintree.Environment.Sandbox

// Initialize Braintree gateway
// Credentials are loaded from environment variables
const gateway = new braintree.BraintreeGateway({
  environment,
  merchantId: process.env.BRAINTREE_MERCHANT_ID!,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY!,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY!
})

export { gateway }

// Helper to generate client token
export async function generateClientToken(customerId?: string): Promise<string> {
  const options: braintree.ClientTokenRequest = {}
  
  if (customerId) {
    options.customerId = customerId
  }
  
  const response = await gateway.clientToken.generate(options)
  return response.clientToken
}

// Helper to create a transaction
export async function createTransaction(
  amount: string,
  paymentMethodNonce: string,
  orderId: string,
  options?: {
    customerId?: string
    deviceData?: string
  }
): Promise<braintree.Transaction> {
  const result = await gateway.transaction.sale({
    amount,
    paymentMethodNonce,
    orderId,
    options: {
      submitForSettlement: true
    },
    ...(options?.customerId && { customerId: options.customerId }),
    ...(options?.deviceData && { deviceData: options.deviceData })
  })

  if (!result.success) {
    throw new Error(result.message || 'Transaction failed')
  }

  return result.transaction
}

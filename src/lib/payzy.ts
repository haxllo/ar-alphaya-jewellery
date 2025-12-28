import crypto from 'crypto';

export interface PayzyPayload {
  x_test_mode: string;
  x_shopid: string;
  x_amount: string;
  x_order_id: string;
  x_response_url: string;
  x_first_name: string;
  x_last_name: string;
  x_company?: string;
  x_address: string;
  x_country: string;
  x_state: string;
  x_city: string;
  x_zip: string;
  x_phone: string;
  x_email: string;
  x_ship_to_first_name: string;
  x_ship_to_last_name: string;
  x_ship_to_company?: string;
  x_ship_to_address: string;
  x_ship_to_country: string;
  x_ship_to_state: string;
  x_ship_to_city: string;
  x_ship_to_zip: string;
  x_freight: string;
  x_version: string;
  x_platform: string;
  signed_field_names: string;
}

export interface PayzyResponseParams {
  x_order_id: string;
  response_code: string;
  signature: string;
}

export function generatePayzySignature(payload: PayzyPayload, secretKey: string): string {
  // Construct the string exactly as required by Payzy documentation
  // Note: The order MUST be preserved as per their docs
  
  // Format: key=value,key=value,...
  const list = [
    `x_test_mode=${payload.x_test_mode}`,
    `x_shopid=${payload.x_shopid}`,
    `x_amount=${payload.x_amount}`,
    `x_order_id=${payload.x_order_id}`,
    `x_response_url=${payload.x_response_url}`,
    `x_first_name=${payload.x_first_name}`,
    `x_last_name=${payload.x_last_name}`,
    `x_company=${payload.x_company || ''}`,
    `x_address=${payload.x_address}`,
    `x_country=${payload.x_country}`,
    `x_state=${payload.x_state}`,
    `x_city=${payload.x_city}`,
    `x_zip=${payload.x_zip}`,
    `x_phone=${payload.x_phone}`,
    `x_email=${payload.x_email}`,
    `x_ship_to_first_name=${payload.x_ship_to_first_name}`,
    `x_ship_to_last_name=${payload.x_ship_to_last_name}`,
    `x_ship_to_company=${payload.x_ship_to_company || ''}`,
    `x_ship_to_address=${payload.x_ship_to_address}`,
    `x_ship_to_country=${payload.x_ship_to_country}`,
    `x_ship_to_state=${payload.x_ship_to_state}`,
    `x_ship_to_city=${payload.x_ship_to_city}`,
    `x_ship_to_zip=${payload.x_ship_to_zip}`,
    `x_freight=${payload.x_freight}`,
    `x_platform=${payload.x_platform}`,
    `x_version${payload.x_version}`, // Note: Documentation shows "x_version" without "=" in one place, but with "=" in others? 
    // Checking python example: `x_version{x_version}` -> looks like typo in doc?
    // JS example: `",x_version" + x_version +` -> implies NO equals sign?
    // Wait, let's look at JS example closer: `",x_version" + x_version +`
    // If x_version is "1.0", result is "...x_platform=custom,x_version1.0,signed_field_names=..."
    // This is weird. Standard query params have =.
    // The PHP example: `"x_version$x_version",` -> same.
    // I will follow the example EXACTLY: `x_version` + value (no equals sign if the examples are correct, but it's suspicious).
    // actually, let's look at `list_data` in python: `f'x_version{x_version}'`
    // JS: `",x_version" + x_version`
    // BUT, look at `signed_field_names`: it lists `x_version`.
    // Let's assume the examples are correct about the missing `=` for `x_version` specifically in the signature string construction?
    // OR it is a typo in their doc examples.
    // However, usually hashing requires exact string match.
    // Let's look at the JS example again:
    // `",x_version" + x_version` -> if x_version="1.0", it becomes ",x_version1.0"
    // The previous field is `x_platform`.
    // It seems consistent in their bad examples. I will follow the example.
    
    `signed_field_names=${payload.signed_field_names}`
  ].join(',');

  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(list);
  const signature = hmac.digest('base64');
  
  return signature;
}

export function generatePayzyResponseSignature(order: PayzyPayload, responseCode: string, secretKey: string): string {
  // Reconstruct the data string for verification as per docs
  // "response_code=00,x_test_mode=..."
  
  const list = [
    `response_code=${responseCode}`,
    `x_test_mode=${order.x_test_mode}`,
    `x_shopid=${order.x_shopid}`,
    `x_amount=${order.x_amount}`,
    `x_order_id=${order.x_order_id}`,
    `x_response_url=${order.x_response_url}`,
    `x_first_name=${order.x_first_name}`,
    `x_last_name=${order.x_last_name}`,
    `x_company=${order.x_company || ''}`,
    `x_address=${order.x_address}`,
    `x_country=${order.x_country}`,
    `x_state=${order.x_state}`,
    `x_city=${order.x_city}`,
    `x_zip=${order.x_zip}`,
    `x_phone=${order.x_phone}`,
    `x_email=${order.x_email}`,
    `x_ship_to_first_name=${order.x_ship_to_first_name}`,
    `x_ship_to_last_name=${order.x_ship_to_last_name}`,
    `x_ship_to_company=${order.x_ship_to_company || ''}`,
    `x_ship_to_address=${order.x_ship_to_address}`,
    `x_ship_to_country=${order.x_ship_to_country}`,
    `x_ship_to_state=${order.x_ship_to_state}`,
    `x_ship_to_city=${order.x_ship_to_city}`,
    `x_ship_to_zip=${order.x_ship_to_zip}`,
    `x_freight=${order.x_freight}`,
    `x_platform=${order.x_platform}`,
    `x_version=${order.x_version}`, // Verification uses equals
    `signed_field_names=${order.signed_field_names}`
  ].join(',');

  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(list);
  const calculatedSignature = hmac.digest('base64');
  
  return calculatedSignature;
}

export function verifyPayzyResponse(
  order: PayzyPayload,
  responseCode: string,
  signatureToVerify: string,
  secretKey: string
): boolean {
  const calculatedSignature = generatePayzyResponseSignature(order, responseCode, secretKey);
  return calculatedSignature === signatureToVerify;
}

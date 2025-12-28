import { generatePayzySignature, verifyPayzyResponse, generatePayzyResponseSignature, PayzyPayload } from './payzy';
import assert from 'assert';

console.log('Running Payzy Integration Tests...');

const secretKey = 'test_secret_key_123';

const mockPayload: PayzyPayload = {
// ... same payload ...
  x_test_mode: 'on',
  x_shopid: '12345',
  x_amount: '100.00',
  x_order_id: 'ORDER-123',
  x_response_url: 'http://localhost:3000/callback',
  x_first_name: 'John',
  x_last_name: 'Doe',
  x_company: 'Acme',
  x_address: '123 St',
  x_country: 'Sri Lanka',
  x_state: 'Western',
  x_city: 'Colombo',
  x_zip: '00100',
  x_phone: '0771234567',
  x_email: 'john@example.com',
  x_ship_to_first_name: 'John',
  x_ship_to_last_name: 'Doe',
  x_ship_to_company: 'Acme',
  x_ship_to_address: '123 St',
  x_ship_to_country: 'Sri Lanka',
  x_ship_to_state: 'Western',
  x_ship_to_city: 'Colombo',
  x_ship_to_zip: '00100',
  x_freight: '0.00',
  x_version: '1.0',
  x_platform: 'custom',
  signed_field_names: 'x_test_mode,x_shopid,x_amount,x_order_id,x_response_url,x_first_name,x_last_name,x_company,x_address,x_country,x_state,x_city,x_zip,x_phone,x_email,x_ship_to_first_name,x_ship_to_last_name,x_ship_to_company,x_ship_to_address,x_ship_to_country,x_ship_to_state,x_ship_to_city,x_ship_to_zip,x_freight,x_platform,x_version,signed_field_names'
};

// Test 1: Generate Request Signature
try {
  const requestSignature = generatePayzySignature(mockPayload, secretKey);
  console.log('Generated Request Signature:', requestSignature);
  assert.ok(requestSignature && requestSignature.length > 0, 'Request Signature should be generated');
  
  // Test 2: Verify Response Signature
  // We must generate the response signature using the response logic (which might differ from request logic)
  const responseSignature = generatePayzyResponseSignature(mockPayload, '00', secretKey);
  console.log('Generated Response Signature:', responseSignature);

  const isValid = verifyPayzyResponse(mockPayload, '00', responseSignature, secretKey);
  assert.strictEqual(isValid, true, 'Signature verification should pass for correct data');
  console.log('✅ Test Passed: Signature verification successful');

  // Test 3: Verify Failure on Tampering
  const tamperedPayload = { ...mockPayload, x_amount: '101.00' };
  const isInvalid = verifyPayzyResponse(tamperedPayload, '00', responseSignature, secretKey);
  assert.strictEqual(isInvalid, false, 'Signature verification should fail for tampered data');
  console.log('✅ Test Passed: Signature verification correctly failed for tampered data');

  // Test 4: Verify Failure on Wrong Secret
  const isInvalidSecret = verifyPayzyResponse(mockPayload, '00', responseSignature, 'wrong_secret');
  assert.strictEqual(isInvalidSecret, false, 'Signature verification should fail for wrong secret');
  console.log('✅ Test Passed: Signature verification correctly failed for wrong secret');

} catch (error) {
  console.error('❌ Test Failed:', error);
  process.exit(1);
}

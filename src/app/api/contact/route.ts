import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware, applySecurityHeaders } from '@/lib/rate-limit';
import { validateContactForm, sanitizeString } from '@/lib/validation';
import { createErrorResponse, createValidationError, withErrorHandler } from '@/lib/error-handler';

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Apply security middleware
  const securityResponse = securityMiddleware(request, {
    rateLimitType: 'contact',
    endpointType: 'api',
  });
  
  if (securityResponse) {
    return applySecurityHeaders(securityResponse);
  }

  const body = await request.json();
  
  // Validate input
  const validatedData = validateContactForm(body);
  
  // Sanitize inputs
  const sanitizedData = {
    name: sanitizeString(validatedData.name),
    email: validatedData.email, // Email validation already done by Zod
    phone: validatedData.phone ? sanitizeString(validatedData.phone) : undefined,
    subject: sanitizeString(validatedData.subject),
    message: sanitizeString(validatedData.message),
  };

  // TODO: Send email or save to database
  // For now, just log the sanitized data (no sensitive info)
  console.log('Contact form submission:', {
    name: sanitizedData.name,
    email: sanitizedData.email,
    subject: sanitizedData.subject,
    timestamp: new Date().toISOString(),
    // Don't log IP or message content for privacy
  });

  const response = NextResponse.json(
    { 
      success: true, 
      message: 'Thank you for your message. We will get back to you soon!' 
    },
    { status: 200 }
  );

  return applySecurityHeaders(response);
});

export async function OPTIONS(request: NextRequest) {
  // Handle CORS preflight
  const securityResponse = securityMiddleware(request);
  if (securityResponse) {
    return applySecurityHeaders(securityResponse);
  }
  
  return new NextResponse(null, { status: 200 });
}

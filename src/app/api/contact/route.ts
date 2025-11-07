import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware, applySecurityHeaders } from '@/lib/rate-limit';
import { validateContactForm, sanitizeString } from '@/lib/validation';
import { createErrorResponse, createValidationError, withErrorHandler } from '@/lib/error-handler';
import { createServerClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/email/sender';

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
    budget: validatedData.budget ? sanitizeString(validatedData.budget) : undefined,
  };

  // Get client IP and user agent
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    // Save to Supabase
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        budget: sanitizedData.budget,
        ip_address: ipAddress !== 'unknown' ? ipAddress : null,
        user_agent: userAgent !== 'unknown' ? userAgent : null,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving contact form to Supabase:', error);
      throw new Error('Failed to save contact form submission');
    }

    // Send notification email (optional)
    if (process.env.EMAIL_FROM && process.env.RESEND_API_KEY) {
      try {
        await sendEmail({
          to: process.env.EMAIL_FROM,
          subject: `New Contact Form Submission: ${sanitizedData.subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${sanitizedData.name}</p>
            <p><strong>Email:</strong> ${sanitizedData.email}</p>
            ${sanitizedData.phone ? `<p><strong>Phone:</strong> ${sanitizedData.phone}</p>` : ''}
            <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
            ${sanitizedData.budget ? `<p><strong>Budget:</strong> ${sanitizedData.budget}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Submitted at: ${new Date().toISOString()}</small></p>
          `,
        });
      } catch (emailError) {
        // Log but don't fail the request if email fails
        console.error('Error sending notification email:', emailError);
      }
    }

    console.log('Contact form submission saved:', {
      id: data.id,
      email: sanitizedData.email,
      subject: sanitizedData.subject,
      timestamp: new Date().toISOString(),
    });

    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message. We will get back to you soon!' 
      },
      { status: 200 }
    );

    return applySecurityHeaders(response);
  } catch (error) {
    console.error('Contact form error:', error);
    throw error;
  }
});

export async function OPTIONS(request: NextRequest) {
  // Handle CORS preflight
  const securityResponse = securityMiddleware(request);
  if (securityResponse) {
    return applySecurityHeaders(securityResponse);
  }
  
  return new NextResponse(null, { status: 200 });
}

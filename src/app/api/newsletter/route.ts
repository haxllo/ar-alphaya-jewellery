import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  preferences: z.object({
    newProducts: z.boolean().optional(),
    sales: z.boolean().optional(),
    styleGuides: z.boolean().optional(),
    exclusiveEvents: z.boolean().optional(),
  }).optional(),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = newsletterSchema.parse(body);
    const email = validatedData.email.toLowerCase().trim();

    // Check rate limiting (simple check - you can enhance this)
    const supabase = createServerClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscriptions')
      .select('id, is_active, unsubscribed_at')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { 
            success: true, 
            message: "You're already subscribed to our newsletter!",
            subscriptionId: existing.id 
          },
          { status: 200 }
        );
      } else {
        // Reactivate subscription
        const { data, error } = await supabase
          .from('newsletter_subscriptions')
          .update({
            is_active: true,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
            source: validatedData.source,
            preferences: validatedData.preferences || {
              newProducts: true,
              sales: true,
              styleGuides: true,
              exclusiveEvents: true,
            },
            updated_at: new Date().toISOString(),
          })
          .eq('email', email)
          .select()
          .single();

        if (error) {
          console.error('Error reactivating newsletter subscription:', error);
          throw new Error('Failed to reactivate subscription');
        }

        return NextResponse.json(
          { 
            success: true, 
            message: 'Welcome back! Your subscription has been reactivated.',
            subscriptionId: data.id 
          },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email,
        is_active: true,
        source: validatedData.source,
        preferences: validatedData.preferences || {
          newProducts: true,
          sales: true,
          styleGuides: true,
          exclusiveEvents: true,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating newsletter subscription:', error);
      throw new Error('Failed to subscribe to newsletter');
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to our newsletter!',
        subscriptionId: data.id 
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.errors.map(e => e.message).join(', ') 
        },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('id, email, is_active, subscribed_at')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, subscribed: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        subscribed: data.is_active,
        subscriptionId: data.id,
        subscribedAt: data.subscribed_at 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter check error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}


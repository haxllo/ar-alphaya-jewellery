import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { z } from 'zod'

const waitlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  slug: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = waitlistSchema.parse(body)
    const email = validatedData.email.toLowerCase().trim()

    const supabase = createServerClient()

    // Check if already on waitlist
    const { data: existing } = await supabase
      .from('product_waitlist')
      .select('id, is_notified')
      .eq('product_id', validatedData.productId)
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.is_notified) {
        return NextResponse.json(
          { 
            success: true, 
            message: 'You\'re already on the waitlist for this product and have been notified.',
            waitlistId: existing.id 
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { 
            success: true, 
            message: 'You\'re already on the waitlist for this product.',
            waitlistId: existing.id 
          },
          { status: 200 }
        )
      }
    }

    // Add to waitlist
    const { data, error } = await supabase
      .from('product_waitlist')
      .insert({
        product_id: validatedData.productId,
        product_slug: validatedData.slug,
        email,
        is_notified: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding to waitlist:', error)
      throw new Error('Failed to add to waitlist')
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'You\'ve been added to the waitlist. We\'ll notify you when this product is back in stock!',
        waitlistId: data.id 
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.errors.map(e => e.message).join(', ') 
        },
        { status: 400 }
      )
    }

    console.error('Waitlist error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}



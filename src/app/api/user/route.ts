import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Return user data from session
    return NextResponse.json({ 
      user: session.user,
      authenticated: true 
    });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // TODO: Update user data in Supabase
    // You can use Supabase client to update user metadata
    // const supabase = createServerClient()
    // await supabase.auth.admin.updateUserById(session.user.id, { ... })
    
    console.log('User update request:', body);
    
    return NextResponse.json({ 
      message: 'User update endpoint - implement Supabase user update here',
      success: true
    });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

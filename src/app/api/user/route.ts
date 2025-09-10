import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request, new NextResponse());
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Return user information (excluding sensitive data)
    const userInfo = {
      id: session.user.sub,
      email: session.user.email,
      name: session.user.name,
      picture: session.user.picture,
      email_verified: session.user.email_verified,
      updated_at: session.user.updated_at,
      // Add any custom user metadata here
      user_metadata: session.user.user_metadata || {},
      app_metadata: session.user.app_metadata || {},
    };

    return NextResponse.json({ user: userInfo });
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
    const session = await getSession(request, new NextResponse());
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Here you could update user metadata via Auth0 Management API
    // For now, we'll just return the current user data
    // In a real implementation, you'd call the Auth0 Management API to update user data
    
    console.log('User update request:', body);
    
    return NextResponse.json({ 
      message: 'User update received',
      user: {
        id: session.user.sub,
        email: session.user.email,
        name: session.user.name,
        picture: session.user.picture,
      }
    });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

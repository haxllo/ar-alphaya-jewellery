import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appSession');
    
    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      cookieStore.delete('appSession');
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

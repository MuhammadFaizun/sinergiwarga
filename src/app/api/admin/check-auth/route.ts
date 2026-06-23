import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const adminToken = req.cookies.get('admin_token')?.value;

    if (adminToken === 'authenticated_session_token') {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error('Error checking admin auth status:', error);
    return NextResponse.json({ authenticated: false, error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

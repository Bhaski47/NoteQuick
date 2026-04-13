import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const response = NextResponse.json({ message: 'Token set successfully' });

    response.cookies.set({
      name: 'token',
      value: token,
      sameSite: 'strict',
      path: '/',
      maxAge: 86400000,
    });

    return response;
  } catch (error) {
    console.error('Error setting token:', error);
    return NextResponse.json(
      { message: 'Failed to set token' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const IS_DEV = process.env.NODE_ENV === 'development';

export async function GET(request: NextRequest) {
  // In development, use instant mock auth
  if (IS_DEV) {
    const host = request.headers.get('host') || 'localhost:2888';
    const protocol =
      request.headers.get('x-forwarded-proto') ||
      (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;

    // Redirect to dev callback which creates mock user instantly
    return NextResponse.redirect(
      new URL('/api/auth/callback?dev=true', baseUrl)
    );
  }

  // Production: Use real Discord OAuth
  if (!DISCORD_CLIENT_ID || !DISCORD_REDIRECT_URI) {
    return NextResponse.json(
      { error: 'Discord OAuth not configured' },
      { status: 500 }
    );
  }

  // Generate state parameter for CSRF protection
  const state = crypto.randomUUID();

  // Store state in a cookie for validation (short-lived, 10 minutes)
  const response = NextResponse.redirect(
    `https://discord.com/api/oauth2/authorize?${new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: DISCORD_REDIRECT_URI,
      response_type: 'code',
      scope: 'identify email',
      state: state,
    })}`
  );

  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  return response;
}

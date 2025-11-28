import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createSession } from '@/lib/session';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

export async function GET(request: NextRequest) {
  // Get the base URL from headers or environment
  const host = request.headers.get('host') || 'localhost:2888';
  const protocol =
    request.headers.get('x-forwarded-proto') ||
    (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;

  const { searchParams } = new URL(request.url);
  const isDev =
    process.env.NODE_ENV === 'development' &&
    searchParams.get('dev') === 'true';

  // DEV MODE: Instant mock auth without Discord - switches between admin and non-admin
  if (isDev) {
    try {
      await connectDB();

      // Check which user was last used (from cookie)
      const lastUserType =
        request.cookies.get('dev_last_user')?.value || 'admin';
      // Switch to the other user type
      const currentUserType = lastUserType === 'admin' ? 'nonadmin' : 'admin';

      // Create or get mock dev users
      const adminDiscordId = 'dev-user-admin';
      const nonAdminDiscordId = 'dev-user-nonadmin';

      const discordId =
        currentUserType === 'admin' ? adminDiscordId : nonAdminDiscordId;
      const isAdmin = currentUserType === 'admin';

      let user = await User.findOne({ discordId });

      if (user) {
        // Update existing dev user
        user.lastLoginAt = new Date();
        // Ensure admin status is correct
        user.isAdmin = isAdmin;
        await user.save();
      } else {
        // Create new dev user
        user = await User.create({
          discordId,
          username: isAdmin ? 'DevAdmin' : 'DevUser',
          globalName: isAdmin ? 'Dev Admin' : 'Dev User',
          avatar: null,
          email: isAdmin ? 'dev-admin@localhost' : 'dev-user@localhost',
          isAdmin,
          lastLoginAt: new Date(),
        });
      }

      // Create session
      const sessionToken = await createSession({
        userId: String(user._id),
        discordId: user.discordId,
        username: user.globalName || user.username,
        avatar: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
          : null,
        isAdmin: user.isAdmin ?? false,
      });

      // Create response and set session cookie
      const response = NextResponse.redirect(new URL('/', baseUrl));

      // Set session cookie
      response.cookies.set('session_token', sessionToken, {
        httpOnly: true,
        secure: false, // Dev mode - allow http
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      // Store which user type was just used for next switch
      response.cookies.set('dev_last_user', currentUserType, {
        httpOnly: false, // Allow client-side access for debugging
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      return response;
    } catch (error) {
      console.error('Dev auth error:', error);
      return NextResponse.redirect(new URL('/?error=dev_auth_failed', baseUrl));
    }
  }

  // PRODUCTION MODE: Real Discord OAuth
  try {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = request.cookies.get('oauth_state')?.value;

    // Validate state parameter
    if (!state || !storedState || state !== storedState) {
      return NextResponse.redirect(new URL('/?error=invalid_state', baseUrl));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/?error=no_code', baseUrl));
    }

    if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI) {
      return NextResponse.redirect(new URL('/?error=config_error', baseUrl));
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error('Discord token exchange error:', errorData);
      return NextResponse.redirect(
        new URL('/?error=token_exchange_failed', baseUrl)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user info from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(
        new URL('/?error=user_fetch_failed', baseUrl)
      );
    }

    const discordUser = await userResponse.json();

    // Connect to database
    await connectDB();

    // Find or create user
    let user = await User.findOne({ discordId: discordUser.id });

    if (user) {
      // Update existing user
      user.username = discordUser.username;
      user.discriminator = discordUser.discriminator || undefined;
      user.globalName = discordUser.global_name || undefined;
      user.avatar = discordUser.avatar;
      user.email = discordUser.email || undefined;
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        discordId: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator || undefined,
        globalName: discordUser.global_name || undefined,
        avatar: discordUser.avatar || null,
        email: discordUser.email || undefined,
        lastLoginAt: new Date(),
      });
    }

    // Create session
    const sessionToken = await createSession({
      userId: String(user._id),
      discordId: user.discordId,
      username: user.globalName || user.username,
      avatar: user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
        : null,
      isAdmin: user.isAdmin ?? false,
    });

    // Create response and set session cookie
    const response = NextResponse.redirect(new URL('/', baseUrl));

    // Clear OAuth state cookie
    response.cookies.delete('oauth_state');

    // Set session cookie
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', baseUrl));
  }
}

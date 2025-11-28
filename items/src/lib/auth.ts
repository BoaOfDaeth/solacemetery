import { NextRequest } from 'next/server';
import { getSession } from './session';

export interface AuthUser {
  userId: string;
  discordId: string;
  username: string;
  avatar: string | null;
  isAdmin: boolean;
}

/**
 * Get the current authenticated user from the request
 * Returns null if not authenticated
 */
export async function getCurrentUser(
  request: NextRequest
): Promise<AuthUser | null> {
  const sessionToken = request.cookies.get('session_token')?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await getSession(sessionToken);
  return session;
}

/**
 * Check if the request is authenticated
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(request);
  return user !== null;
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(request);
  return user?.isAdmin ?? false;
}

/**
 * Check if the current user is an admin (server component version)
 * Uses cookies() from next/headers
 */
export async function isAdminFromCookies(
  sessionToken: string | undefined
): Promise<boolean> {
  if (!sessionToken) {
    return false;
  }

  const session = await getSession(sessionToken);
  return session?.isAdmin ?? false;
}

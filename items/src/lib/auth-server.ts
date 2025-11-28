import { cookies } from 'next/headers';
import { isAdminFromCookies } from './auth';
import { getSession } from './session';

/**
 * Get current user in server components
 * Use this in layouts, pages, and server components
 */
export async function getServerUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await getSession(sessionToken);
  return session;
}

/**
 * Check if user is admin in server components
 */
export async function getServerIsAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  return await isAdminFromCookies(sessionToken);
}

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/session';

/**
 * Server action to handle logout
 */
export async function logout() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  // Delete the cookie
  cookieStore.delete('session_token');

  // Redirect to home page
  redirect('/');
}

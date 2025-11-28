import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value;

  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete('session_token');

  return response;
}

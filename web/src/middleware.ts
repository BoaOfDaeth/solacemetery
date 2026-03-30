import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function base64Encode(input: string) {
  if (typeof btoa === 'function') return btoa(input);
  // Fallback for non-edge runtimes
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Buffer } = require('buffer');
  return Buffer.from(input, 'utf-8').toString('base64');
}

export function middleware(request: NextRequest) {
  // Keep preflight requests unblocked
  if (request.method === 'OPTIONS') return NextResponse.next();

  const user = process.env.API_BASIC_USER;
  const pass = process.env.API_BASIC_PASS;

  if (!user || !pass) {
    return new NextResponse('API auth is not configured', { status: 500 });
  }

  const expected = `Basic ${base64Encode(`${user}:${pass}`)}`;
  const provided = request.headers.get('authorization') || '';

  if (provided !== expected) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'www-authenticate': 'Basic realm="Solacemetery API"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/logs/:path*'],
};


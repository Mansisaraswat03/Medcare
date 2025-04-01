import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const path = request.nextUrl.pathname;

  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/doctors', request.url));
  }

  if (!token && path.startsWith('/book-appointment')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/appointments/:path*',
    '/book-appointment/:path*',
    '/doctors/:path*',
  ]
};
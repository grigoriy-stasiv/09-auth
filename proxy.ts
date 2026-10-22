import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.getAll().some(({ name }) =>
    /session|token|auth/i.test(name),
  );
  const path = request.nextUrl.pathname;
  const isPrivate = path.startsWith('/notes') || path.startsWith('/profile');
  const isAuthPage = path === '/sign-in' || path === '/sign-up';

  if (isPrivate && !hasSessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  if (isAuthPage && hasSessionCookie) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};

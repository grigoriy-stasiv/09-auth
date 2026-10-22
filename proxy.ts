import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/notes', '/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const path = request.nextUrl.pathname;
  const isPrivate = privateRoutes.some((route) => path === route || path.startsWith(`${route}/`));
  const isAuthPage = publicRoutes.includes(path);
  let refreshedCookies: string[] = [];

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession({
        headers: { Cookie: cookieStore.toString() },
      });
      const setCookie = sessionResponse.headers['set-cookie'];
      refreshedCookies = setCookie
        ? (Array.isArray(setCookie) ? setCookie : [setCookie]).map((cookie) =>
            cookie.replace(/;\s*Domain=[^;]+/i, '').replace(/;\s*Path=[^;]+/i, '; Path=/'),
          )
        : [];
    } catch {
      refreshedCookies = [];
    }
  }

  const isAuthenticated = Boolean(accessToken || refreshedCookies.length);

  const response = isPrivate && !isAuthenticated
    ? NextResponse.redirect(new URL('/sign-in', request.url))
    : isAuthPage && isAuthenticated
      ? NextResponse.redirect(new URL('/', request.url))
      : NextResponse.next();
  for (const cookie of refreshedCookies) response.headers.append('Set-Cookie', cookie);
  return response;
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};

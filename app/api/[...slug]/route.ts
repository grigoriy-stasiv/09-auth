import { NextRequest, NextResponse } from 'next/server';

const backend = (process.env.NOTEHUB_API_URL || 'https://notehub-api.goit.study').replace(/\/$/, '');

async function forward(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api/, '');
  const target = new URL(`${backend}${path}`);
  target.search = request.nextUrl.search;
  const headers = new Headers();
  const cookie = request.headers.get('cookie');
  const contentType = request.headers.get('content-type');
  if (cookie) headers.set('cookie', cookie);
  if (contentType) headers.set('content-type', contentType);

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
    cache: 'no-store',
  });
  const response = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' },
  });

  for (const value of upstream.headers.getSetCookie()) {
    const localCookie = value
      .replace(/;\s*Domain=[^;]+/i, '')
      .replace(/;\s*Path=[^;]+/i, '; Path=/');
    response.headers.append('set-cookie', localCookie);
  }
  return response;
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;

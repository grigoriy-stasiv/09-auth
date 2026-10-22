import { NextRequest, NextResponse } from 'next/server';

const backend = (process.env.NOTEHUB_API_URL || 'https://notehub-api.goit.study').replace(/\/$/, '');

export async function proxyApiRequest(request: NextRequest, apiPath: string) {
  const target = new URL(`${backend}/${apiPath.replace(/^\//, '')}`);
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

  for (const cookieValue of upstream.headers.getSetCookie()) {
    response.headers.append(
      'set-cookie',
      cookieValue.replace(/;\s*Domain=[^;]+/i, '').replace(/;\s*Path=[^;]+/i, '; Path=/'),
    );
  }

  return response;
}

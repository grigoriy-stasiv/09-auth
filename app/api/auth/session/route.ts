import { NextRequest, NextResponse } from 'next/server';
import { proxyApiRequest } from '@/lib/api/proxy';

export async function GET(request: NextRequest) {
  const response = await proxyApiRequest(request, 'auth/session');
  if (response.status === 400 || response.status === 401) {
    return NextResponse.json(null, { status: 200 });
  }
  return response;
}

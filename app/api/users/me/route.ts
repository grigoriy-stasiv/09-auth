import { NextRequest } from 'next/server';
import { proxyApiRequest } from '@/lib/api/proxy';

export function GET(request: NextRequest) {
  return proxyApiRequest(request, 'users/me');
}

export function PATCH(request: NextRequest) {
  return proxyApiRequest(request, 'users/me');
}

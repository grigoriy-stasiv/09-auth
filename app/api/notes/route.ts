import { NextRequest } from 'next/server';
import { proxyApiRequest } from '@/lib/api/proxy';

export function GET(request: NextRequest) {
  return proxyApiRequest(request, 'notes');
}

export function POST(request: NextRequest) {
  return proxyApiRequest(request, 'notes');
}

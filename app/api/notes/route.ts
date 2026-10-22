import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../api';
import { errorApiResponse, jsonApiResponse } from '../_utils/utils';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const search = request.nextUrl.searchParams.get('search') ?? '';
    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    const tag = request.nextUrl.searchParams.get('tag') ?? '';
    const response = await api.get('/notes', {
      params: { ...(search && { search }), page, perPage: 12, ...(tag && tag !== 'All' && { tag }) },
      headers: { Cookie: cookieStore.toString() },
    });
    return jsonApiResponse(response);
  } catch (error) {
    return errorApiResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();
    const response = await api.post('/notes', body, {
      headers: { Cookie: cookieStore.toString(), 'Content-Type': 'application/json' },
    });
    return jsonApiResponse(response);
  } catch (error) {
    return errorApiResponse(error);
  }
}

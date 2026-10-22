import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { errorApiResponse, jsonApiResponse } from '../../_utils/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const response = await api.get('/users/me', { headers: { Cookie: cookieStore.toString() } });
    return jsonApiResponse(response);
  } catch (error) {
    return errorApiResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();
    const response = await api.patch('/users/me', body, {
      headers: { Cookie: cookieStore.toString(), 'Content-Type': 'application/json' },
    });
    return jsonApiResponse(response);
  } catch (error) {
    return errorApiResponse(error);
  }
}

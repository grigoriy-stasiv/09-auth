import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { errorApiResponse } from '../../_utils/utils';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const response = await api.post('/auth/logout', null, {
      headers: { Cookie: cookieStore.toString() },
    });
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    const result = NextResponse.json(response.data ?? { message: 'Logged out successfully' }, { status: response.status });
    const setCookies = response.headers['set-cookie'];
    if (setCookies) {
      for (const cookie of Array.isArray(setCookies) ? setCookies : [setCookies]) {
        result.headers.append('Set-Cookie', cookie.replace(/;\s*Domain=[^;]+/i, ''));
      }
    }
    return result;
  } catch (error) {
    return errorApiResponse(error);
  }
}

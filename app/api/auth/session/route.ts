import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    if (accessToken) return NextResponse.json({ success: true });
    if (!refreshToken) return NextResponse.json({ success: false });

    const response = await api.get('/auth/session', { headers: { Cookie: cookieStore.toString() } });
    const result = NextResponse.json({ success: true }, { status: response.status });
    const setCookies = response.headers['set-cookie'];
    if (setCookies) {
      for (const cookie of Array.isArray(setCookies) ? setCookies : [setCookies]) {
        result.headers.append('Set-Cookie', cookie.replace(/;\s*Domain=[^;]+/i, '').replace(/;\s*Path=[^;]+/i, '; Path=/'));
      }
    }
    return result;
  } catch (error) {
    logErrorResponse(error);
    return NextResponse.json({ success: false });
  }
}

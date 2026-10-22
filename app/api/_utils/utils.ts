import { NextResponse } from 'next/server';
import type { AxiosError, AxiosResponse } from 'axios';

export function logErrorResponse(error: unknown) {
  console.error('API request failed:', error);
}

export function jsonApiResponse<T>(response: AxiosResponse<T>) {
  const result = [204, 205, 304].includes(response.status)
    ? new NextResponse(null, { status: response.status })
    : NextResponse.json(response.data, { status: response.status });
  const cookies = response.headers['set-cookie'];
  if (cookies) {
    for (const cookie of Array.isArray(cookies) ? cookies : [cookies]) {
      result.headers.append(
        'Set-Cookie',
        cookie.replace(/;\s*Domain=[^;]+/i, '').replace(/;\s*Path=[^;]+/i, '; Path=/'),
      );
    }
  }
  return result;
}

export function errorApiResponse(error: unknown) {
  if (isAxiosErrorLike(error)) {
    logErrorResponse(error.response?.data);
    return NextResponse.json(
      { error: error.message, response: error.response?.data },
      { status: error.response?.status ?? 500 },
    );
  }

  logErrorResponse(error instanceof Error ? { message: error.message } : error);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

function isAxiosErrorLike(error: unknown): error is AxiosError {
  return Boolean(error && typeof error === 'object' && 'isAxiosError' in error);
}

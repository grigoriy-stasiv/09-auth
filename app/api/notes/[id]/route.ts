import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { errorApiResponse, jsonApiResponse } from '../../_utils/utils';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const response = await api.get(`/notes/${encodeURIComponent(id)}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return jsonApiResponse(response);
  } catch (error) {
    return errorApiResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const response = await api.delete(`/notes/${encodeURIComponent(id)}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return jsonApiResponse(response);
  } catch (error) {
    return errorApiResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const body = await request.json();
    const response = await api.patch(`/notes/${encodeURIComponent(id)}`, body, {
      headers: { Cookie: cookieStore.toString(), 'Content-Type': 'application/json' },
    });
    return jsonApiResponse(response);
  } catch (error) {
    return errorApiResponse(error);
  }
}

import { NextRequest } from 'next/server';
import { api } from '../../api';
import { errorApiResponse, jsonApiResponse } from '../../_utils/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await api.post('/auth/login', body);
    return jsonApiResponse(response);
  } catch (error) {
    return errorApiResponse(error);
  }
}

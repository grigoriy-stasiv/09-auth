import 'server-only';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import type { Note } from '@/types/note';
import type { FetchNotesResponse } from '@/types/api';
import type { User } from '@/types/user';
import { normalizeNoteTag } from './api';

const baseURL = (process.env.NOTEHUB_API_URL || 'https://notehub-api.goit.study').replace(/\/$/, '');

async function getServerApi() {
  const cookieHeader = (await cookies()).toString();
  return axios.create({ baseURL, headers: cookieHeader ? { Cookie: cookieHeader } : {} });
}

export async function fetchNotes(params: { page: number; perPage: number; search: string; tag?: string }) {
  const client = await getServerApi();
  const { data } = await client.get<FetchNotesResponse>('/notes', { params: { ...params, tag: normalizeNoteTag(params.tag) } });
  return data;
}

export async function fetchNoteById(id: string) {
  const client = await getServerApi();
  const { data } = await client.get<Note>(`/notes/${id}`);
  return data;
}

export async function getMe() {
  const client = await getServerApi();
  const { data } = await client.get<User>('/users/me');
  return data;
}

export async function checkSession(config?: AxiosRequestConfig): Promise<AxiosResponse<User | null>> {
  const client = await getServerApi();
  return client.get<User | null>('/auth/session', config);
}
